import { unlink, writeFile } from 'node:fs/promises';
import { relative, resolve, basename } from 'node:path';
import ts, {
  type ExpressionStatement,
  type Identifier,
  type Node,
  type SourceFile,
  type TypeAliasDeclaration,
  type VariableDeclaration,
} from 'typescript';
import type { HtmlElement as SchemaHTMLElement, JSONSchemaForWebTypes } from '../types/schema.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { generatedDir, nodeModulesDir, rootDir, utilsDir } from './utils/config.js';
import { ElementNameMissingError } from './utils/errors.js';
import fromAsync from './utils/fromAsync.js';
import { fswalk } from './utils/fswalk.js';
import {
  camelCase,
  createImportPath,
  createSourceFile,
  type NamedGenericJsContribution,
  pickNamedEvents,
  search,
  template,
  transform,
  convertElementNameToClassName,
} from './utils/misc.js';
import { eventSettings, genericElements, NonGenericInterface } from './utils/settings.js';

// Placeholders
const CALL_EXPRESSION = '$CALL_EXPRESSION$';
const COMPONENT_NAME = '$COMPONENT_NAME$';
const COMPONENT_TAG = '$COMPONENT_TAG$';
const CREATE_COMPONENT_PATH = '$CREATE_COMPONENT_PATH$';
const EVENT_MAP = '$EVENT_MAP$';
const EVENT_MAP_REF_IN_EVENTS = '$EVENT_MAP_REF_IN_EVENTS$';
const EVENTS_DECLARATION = '$EVENTS_DECLARATION$';
const LIT_REACT_PATH = '@lit-labs/react';
const MODULE_PATH = '$MODULE_PATH$';

type ElementData = Readonly<{
  packageName: string;
  path: string;
}>;

// Remove all existing files
await fromAsync(fswalk(generatedDir), ([path]) => unlink(path));

async function prepareElementFiles(
  descriptions: readonly JSONSchemaForWebTypes[],
): Promise<Map<SchemaHTMLElement, ElementData>> {
  const elementFilesMap = new Map<SchemaHTMLElement, ElementData>();

  await Promise.all(
    Array.from(extractElementsFromDescriptions(descriptions), async ([packageName, element]) => {
      if (!element.name) {
        throw new ElementNameMissingError(packageName);
      }

      const path = await search(element.name, resolve(nodeModulesDir, packageName));

      if (path) {
        elementFilesMap.set(element, {
          packageName,
          path,
        });
      }
    }),
  );

  return elementFilesMap;
}

const descriptions = await loadDescriptions();
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false,
});

function createGenericTypeNames(numberOfGenerics: number) {
  return Array.from({ length: numberOfGenerics }, (_, i) => ts.factory.createIdentifier(`T${i + 1}`));
}

function isEventMapDeclaration(node: Node): node is TypeAliasDeclaration {
  return ts.isTypeAliasDeclaration(node) && node.name.text === EVENT_MAP;
}

function isEventListDeclaration(node: Node): node is Identifier {
  return ts.isIdentifier(node) && node.text === EVENTS_DECLARATION;
}

function isEventMapReferenceInEventsDeclaration(node: Node): node is Identifier {
  return ts.isIdentifier(node) && node.text === EVENT_MAP_REF_IN_EVENTS;
}

function isComponentPropsDeclaration(node: Node): node is TypeAliasDeclaration {
  return ts.isTypeAliasDeclaration(node) && node.name.text === `${COMPONENT_NAME}Props`;
}

function isComponentDeclaration(node: Node): node is VariableDeclaration {
  return ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === COMPONENT_NAME;
}

function createEventMapDeclaration(
  originalNode: TypeAliasDeclaration,
  elementName: string,
  events: readonly NamedGenericJsContribution[] | undefined,
): Node {
  const { remove: eventsToRemove, makeUnknown: eventsToBeUnknown } = eventSettings.get(elementName) ?? {};
  const eventNameTypeId = ts.factory.createIdentifier('EventName');
  const eventMapId = ts.factory.createIdentifier(EVENT_MAP);

  return ts.factory.createTypeAliasDeclaration(
    originalNode.modifiers,
    eventMapId,
    undefined,
    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Readonly'), [
      ts.factory.createTypeLiteralNode(
        events
          ?.filter(({ name: eventName }) => (eventsToRemove ? !eventsToRemove.includes(eventName) : true))
          .map(({ name: eventName }) =>
            ts.factory.createPropertySignature(
              undefined,
              ts.factory.createIdentifier(`on${camelCase(eventName!)}`),
              undefined,
              ts.factory.createTypeReferenceNode(
                eventNameTypeId,
                eventsToBeUnknown?.includes(eventName!)
                  ? [
                      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('CustomEvent'), [
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
                      ]),
                    ]
                  : [
                      ts.factory.createIndexedAccessTypeNode(
                        ts.factory.createTypeReferenceNode(`_${elementName}EventMap`),
                        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(eventName!)),
                      ),
                    ],
              ),
            ),
          ),
      ),
    ]),
  );
}

function createEventList(elementName: string, events: readonly NamedGenericJsContribution[] | undefined): Node {
  const { remove: eventsToRemove } = eventSettings.get(elementName) ?? {};

  return ts.factory.createObjectLiteralExpression(
    events
      ?.filter(({ name: eventName }) => (eventsToRemove ? !eventsToRemove.includes(eventName) : true))
      .map(({ name: eventName }) => {
        const eventString = ts.factory.createStringLiteral(eventName);
        return ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier(`on${camelCase(eventName)}`),
          eventString,
        );
      }),
  );
}

function removeAllEventRelated(node: Node, hasEvents: boolean, hasKnownEvents: boolean): Node | undefined {
  if (hasEvents && hasKnownEvents) {
    return node;
  }

  if (!hasEvents && ts.isImportSpecifier(node) && node.name.text === 'EventName') {
    return undefined;
  }

  if (!hasKnownEvents && ts.isImportSpecifier(node) && node.name.text === `_${COMPONENT_NAME}EventMap`) {
    return undefined;
  }

  return node;
}

function addGenerics(node: Node, elementName: string) {
  const genericElementInfo = genericElements.get(elementName);

  if (!genericElementInfo?.numberOfGenerics) {
    return node;
  }

  const genericTypeNames = createGenericTypeNames(genericElementInfo.numberOfGenerics);
  const typeParameters = genericTypeNames.map((id) => ts.factory.createTypeParameterDeclaration(undefined, id));
  const typeArguments = genericTypeNames.map((id) => ts.factory.createTypeReferenceNode(id));

  const isEventMapGeneric = !genericElementInfo.nonGenericInterfaces?.includes(NonGenericInterface.EVENT_MAP);

  if (isEventMapDeclaration(node) && isEventMapGeneric) {
    // export type GridEventMap<T1> = Readonly<{
    //                          ^ adding this type argument
    //   onActiveItemChanged: EventName<_GridEventMap<T1>["active-item-changed"]>;
    //   ...
    // }>
    const declaration = ts.factory.createTypeAliasDeclaration(node.modifiers, node.name, typeParameters, node.type);

    return ts.transform(declaration, [
      // export type GridEventMap<T1> = Readonly<{
      //   onActiveItemChanged: EventName<_GridEventMap<T1>["active-item-changed"]>;
      //                                                ^ adding these type arguments
      //   ...
      // }>
      transform((node) =>
        ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && node.typeName.text.endsWith('EventMap')
          ? ts.factory.createTypeReferenceNode(node.typeName, typeArguments)
          : node,
      ),
    ]).transformed[0];
  }

  if (isEventMapReferenceInEventsDeclaration(node)) {
    // const events = {
    //   onActiveItemChanged: "active-item-changed",
    //   ...
    // } as GridEventMap<unknown>;
    //                     ^ adding this type argument
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier(EVENT_MAP),
      isEventMapGeneric
        ? genericTypeNames.map(() => ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword))
        : undefined,
    );
  }

  if (isComponentPropsDeclaration(node)) {
    // export type GridProps<T1> = WebComponentProps<GridElement<T1>, GridEventMap<T1>>;
    //                       ^ adding this type parameter
    const declaration = ts.factory.createTypeAliasDeclaration(node.modifiers, node.name, typeParameters, node.type);

    return ts.transform(declaration, [
      // export type GridProps<T1> = WebComponentProps<GridElement<T1>, GridEventMap<T1>>;
      //                                                           ^ adding this type argument
      transform<Node>((node) =>
        ts.isTypeReferenceNode(node) &&
        ts.isIdentifier(node.typeName) &&
        node.typeName.text === `${COMPONENT_NAME}Element`
          ? ts.factory.createTypeReferenceNode(node.typeName, typeArguments)
          : node,
      ),
      ...(isEventMapGeneric
        ? [
            // export type GridProps<T1> = WebComponentProps<GridElement<T1>, GridEventMap<T1>>;
            //                                                                             ^ adding this type argument
            transform((node) =>
              ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && node.typeName.text === EVENT_MAP
                ? ts.factory.createTypeReferenceNode(node.typeName, typeArguments)
                : node,
            ),
          ]
        : []),
    ]).transformed[0];
  }

  if (isComponentDeclaration(node)) {
    const { initializer: originalInitializer } = node;

    const asExpression = template(
      `
${CALL_EXPRESSION} as (
  props: ${COMPONENT_NAME}Props & React.RefAttributes<${COMPONENT_NAME}Element>,
) => React.ReactElement | null
  `,
      (statements) => (statements[0] as ExpressionStatement).expression,
      [
        transform((node) =>
          ts.isTypeReferenceNode(node) &&
          ts.isIdentifier(node.typeName) &&
          (node.typeName.text === `${COMPONENT_NAME}Props` || node.typeName.text === `${COMPONENT_NAME}Element`)
            ? ts.factory.createTypeReferenceNode(node.typeName, typeArguments)
            : node,
        ),
        transform((node) =>
          ts.isFunctionTypeNode(node)
            ? ts.factory.createFunctionTypeNode(typeParameters, node.parameters, node.type)
            : node,
        ),
        transform((node) => (ts.isIdentifier(node) && node.text === CALL_EXPRESSION ? originalInitializer : node)),
      ],
    );

    return ts.factory.createVariableDeclaration(node.name, undefined, undefined, asExpression);
  }

  return node;
}

function generateReactComponent({ name, js }: SchemaHTMLElement, { packageName, path }: ElementData): SourceFile {
  if (!name) {
    throw new ElementNameMissingError(packageName);
  }

  const elementName = convertElementNameToClassName(name);
  const elementModulePath = createImportPath(relative(nodeModulesDir, path), false);
  const eventMapId = ts.factory.createIdentifier(`${elementName}EventMap`);
  const elementClassNameId = ts.factory.createIdentifier(`${elementName}Element`);
  const componentTagLiteral = ts.factory.createStringLiteral(name);
  const createComponentPath = createImportPath(relative(generatedDir, resolve(utilsDir, './createComponent.js')), true);

  const hasEvents = !!js?.events && js.events.length > 0;
  const events = js?.events;
  const eventNameMissingLogger = () => console.error(`[${packageName}]: event name is missing`);
  const namedEvents = pickNamedEvents(events, eventNameMissingLogger);
  const { remove: eventsToRemove, makeUnknown: eventsToBeUnknown } = eventSettings.get(elementName) ?? {};
  const hasKnownEvents =
    namedEvents?.some(({ name }) => !eventsToRemove?.includes(name) && !eventsToBeUnknown?.includes(name)) || false;

  const ast = template(
    `
import type { EventName } from "${LIT_REACT_PATH}";
import {
  ${COMPONENT_NAME} as ${COMPONENT_NAME}Element
  type ${COMPONENT_NAME}EventMap as _${COMPONENT_NAME}EventMap,
} from "${MODULE_PATH}";
import * as React from "react";
import { createComponent, type WebComponentProps } from "${CREATE_COMPONENT_PATH}";

export * from "${MODULE_PATH}";

export {
  ${COMPONENT_NAME}Element,
};

export type ${EVENT_MAP};
const events = ${EVENTS_DECLARATION} as ${EVENT_MAP_REF_IN_EVENTS};
export type ${COMPONENT_NAME}Props = WebComponentProps<${COMPONENT_NAME}Element, ${EVENT_MAP}>;
export const ${COMPONENT_NAME} = createComponent({
  elementClass: ${COMPONENT_NAME}Element,
  events,
  react: React,
  tagName: ${COMPONENT_TAG}
});
`,
    (statements) => statements,
    [
      transform((node) => removeAllEventRelated(node, hasEvents, hasKnownEvents)),
      transform((node) =>
        isEventMapDeclaration(node) ? createEventMapDeclaration(node, elementName, namedEvents) : node,
      ),
      transform((node) => (isEventListDeclaration(node) ? createEventList(elementName, namedEvents) : node)),
      transform((node) => addGenerics(node, elementName)),
      transform((node) => {
        if (!ts.isStringLiteral(node)) {
          return node;
        }

        switch (node.text) {
          case CREATE_COMPONENT_PATH:
            return ts.factory.createStringLiteral(createComponentPath);
          case MODULE_PATH:
            return ts.factory.createStringLiteral(elementModulePath);
          default:
            // When createSourceFile hass setParentNodes flag, original string
            // literals are not emitted for some reason. Copy as a workaroud.
            return ts.factory.createStringLiteral(node.text);
        }
      }),
      transform((node) =>
        isEventMapReferenceInEventsDeclaration(node) ? ts.factory.createIdentifier(EVENT_MAP) : node,
      ),
      transform((node) =>
        ts.isIdentifier(node) && node.text === `${COMPONENT_NAME}Element` ? elementClassNameId : node,
      ),
      transform((node) => (ts.isIdentifier(node) && node.text === COMPONENT_TAG ? componentTagLiteral : node)),
      transform((node) => (ts.isIdentifier(node) && node.text === EVENT_MAP ? eventMapId : node)),
      transform((node) =>
        ts.isIdentifier(node) && node.text.includes(COMPONENT_NAME)
          ? ts.factory.createIdentifier(node.text.replaceAll(COMPONENT_NAME, elementName))
          : node,
      ),
      // TODO: remove the workaround for printing `@deprecated` JSDoc tags.
      // TypeScript compiler API does not support .jsDoc attached to nodes,
      // and on top of it, emitting @deprecated JSDocDeprecatedTag is skipped,
      // see https://github.com/microsoft/TypeScript/issues/17146.
      transform((node) => {
        if (!('jsDoc' in node)) {
          return node;
        }

        const tag = (node.jsDoc as ts.JSDoc[] | undefined)?.[0]?.tags?.[0];
        if (!tag || !ts.isJSDocDeprecatedTag(tag)) {
          return node;
        }

        ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, '* @deprecated ', false);
        return node;
      }),
    ],
  );

  return createSourceFile(ast, resolve(generatedDir, `${elementName}.ts`));
}

const elementFilesMap = await prepareElementFiles(descriptions);

const sourceFiles = Array.from(elementFilesMap.entries(), ([element, data]) => generateReactComponent(element, data));

function generateIndexDtsFile(elementNames: readonly string[]): SourceFile {
  const sourceLines = [
    `// Workaround for VSCode, enables TypeScript auto-imports form package.json`,
    ...elementNames.map((elementName) => `import './${elementName}.js';`),
  ];

  return ts.createSourceFile(
    resolve(rootDir, 'index.d.ts'),
    sourceLines.join('\n'),
    ts.ScriptTarget.ES2019,
    undefined,
    ts.ScriptKind.TS,
  );
}

const indexDtsFile = generateIndexDtsFile(sourceFiles.map(({ fileName }) => basename(fileName, '.ts')));

const indexJsFile = ts.createSourceFile(
  resolve(rootDir, 'index.js'),
  '// Intentionally empty, please import from individual contained .js files',
  ts.ScriptTarget.ES2019,
  undefined,
  ts.ScriptKind.JS,
);

async function printAndWrite(file: SourceFile) {
  const contents = printer.printFile(file);
  await writeFile(file.fileName, contents, 'utf8');
}

await Promise.all([...sourceFiles.map(printAndWrite), printAndWrite(indexDtsFile), printAndWrite(indexJsFile)]);
