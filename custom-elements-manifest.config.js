import { isStaticMember } from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';
import { extractMixinNodes } from '@custom-elements-manifest/analyzer/src/utils/mixins.js';

const inheritanceDenyList = ['PolylitMixin', 'DirMixin'];

// Attribute types that can't be set via HTML attributes
const ignoredAttributeTypes = ['object', 'unknown', 'Array'];

const ignoredStaticMembers = [
  'is',
  'cvdlName',
  'properties',
  'observers',
  'addCheckedInitializer',
  'createProperty',
  'getOrCreateMap',
  'getPropertyDescriptor',
  'enabledWarnings',
  'shadowRootOptions',
  'polylitConfig',
  'constraints',
  'delegateAttrs',
  'delegateProps',
  'lumoInjector',
  'experimental',
];

/**
 * Convert camelCase to dash-case.
 * @param {string} str - e.g. "clearButtonVisible"
 * @returns {string} - e.g. "clear-button-visible"
 */
function camelToDash(str) {
  return str.replace(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase();
}

/**
 * @param {{name: string}} a
 * @param {{name: string}} b
 * @returns
 */
function sortName(a, b) {
  const nameA = a.name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name?.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

/**
 * CEM plugin that marks class declarations with `@private` or `@protected` JSDoc tags
 * so they can be filtered out during the packageLinkPhase.
 */
function classPrivacyPlugin() {
  return {
    analyzePhase({ ts, node, moduleDoc }) {
      if (!ts.isClassDeclaration(node) || !node.name) return;

      for (const jsDoc of node.jsDoc || []) {
        for (const tag of jsDoc.tags || []) {
          const tagName = tag.tagName?.text;
          if (tagName === 'private' || tagName === 'protected') {
            const decl = moduleDoc.declarations?.find((d) => d.name === node.name.text);
            if (decl) {
              decl.privacy = tagName;
            }
            return;
          }
        }
      }
    },
  };
}

/**
 * CEM plugin that marks `readOnly: true` properties as `readonly` in custom-elements.json
 * to filter them out of Lit property bindings when generating web-types-lit.json files.
 */
function readonlyPlugin() {
  return {
    analyzePhase({ ts, node, moduleDoc }) {
      const mixinNodes = extractMixinNodes(node);
      const classNode = mixinNodes ? mixinNodes.mixinClass : ts.isClassDeclaration(node) ? node : undefined;
      if (!classNode) return;

      // Find `static get properties()` method
      for (const member of classNode.members || []) {
        if (!ts.isGetAccessorDeclaration(member) || !isStaticMember(member) || member.name?.text !== 'properties') {
          continue;
        }

        // Find the return statement's object literal
        const returnStmt = member.body?.statements?.find(ts.isReturnStatement);
        const returnObj = returnStmt?.expression;
        if (!returnObj || !ts.isObjectLiteralExpression(returnObj)) continue;

        for (const prop of returnObj.properties) {
          if (!ts.isPropertyAssignment(prop)) continue;
          const propName = prop.name?.text;
          if (!propName) continue;

          // Check if the property config object has `readOnly: true`
          const configObj = prop.initializer;
          if (!ts.isObjectLiteralExpression(configObj)) continue;

          const hasReadOnly = configObj.properties.some(
            (p) =>
              ts.isPropertyAssignment(p) &&
              p.name?.text === 'readOnly' &&
              p.initializer?.kind === ts.SyntaxKind.TrueKeyword,
          );
          if (!hasReadOnly) continue;

          // Find the matching member in moduleDoc declarations and mark it readonly
          for (const declaration of moduleDoc.declarations || []) {
            const cemMember = declaration.members?.find((m) => m.name === propName);
            if (cemMember) {
              cemMember.readonly = true;
            }
          }
        }
      }
    },
  };
}

export default {
  globs: ['packages/**/src/(vaadin-*.js|*-mixin.js)'],
  packagejson: false,
  litelement: true,
  plugins: [
    classPrivacyPlugin(),
    readonlyPlugin(),
    {
      packageLinkPhase({ customElementsManifest }) {
        for (const definition of customElementsManifest.modules) {
          // Filter out class declarations marked as @private or @protected
          const privateClassNames = new Set(
            (definition.declarations || [])
              .filter((d) => d.privacy === 'private' || d.privacy === 'protected')
              .map((d) => d.name),
          );
          if (privateClassNames.size > 0) {
            definition.declarations = definition.declarations.filter((d) => !privateClassNames.has(d.name));
            definition.exports = (definition.exports || []).filter((e) => !privateClassNames.has(e.declaration?.name));
          }

          for (const declaration of definition.declarations) {
            // Filter out private and protected API and internal static getters.
            // Transform field members' attribute property from camelCase to dash-case.
            if (declaration?.members?.length) {
              declaration.members = declaration.members
                .filter((member) => member.privacy !== 'private' && member.privacy !== 'protected')
                .filter((member) => !member.name.startsWith('_'))
                .filter((member) => !(member.static && ignoredStaticMembers.includes(member.name)))
                .map((member) => {
                  if (member.kind === 'field' && member.attribute) {
                    return { ...member, attribute: camelToDash(member.attribute) };
                  }
                  return member;
                })
                .sort(sortName);
            }

            // Transform attributes:
            // - Filter out starting with underscore e.g. `_lastTabIndex`
            // - Filter out `dir` attribute inherited from DirMixin.
            // - Filter out attributes with non-primitive types (can't be set via HTML attributes).
            // - Transform camelCase attribute names to dash-case.
            if (declaration?.attributes?.length) {
              declaration.attributes = declaration.attributes
                .filter((member) => !inheritanceDenyList.includes(member.inheritedFrom?.name))
                .filter((member) => !member.name.startsWith('_') && member.name !== 'dir')
                .filter((member) => !ignoredAttributeTypes.some((type) => member.type?.text?.includes(type)))
                .map((attr) => ({ ...attr, name: camelToDash(attr.name) }))
                .sort(sortName);
            }

            // Filter out events:
            // - inherited from PolylitMixin
            // - with type "CustomEvent" but no name (invalid/inherited events)
            if (declaration?.events?.length) {
              declaration.events = declaration.events
                .filter((member) => !inheritanceDenyList.includes(member.inheritedFrom?.name))
                .filter((member) => !(member.type?.text === 'CustomEvent' && !member.name))
                .sort(sortName);
            }
          }
        }

        // Remove modules with empty declarations and exports
        customElementsManifest.modules = customElementsManifest.modules.filter(
          (mod) => mod.declarations?.length || mod.exports?.length,
        );
      },
    },
  ],
};
