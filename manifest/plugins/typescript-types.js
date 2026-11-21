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
 * @param {ts.Program} program
 * @param {object} declaration
 * @param {ts.Type} instanceType
 */
function setEventTypes(program, declaration, instanceType) {
  const checker = program.getTypeChecker();
  const eventMap = findEventMap(checker, instanceType);
  if (!eventMap) {
    return;
  }
  for (const event of declaration.events || []) {
    const property = event.name && findEvent(program, eventMap, event.name);
    if (property) {
      event.type = { text: checker.typeToString(checker.getTypeOfSymbol(property), undefined, FORMAT_FLAGS) };
    }
  }
}

/**
 * @param {ts.TypeChecker} checker
 * @param {ts.Symbol} parameter
 * @return {object} the CEM parameter, without the description
 */
function toParameter(checker, parameter) {
  const declaration = parameter.valueDeclaration;
  const optional = checker.isOptionalParameter(declaration);
  const rest = !!declaration.dotDotDotToken;
  const type = checker.getTypeOfSymbol(parameter);
  return {
    name: parameter.name,
    ...(optional && !rest ? { optional: true } : {}),
    ...(rest ? { rest: true } : {}),
    type: { text: checker.typeToString(type, undefined, FORMAT_FLAGS) },
  };
}

/**
 * @param {ts.TypeChecker} checker
 * @param {object} method
 * @param {ts.Signature} signature
 */
function setSignature(checker, method, signature) {
  const descriptions = new Map((method.parameters || []).map((parameter) => [parameter.name, parameter.description]));
  const parameters = signature.getParameters().map((parameter) => {
    const description = descriptions.get(parameter.name);
    return { ...toParameter(checker, parameter), ...(description ? { description } : {}) };
  });
  if (parameters.length) {
    method.parameters = parameters;
  } else {
    delete method.parameters;
  }
  method.return = {
    ...method.return,
    type: { text: checker.typeToString(signature.getReturnType(), undefined, FORMAT_FLAGS) },
  };
}

/**
 * @param {ts.Program} program
 * @param {object} declaration
 * @param {ts.Type} instanceType
 * @param {ts.Type} classType
 */
function setMemberTypes(program, declaration, instanceType, classType) {
  const checker = program.getTypeChecker();
  for (const member of declaration.members || []) {
    const property = (member.static ? classType : instanceType).getProperty(member.name);
    if (!property || isLibrary(program, property)) {
      continue;
    }
    const type = checker.getTypeOfSymbol(property);
    if (member.kind === 'field') {
      member.type = { text: checker.typeToString(type, undefined, FORMAT_FLAGS) };
    } else if (member.kind === 'method' && type.getCallSignatures().length) {
      setSignature(checker, member, type.getCallSignatures()[0]);
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
        setEventTypes(program, entry.declaration, instanceType);
        setMemberTypes(program, entry.declaration, instanceType, classType);
      }
    },
  };
}
