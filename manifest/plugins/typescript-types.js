/**
 * CEM analyzer plugin that sets the types of the public API of each custom
 * element from its TypeScript declaration file. The analyzer reads only the
 * JavaScript sources, where an event is a `CustomEvent` without a detail type.
 *
 * The plugin compiles one program with a module per element that declares a
 * variable of the element type, like `({} as ComboBox)`. The element type takes
 * the defaults of its type parameters, such as `any` for `TItem`.
 *
 * - An event gets its type from the event map of the element, which the
 *   `addEventListener` overload of the element class names. When the map
 *   overrides an event of `HTMLElementEventMap`, the type of the map wins.
 */
import path from 'node:path';
import ts from 'typescript';
import { getElementEntries, rootDir as defaultRootDir } from '../lib/cem-helpers.js';

const FORMAT_FLAGS = ts.TypeFormatFlags.NoTruncation;

/**
 * @param {string} rootDir the directory of `tsconfig.json` and of the module paths of the manifest
 * @param {import('../lib/cem-helpers.js').ElementEntry[]} entries
 * @return {{ program: ts.Program, checker: ts.TypeChecker, elements: Array<{ entry: object, instanceType: ts.Type }> }}
 */
function compileElements(rootDir, entries) {
  const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error(`tsconfig.json not found in ${rootDir}`);
  }
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, rootDir);

  const sources = new Map(
    entries.map(({ declaration, path: modulePath }, index) => [
      path.join(rootDir, `__cem-types-${index}__.ts`),
      `import { ${declaration.name} } from './${modulePath}';\ndeclare const element: ${declaration.name};\n`,
    ]),
  );
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, languageVersion, ...rest) =>
    sources.has(fileName)
      ? ts.createSourceFile(fileName, sources.get(fileName), languageVersion, true, ts.ScriptKind.TS)
      : getSourceFile(fileName, languageVersion, ...rest);

  const program = ts.createProgram({ rootNames: [...sources.keys()], options, host });
  const checker = program.getTypeChecker();
  const elements = [...sources.keys()].flatMap((fileName, index) => {
    const variable = program.getSourceFile(fileName).statements[1].declarationList.declarations[0];
    const instanceType = checker.getTypeAtLocation(variable.name);
    // A module without a declaration file resolves to `any`
    return instanceType.flags & ts.TypeFlags.Any ? [] : [{ entry: entries[index], instanceType }];
  });
  return { program, checker, elements };
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
  const isLibrary = (type) =>
    type.symbol?.declarations?.every((declaration) => program.isSourceFileDefaultLibrary(declaration.getSourceFile()));
  const maps = eventMap.isIntersection()
    ? [...eventMap.types.filter((type) => !isLibrary(type)), eventMap]
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
 * @param {{ rootDir?: string }} [options]
 * @return {object} the analyzer plugin
 */
export function typescriptTypesPlugin({ rootDir = defaultRootDir } = {}) {
  return {
    name: 'vaadin-typescript-types',

    packageLinkPhase({ customElementsManifest }) {
      const { program, elements } = compileElements(rootDir, getElementEntries(customElementsManifest));
      for (const { entry, instanceType } of elements) {
        setEventTypes(program, entry.declaration, instanceType);
      }
    },
  };
}
