import { isStaticMember } from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';
import { extractMixinNodes } from '@custom-elements-manifest/analyzer/src/utils/mixins.js';

const inheritanceDenyList = ['PolylitMixin', 'DirMixin'];

// Attribute types that can't be set via HTML attributes
const ignoredAttributeTypes = ['object', 'unknown', 'Array'];

// Members incorrectly picked up by CEM from assignments to sub-object properties
// (e.g., `this._controller.slotName = 'sr-label'` misinterpreted as a class field)
const ignoredMembers = ['slotName', 'id'];

// Events to exclude from CEM output:
// - eventName: false positive from dynamic dispatchEvent calls (e.g., `new CustomEvent(eventName, ...)`)
// - focus, blur: native events picked up by CEM without @fires annotations, not part of the public API
const ignoredEvents = ['eventName', 'focus', 'blur'];

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
 * Extracts @mixes JSDoc tag names from a node's JSDoc comments.
 * @param {object} node - A TypeScript AST node
 * @param {object} ts - The TypeScript module
 * @returns {string[]} - Array of mixin names
 */
function getJsDocMixesTags(node, ts) {
  return (node.jsDoc || [])
    .flatMap((doc) => doc.tags || [])
    .filter((tag) => ts.isJSDocUnknownTag(tag) && tag.tagName.text === 'mixes')
    .map((tag) => tag.comment?.trim())
    .filter(Boolean);
}

/**
 * Resolves a mixin name to a package reference by checking the module's imports.
 * @param {object} sourceFile - The TypeScript source file AST
 * @param {string} mixinName - The mixin name (e.g., "InputControlMixin")
 * @param {object} ts - The TypeScript module
 * @returns {{ name: string, package?: string, module?: string } | null}
 */
function resolveMixinRef(sourceFile, mixinName, ts) {
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const moduleSpecifier = statement.moduleSpecifier.text;
    const importClause = statement.importClause;
    if (!importClause) continue;

    // Check named imports
    const namedBindings = importClause.namedBindings;
    if (!namedBindings || !ts.isNamedImports(namedBindings)) continue;

    const match = namedBindings.elements.find((el) => el.name.text === mixinName);
    if (!match) continue;

    if (moduleSpecifier.startsWith('.')) {
      // Same-package import
      return { name: mixinName, module: moduleSpecifier.replace(/^\.\//u, '') };
    }
    // Cross-package import
    return { name: mixinName, package: moduleSpecifier };
  }
  return null;
}

/**
 * CEM plugin that augments mixin declarations with @mixes JSDoc tag references
 * that the analyzer couldn't capture from static analysis (e.g., when
 * I18nMixin wraps other mixins as: I18nMixin(defaultI18n, Chain(superClass))).
 */
function mixesPlugin() {
  return {
    analyzePhase({ ts, node, moduleDoc }) {
      // Only process mixin export declarations (const Mixin = (superClass) => class ...)
      if (!ts.isVariableStatement(node)) return;

      for (const decl of node.declarationList.declarations) {
        const mixesNames = getJsDocMixesTags(node, ts);
        if (mixesNames.length === 0) continue;

        const mixinName = decl.name.text;
        const mixinDecl = moduleDoc.declarations?.find((d) => d.name === mixinName && d.kind === 'mixin');
        if (!mixinDecl) continue;

        const existingMixinNames = new Set((mixinDecl.mixins || []).map((m) => m.name));
        const sourceFile = node.getSourceFile();

        for (const mixName of mixesNames) {
          if (existingMixinNames.has(mixName)) continue;

          const ref = resolveMixinRef(sourceFile, mixName, ts);
          if (ref) {
            mixinDecl.mixins ||= [];
            mixinDecl.mixins.push(ref);
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

/**
 * CEM plugin that marks class declarations with `@private` or `@protected` JSDoc tags
 * so they can be filtered out during the packageLinkPhase.
 */
function classPrivacyPlugin() {
  return {
    analyzePhase({ ts, node, moduleDoc }) {
      if (!ts.isClassDeclaration(node) || !node.name) return;

      const tag = (node.jsDoc || [])
        .flatMap((doc) => doc.tags || [])
        .find((t) => t.tagName?.text === 'private' || t.tagName?.text === 'protected');

      if (!tag) return;

      const decl = moduleDoc.declarations?.find((d) => d.name === node.name.text);
      if (decl) {
        decl.privacy = tag.tagName.text;
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
    mixesPlugin(),
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
                .filter((member) => !ignoredMembers.includes(member.name))
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
            // - Filter out attributes whose corresponding field member is not public.
            // - Filter out starting with underscore e.g. `_lastTabIndex`
            // - Filter out `dir` attribute inherited from DirMixin.
            // - Filter out attributes with non-primitive types (can't be set via HTML attributes).
            // - Transform camelCase attribute names to dash-case.
            if (declaration?.attributes?.length) {
              const publicMemberNames = new Set((declaration.members || []).map((m) => m.name));
              declaration.attributes = declaration.attributes
                .filter((attr) => !attr.fieldName || publicMemberNames.has(attr.fieldName))
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
                .filter((member) => !ignoredEvents.includes(member.name))
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
