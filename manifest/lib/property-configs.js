import { isStaticMember } from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';
import { extractMixinNodes } from '@custom-elements-manifest/analyzer/src/utils/mixins.js';

/**
 * Lists the properties that a class or mixin node declares in `static get properties()`,
 * with the option nodes of each property config, for the plugins of the analyze phase.
 * @param {object} ts the TypeScript instance of the analyzer
 * @param {object} node the node the analyzer visits
 * @return {{ name: string, options: Map<string, object> }[]} empty for a node without properties
 */
export function propertyConfigs(ts, node) {
  const mixinNodes = extractMixinNodes(node);
  const classNode = mixinNodes ? mixinNodes.mixinClass : ts.isClassDeclaration(node) ? node : undefined;
  const getter = classNode?.members?.find(
    (member) => ts.isGetAccessorDeclaration(member) && isStaticMember(member) && member.name?.text === 'properties',
  );
  const returned = getter?.body?.statements?.find(ts.isReturnStatement)?.expression;
  if (!returned || !ts.isObjectLiteralExpression(returned)) {
    return [];
  }
  return returned.properties
    .filter((property) => ts.isPropertyAssignment(property) && property.name?.text)
    .map((property) => {
      const config = property.initializer;
      const options = new Map();
      if (ts.isObjectLiteralExpression(config)) {
        for (const option of config.properties) {
          if (ts.isPropertyAssignment(option) && option.name?.text) {
            options.set(option.name.text, option.initializer);
          }
        }
      }
      return { name: property.name.text, options };
    });
}

/**
 * Finds the member of the name in the declarations of the module. A module with
 * `static get properties()` holds one class or mixin, so the name is unique.
 * @param {object} moduleDoc
 * @param {string} name
 * @return {object | undefined}
 */
export function findMember(moduleDoc, name) {
  for (const declaration of moduleDoc.declarations || []) {
    const member = declaration.members?.find((m) => m.name === name);
    if (member) {
      return member;
    }
  }
  return undefined;
}

/**
 * Finds the attribute of the field in the declarations of the module.
 * @param {object} moduleDoc
 * @param {string} fieldName
 * @return {object | undefined}
 */
export function findAttribute(moduleDoc, fieldName) {
  for (const declaration of moduleDoc.declarations || []) {
    const attribute = declaration.attributes?.find((a) => a.fieldName === fieldName);
    if (attribute) {
      return attribute;
    }
  }
  return undefined;
}
