/**
 * CEM analyzer plugin that sets the types of the public API of each custom
 * element from its TypeScript declaration file. The analyzer reads only the
 * JavaScript sources, where an event is a `CustomEvent` without a detail type.
 *
 * The plugin compiles a program per element with a module that declares a
 * variable of the element type, like `({} as ComboBox)`. The element type takes
 * the defaults of its type parameters, such as `any` for `TItem`. The programs
 * share the parsed files. A program per element keeps the order of union
 * members as declared, which depends on the types a program creates first.
 *
 * - An event gets its type from the event map of the element, which the
 *   `addEventListener` overload of the element class names. When the map
 *   overrides an event of `HTMLElementEventMap`, the type of the map wins.
 * - A field gets the type of the property, and a method gets the types of the
 *   parameters and the return value of its signature. Static members come from
 *   the class. A member that the declaration file lacks keeps its JSDoc types,
 *   also when the default library declares it, like `autocorrect` of `HTMLElement`.
 * - Each type lists the types of the project that its text names in
 *   `references`, with the module of the declaration file and the position.
 */
import path from 'node:path';
import ts from 'typescript';
import { getElementEntries, rootDir as defaultRootDir } from '../lib/cem-helpers.js';

const FORMAT_FLAGS = ts.TypeFormatFlags.NoTruncation;

/**
 * @param {string} rootDir the directory of `tsconfig.json` and of the module paths of the manifest
 * @param {import('../lib/cem-helpers.js').ElementEntry[]} entries
 * @return {Array<{ entry: object, program: ts.Program, instanceType: ts.Type, classType: ts.Type }>}
 */
function compileElements(rootDir, entries) {
  const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error(`tsconfig.json not found in ${rootDir}`);
  }
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, rootDir);

  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  const sourceFiles = new Map();
  const elementSources = new Map();
  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    if (elementSources.has(fileName)) {
      return ts.createSourceFile(fileName, elementSources.get(fileName), languageVersion, true, ts.ScriptKind.TS);
    }
    if (!sourceFiles.has(fileName)) {
      sourceFiles.set(fileName, getSourceFile(fileName, languageVersion, ...rest));
    }
    return sourceFiles.get(fileName);
  };

  return entries.flatMap((entry, index) => {
    const fileName = path.join(rootDir, `__cem-types-${index}__.ts`);
    const { name } = entry.declaration;
    elementSources.set(fileName, `import { ${name} } from './${entry.path}';\ndeclare const element: ${name};\n`);
    const program = ts.createProgram({ rootNames: [fileName], options, host });
    const checker = program.getTypeChecker();
    const [importStatement, variableStatement] = program.getSourceFile(fileName).statements;
    const instanceType = checker.getTypeAtLocation(variableStatement.declarationList.declarations[0].name);
    // A module without a declaration file resolves to `any`
    if (instanceType.flags & ts.TypeFlags.Any) {
      return [];
    }
    const classSymbol = checker.getSymbolAtLocation(importStatement.importClause.namedBindings.elements[0].name);
    const classType = checker.getTypeOfSymbol(checker.getAliasedSymbol(classSymbol));
    return [{ entry, program, instanceType, classType }];
  });
}

/**
 * @param {ts.Program} program
 * @param {ts.Symbol | undefined} symbol
 * @return {boolean} whether only the default library declares the symbol
 */
function isLibrary(program, symbol) {
  return !!symbol?.declarations?.every((declaration) =>
    program.isSourceFileDefaultLibrary(declaration.getSourceFile()),
  );
}

/**
 * Finds an event in the map. In a map such as `DialogCustomEventMap & HTMLElementEventMap`,
 * the own part of the intersection wins over the default library.
 * @param {ts.Program} program
 * @param {ts.Type} eventMap
 * @param {string} name
 * @return {ts.Symbol | undefined}
 */
function findEvent(program, eventMap, name) {
  const maps = eventMap.isIntersection()
    ? [...eventMap.types.filter((type) => !isLibrary(program, type.symbol)), eventMap]
    : [eventMap];
  return maps.map((map) => map.getProperty(name)).find(Boolean);
}

/**
 * Finds `XEventMap` in `addEventListener<K extends keyof XEventMap>(type: K, listener: (ev: XEventMap[K]) => void)`.
 * @param {ts.TypeChecker} checker
 * @param {ts.Type} instanceType
 * @return {ts.Type | undefined}
 */
function findEventMap(checker, instanceType) {
  const addEventListener = instanceType.getProperty('addEventListener');
  if (!addEventListener) {
    return undefined;
  }
  for (const signature of checker.getTypeOfSymbol(addEventListener).getCallSignatures()) {
    const listener = signature.getParameters()[1];
    for (const listenerSignature of listener ? checker.getTypeOfSymbol(listener).getCallSignatures() : []) {
      const event = listenerSignature.getParameters()[0];
      const eventType = event && checker.getTypeOfSymbol(event);
      if (eventType && eventType.flags & ts.TypeFlags.IndexedAccess) {
        return eventType.objectType;
      }
    }
  }
  return undefined;
}

/**
 * Collects the named types that a type uses, such as aliases, interfaces and
 * classes, without the members of an alias, which the type text does not show.
 * @param {ts.TypeChecker} checker
 * @param {ts.Type} type
 * @param {Set<ts.Symbol>} [symbols]
 * @param {Set<ts.Type>} [visited]
 * @return {Set<ts.Symbol>}
 */
function collectSymbols(checker, type, symbols = new Set(), visited = new Set()) {
  if (visited.has(type)) {
    return symbols;
  }
  visited.add(type);
  const visit = (part) => collectSymbols(checker, part, symbols, visited);
  if (type.aliasSymbol) {
    symbols.add(type.aliasSymbol);
    (type.aliasTypeArguments || []).forEach(visit);
  } else if (type.isUnionOrIntersection()) {
    type.types.forEach(visit);
  } else if (type.flags & ts.TypeFlags.Object) {
    if (type.objectFlags & ts.ObjectFlags.Reference) {
      symbols.add(type.target.symbol);
      checker.getTypeArguments(type).forEach(visit);
    } else if (
      type.symbol &&
      type.symbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface | ts.SymbolFlags.Enum)
    ) {
      symbols.add(type.symbol);
    } else {
      // A function type or an object literal type
      for (const signature of [...type.getCallSignatures(), ...type.getConstructSignatures()]) {
        signature.getParameters().forEach((parameter) => visit(checker.getTypeOfSymbol(parameter)));
        visit(signature.getReturnType());
      }
      type.getProperties().forEach((property) => visit(checker.getTypeOfSymbol(property)));
    }
  }
  return symbols;
}

/**
 * @param {{ checker: ts.TypeChecker, rootDir: string }} context
 * @param {ts.Type} type
 * @param {string} text the printed type
 * @param {ts.Node | undefined} location the declaration, which has the names of its type in scope
 * @return {object[]} the CEM type references, in the order of the text
 */
function findReferences({ checker, rootDir }, type, text, location) {
  const symbols = new Map([...collectSymbols(checker, type)].map((symbol) => [symbol.name, symbol]));
  // A union keeps an alias of its members only for printing, as in `ChartStacking | undefined`
  for (const [name] of text.matchAll(/(?<![\w$.])[A-Za-z_$][\w$]*/gu)) {
    const symbol = !symbols.has(name) && location && checker.resolveName(name, location, ts.SymbolFlags.Type, false);
    if (symbol) {
      symbols.set(name, symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);
    }
  }
  return [...symbols]
    .flatMap(([name, symbol]) => {
      const fileName = symbol.declarations?.[0]?.getSourceFile().fileName;
      const module = fileName && path.relative(rootDir, fileName);
      if (!module || module.startsWith('..') || module.includes('node_modules')) {
        return [];
      }
      return [...text.matchAll(new RegExp(`(?<![\\w$.])${name.replace(/\$/gu, '\\$')}(?![\\w$])`, 'gu'))].map(
        (match) => ({
          name,
          module: module.replace(/\.d\.ts$/u, '.js'),
          start: match.index,
          end: match.index + name.length,
        }),
      );
    })
    .sort((a, b) => a.start - b.start);
}

/**
 * @param {{ checker: ts.TypeChecker, rootDir: string }} context
 * @param {ts.Type} type
 * @param {ts.Node | undefined} location
 * @return {object} the CEM type
 */
function toType(context, type, location) {
  const text = context.checker.typeToString(type, undefined, FORMAT_FLAGS);
  const references = findReferences(context, type, text, location);
  return references.length ? { text, references } : { text };
}

/**
 * @param {object} context
 * @param {object} declaration
 * @param {ts.Type} instanceType
 */
function setEventTypes(context, declaration, instanceType) {
  const { program, checker } = context;
  const eventMap = findEventMap(checker, instanceType);
  if (!eventMap) {
    return;
  }
  for (const event of declaration.events || []) {
    const property = event.name && findEvent(program, eventMap, event.name);
    if (property) {
      event.type = toType(context, checker.getTypeOfSymbol(property), property.declarations?.[0]);
    }
  }
}

/**
 * @param {object} context
 * @param {ts.Symbol} parameter
 * @return {object} the CEM parameter, without the description
 */
function toParameter(context, parameter) {
  const { checker } = context;
  const declaration = parameter.valueDeclaration;
  const optional = checker.isOptionalParameter(declaration);
  const rest = !!declaration.dotDotDotToken;
  return {
    name: parameter.name,
    ...(optional && !rest ? { optional: true } : {}),
    ...(rest ? { rest: true } : {}),
    type: toType(context, checker.getTypeOfSymbol(parameter), declaration),
  };
}

/**
 * @param {object} context
 * @param {object} method
 * @param {ts.Signature} signature
 */
function setSignature(context, method, signature) {
  const descriptions = new Map((method.parameters || []).map((parameter) => [parameter.name, parameter.description]));
  const parameters = signature.getParameters().map((parameter) => {
    const description = descriptions.get(parameter.name);
    return { ...toParameter(context, parameter), ...(description ? { description } : {}) };
  });
  if (parameters.length) {
    method.parameters = parameters;
  } else {
    delete method.parameters;
  }
  method.return = { ...method.return, type: toType(context, signature.getReturnType(), signature.getDeclaration()) };
}

/**
 * @param {object} context
 * @param {object} declaration
 * @param {ts.Type} instanceType
 * @param {ts.Type} classType
 */
function setMemberTypes(context, declaration, instanceType, classType) {
  const { program, checker } = context;
  for (const member of declaration.members || []) {
    const property = (member.static ? classType : instanceType).getProperty(member.name);
    if (!property || isLibrary(program, property)) {
      continue;
    }
    const type = checker.getTypeOfSymbol(property);
    if (member.kind === 'field') {
      member.type = toType(context, type, property.declarations?.[0]);
    } else if (member.kind === 'method' && type.getCallSignatures().length) {
      setSignature(context, member, type.getCallSignatures()[0]);
    }
  }
}

/**
 * @param {{ rootDir?: string }} [options]
 * @return {object} the analyzer plugin
 */
export function typescriptTypesPlugin({ rootDir = defaultRootDir } = {}) {
  return {
    name: 'vaadin-typescript-types',

    packageLinkPhase({ customElementsManifest }) {
      for (const { entry, program, instanceType, classType } of compileElements(
        rootDir,
        getElementEntries(customElementsManifest),
      )) {
        const context = { program, checker: program.getTypeChecker(), rootDir };
        setEventTypes(context, entry.declaration, instanceType);
        setMemberTypes(context, entry.declaration, instanceType, classType);
      }
    },
  };
}
