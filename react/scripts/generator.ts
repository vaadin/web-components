import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, relative, resolve } from 'node:path';
import ts from 'typescript';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import type { HtmlElement as SchemaHTMLElement } from './types/schema.js';
import { generatedDir, nodeModulesDir, packageDir, srcDir, utilsDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import {
  camelCase,
  convertElementNameToClassName,
  createImportPath,
  listModuleNames,
  pickNamedEvents,
  search,
} from './utils/misc.js';
import type { PackageJson } from './utils/package-json.js';
import {
  eventSettings,
  type GenericElementInfo,
  genericElements,
  NonGenericInterface,
  themedElements,
} from './utils/settings.js';

type ElementData = Readonly<{
  element: SchemaHTMLElement;
  packageName: string;
  path: string;
}>;

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false,
});

function toGenericsString(generics: readonly string[]) {
  return generics.length > 0 ? `<${generics.join(', ')}>` : '';
}

function createGenerics({ numberOfGenerics, typeConstraints, nonGenericInterfaces }: GenericElementInfo) {
  const typeArguments = Array.from({ length: numberOfGenerics }, (_, i) => `T${i + 1}`);
  // A type constraint is used both as the constraint and as the default type.
  const typeParameters = typeArguments.map((generic, index) => {
    const constraint = typeConstraints?.[index];
    return constraint ? `${generic} extends ${constraint} = ${constraint}` : generic;
  });
  const isEventMapGeneric = !nonGenericInterfaces?.includes(NonGenericInterface.EVENT_MAP);

  return {
    typeParameters: toGenericsString(typeParameters),
    typeArguments: toGenericsString(typeArguments),
    eventMapTypeParameters: isEventMapGeneric ? toGenericsString(typeParameters) : '',
    eventMapTypeArguments: isEventMapGeneric ? toGenericsString(typeArguments) : '',
    eventMapAnyArguments: isEventMapGeneric ? toGenericsString(typeArguments.map(() => 'any')) : '',
  };
}

async function prepareElementFiles(dependencies: readonly string[]): Promise<ElementData[]> {
  const descriptions = await loadDescriptions();

  const elements = Array.from(extractElementsFromDescriptions(descriptions), ([packageName, element]) => {
    if (!element.name) {
      throw new ElementNameMissingError(packageName);
    }

    if (!dependencies.includes(packageName)) {
      return undefined;
    }

    const path = search(element.name, resolve(nodeModulesDir, packageName));
    return path ? { element, packageName, path } : undefined;
  });

  return elements.filter((data): data is ElementData => data != null);
}

function generateReactComponent({ element: { name, js }, packageName, path }: ElementData): ts.SourceFile {
  if (!name) {
    throw new ElementNameMissingError(packageName);
  }

  const elementName = convertElementNameToClassName(name);
  const elementModulePath = createImportPath(relative(nodeModulesDir, path), false);
  const createComponentPath = createImportPath(relative(generatedDir, resolve(utilsDir, './createComponent.js')), true);

  const hasEvents = !!js?.events && js.events.length > 0;
  const eventNameMissingLogger = () => console.error(`[${packageName}]: event name is missing`);
  const namedEvents = pickNamedEvents(js?.events, eventNameMissingLogger) ?? [];
  const { remove: eventsToRemove, makeUnknown: eventsToBeUnknown } = eventSettings.get(elementName) ?? {};
  const existingEvents = namedEvents.filter(({ name: eventName }) => !eventsToRemove?.includes(eventName));
  const hasKnownEvents = namedEvents.some(
    ({ name: eventName }) => !eventsToRemove?.includes(eventName) && !eventsToBeUnknown?.includes(eventName),
  );

  const genericElementInfo = genericElements.get(elementName);
  const {
    typeParameters = '',
    typeArguments = '',
    eventMapTypeParameters = '',
    eventMapTypeArguments = '',
    eventMapAnyArguments = '',
  } = genericElementInfo ? createGenerics(genericElementInfo) : {};
  const typeConstraintImports = Array.from(
    new Set(genericElementInfo?.typeConstraints ?? []),
    (constraint) => `type ${constraint},`,
  ).join('\n');

  // Components that support the `theme` attribute but do not use `ThemableMixin`
  // are generated with `createThemedComponent` so the `theme` prop is available.
  const isThemed = themedElements.has(elementName);
  const createFn = isThemed ? 'createThemedComponent' : 'createComponent';
  const themeSuffix = isThemed ? ' & { theme?: string }' : '';

  const eventMapMembers = existingEvents
    .map(({ name: eventName }) => {
      const eventType = eventsToBeUnknown?.includes(eventName)
        ? 'CustomEvent<unknown>'
        : `_${elementName}EventMap${eventMapTypeArguments}['${eventName}']`;
      return `on${camelCase(eventName)}: EventName<${eventType}>;`;
    })
    .join('\n');
  // One line: Prettier keeps an object literal expanded when its first key is on a new line.
  const eventsMembers = existingEvents
    .map(({ name: eventName }) => `on${camelCase(eventName)}: '${eventName}'`)
    .join(', ');
  const componentCast = genericElementInfo
    ? ` as ${typeParameters}(
  props: ${elementName}Props${typeArguments} & React.RefAttributes<${elementName}Element${typeArguments}>,
) => React.ReactElement | null`
    : '';

  const code = `import type { ${hasEvents ? 'EventName' : ''} } from '@lit/react';
import {
  ${elementName} as ${elementName}Element,
  ${hasKnownEvents ? `type ${elementName}EventMap as _${elementName}EventMap,` : ''}
  ${typeConstraintImports}
} from '${elementModulePath}';
import * as React from 'react';
import { ${createFn}, type WebComponentProps } from '${createComponentPath}';

export * from '${elementModulePath}';

export { ${elementName}Element };

export type ${elementName}EventMap${eventMapTypeParameters} = Readonly<{
${eventMapMembers}
}>;

const events = { ${eventsMembers} } as ${elementName}EventMap${eventMapAnyArguments};

export type ${elementName}Props${typeParameters} = WebComponentProps<${elementName}Element${typeArguments}, ${elementName}EventMap${eventMapTypeArguments}>${themeSuffix};

export const ${elementName} = ${createFn}({
  elementClass: ${elementName}Element,
  events,
  react: React,
  tagName: '${name}',
})${componentCast};
`;

  return ts.createSourceFile(
    resolve(generatedDir, `${elementName}.ts`),
    code,
    ts.ScriptTarget.ES2019,
    undefined,
    ts.ScriptKind.TS,
  );
}

function generateIndexFile(moduleNames: readonly string[], extension: string): ts.SourceFile {
  const sourceLines = [
    ...moduleNames.map((moduleName) => `export * from './${moduleName}.js';`),
    // Explicit re-exports beat star exports per-name in TypeScript, so these deterministically
    // resolve each component name (e.g. `SelectItem`) even if another module's `export *` chain
    // re-exports a colliding name (e.g. a deprecated type from a web component package).
    ...moduleNames.map((moduleName) => `export { ${moduleName} } from './${moduleName}.js';`),
  ];

  return ts.createSourceFile(
    resolve(packageDir, `index.${extension}`),
    sourceLines.join('\n'),
    ts.ScriptTarget.ES2019,
    undefined,
    ts.ScriptKind.TS,
  );
}

async function printAndWrite(file: ts.SourceFile) {
  await writeFile(file.fileName, printer.printFile(file), 'utf8');
}

/**
 * Generates `src/generated/*.ts` for every web component of the package
 * dependencies, and `index.js` / `index.d.ts` from the `src/` listing.
 */
export async function generate(): Promise<void> {
  await rm(generatedDir, { recursive: true, force: true });
  await mkdir(generatedDir, { recursive: true });

  const packageJson: PackageJson = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies ?? {});

  const sourceFiles = (await prepareElementFiles(dependencies)).map(generateReactComponent);
  const moduleNames = await listModuleNames(srcDir);

  for (const { fileName } of sourceFiles) {
    const elementName = basename(fileName, '.ts');
    if (!moduleNames.includes(elementName)) {
      console.warn(`[WARNING]: ${elementName} is generated but has no src/${elementName}.ts(x) wrapper`);
    }
  }

  await Promise.all([
    ...sourceFiles.map(printAndWrite),
    printAndWrite(generateIndexFile(moduleNames, 'd.ts')),
    printAndWrite(generateIndexFile(moduleNames, 'js')),
  ]);
}
