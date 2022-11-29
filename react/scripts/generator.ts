import { unlink, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import ts, {
  type Identifier,
  type Node,
  type SourceFile,
  type TypeAliasDeclaration,
  type VariableDeclaration,
  type VariableStatement,
} from 'typescript';
import type { HtmlElement as SchemaHTMLElement, JSONSchemaForWebTypes } from '../types/schema.js';
import { extractElementsFromDescriptions, loadDescriptions } from './descriptions.js';
import { generatedDir, nodeModulesDir, utilsDir } from './utils/config.js';
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
  stripPrefix,
  template,
  transform,
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
  const elementModuleId = ts.factory.createIdentifier(`WebComponentModule`);
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
                        ts.factory.createTypeReferenceNode(
                          ts.factory.createQualifiedName(elementModuleId, `${elementName}EventMap`),
                        ),
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

function removeAllEventRelated(node: Node, hasEvents: boolean): Node | undefined {
  if (hasEvents) {
    return node;
  }

  if (ts.isImportSpecifier(node) && node.name.text === 'EventName') {
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
    //   onActiveItemChanged: EventName<GridModule.GridEventMap<T1>["active-item-changed"]>;
    //   ...
    // }>
    const declaration = ts.factory.createTypeAliasDeclaration(node.modifiers, node.name, typeParameters, node.type);

    return ts.transform(declaration, [
      // export type GridEventMap<T1> = Readonly<{
      //   onActiveItemChanged: EventName<GridModule.GridEventMap<T1>["active-item-changed"]>;
      //                                                          ^ adding these type arguments
      //   ...
      // }>
      transform((node) =>
        ts.isTypeReferenceNode(node) && ts.isQualifiedName(node.typeName)
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
    // export type GridProps<T1> = WebComponentProps<GridModule.Grid<T1>, GridEventMap<T1>>;
    //                        ^ adding this type parameter
    const declaration = ts.factory.createTypeAliasDeclaration(node.modifiers, node.name, typeParameters, node.type);

    return ts.transform(declaration, [
      // export type GridProps<T1> = WebComponentProps<GridModule.Grid<T1>, GridEventMap<T1>>;
      //                                                                ^ adding this type argument
      transform<Node>((node) =>
        ts.isTypeReferenceNode(node) && ts.isQualifiedName(node.typeName)
          ? ts.factory.createTypeReferenceNode(node.typeName, typeArguments)
          : node,
      ),
      ...(isEventMapGeneric
        ? [
            // export type GridProps<T1> = WebComponentProps<GridModule.Grid<T1>, GridEventMap<T1>>;
            //                                                                                  ^ adding this type argument
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

    const initializer = template(
      `
const c = ${CALL_EXPRESSION} as (
  props: ${COMPONENT_NAME}Props & { ref?: React.ForwardedRef<WebComponentModule.${COMPONENT_NAME}> },
) => React.ReactElement | null
  `,
      (statements) => (statements[0] as VariableStatement).declarationList.declarations[0].initializer!,
      [
        transform((node) =>
          ts.isTypeReferenceNode(node) &&
          ((ts.isIdentifier(node.typeName) && node.typeName.text === `${COMPONENT_NAME}Props`) ||
            (ts.isQualifiedName(node.typeName) &&
              ts.isIdentifier(node.typeName.right) &&
              node.typeName.right.text === COMPONENT_NAME))
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

    return ts.factory.createVariableDeclaration(node.name, undefined, undefined, initializer);
  }

  return node;
}

function generateReactComponent({ name, js }: SchemaHTMLElement, { packageName, path }: ElementData): SourceFile {
  if (!name) {
    throw new ElementNameMissingError(packageName);
  }

  const hasEvents = !!js?.events && js.events.length > 0;
  const events = js?.events;

  const elementName = stripPrefix(camelCase(name));
  const elementModulePath = createImportPath(relative(nodeModulesDir, path), false);
  const eventMapId = ts.factory.createIdentifier(`${elementName}EventMap`);
  const componentTagLiteral = ts.factory.createStringLiteral(name);
  const createComponentPath = createImportPath(relative(generatedDir, resolve(utilsDir, './createComponent.js')), true);

  const eventNameMissingLogger = () => console.error(`[${packageName}]: event name is missing`);

  const ast = template(
    `
import type { EventName } from "${LIT_REACT_PATH}";
import * as WebComponentModule from "${MODULE_PATH}";
import * as React from "react";
import { createComponent, WebComponentProps } from "${CREATE_COMPONENT_PATH}";
export type ${EVENT_MAP};
const events = ${EVENTS_DECLARATION} as ${EVENT_MAP_REF_IN_EVENTS};
export type ${COMPONENT_NAME}Props = WebComponentProps<WebComponentModule.${COMPONENT_NAME}, ${EVENT_MAP}>;
export const ${COMPONENT_NAME} = createComponent({
  elementClass: WebComponentModule.${COMPONENT_NAME},
  events,
  react: React,
  tagName: ${COMPONENT_TAG}
});

export { WebComponentModule };
`,
    (statements) => statements,
    [
      transform((node) => removeAllEventRelated(node, hasEvents)),
      transform((node) =>
        isEventMapDeclaration(node)
          ? createEventMapDeclaration(node, elementName, pickNamedEvents(events, eventNameMissingLogger))
          : node,
      ),
      transform((node) =>
        isEventListDeclaration(node)
          ? createEventList(elementName, pickNamedEvents(events, eventNameMissingLogger))
          : node,
      ),
      transform((node) =>
        ts.isStringLiteral(node) && node.text === CREATE_COMPONENT_PATH
          ? ts.factory.createStringLiteral(createComponentPath)
          : node,
      ),
      transform((node) => addGenerics(node, elementName)),
      transform((node) =>
        isEventMapReferenceInEventsDeclaration(node) ? ts.factory.createIdentifier(EVENT_MAP) : node,
      ),
      transform((node) =>
        ts.isStringLiteral(node) && node.text === MODULE_PATH
          ? ts.factory.createStringLiteral(elementModulePath)
          : node,
      ),
      transform((node) => (ts.isIdentifier(node) && node.text === COMPONENT_TAG ? componentTagLiteral : node)),
      transform((node) => (ts.isIdentifier(node) && node.text === EVENT_MAP ? eventMapId : node)),
      transform((node) =>
        ts.isIdentifier(node) && node.text.includes(COMPONENT_NAME)
          ? ts.factory.createIdentifier(node.text.replaceAll(COMPONENT_NAME, elementName))
          : node,
      ),
    ],
  );

  return createSourceFile(ast, resolve(generatedDir, `${elementName}.ts`));
}

const elementFilesMap = await prepareElementFiles(descriptions);

const sourceFiles = Array.from(elementFilesMap.entries(), ([element, data]) => generateReactComponent(element, data));

async function printAndWrite(file: SourceFile) {
  const contents = printer.printFile(file);
  await writeFile(file.fileName, contents, 'utf8');
}

await Promise.all(sourceFiles.map(printAndWrite));
