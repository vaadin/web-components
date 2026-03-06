import { isStaticMember } from '@custom-elements-manifest/analyzer/src/utils/ast-helpers.js';

const inheritanceDenyList = ['PolylitMixin', 'DirMixin'];

// Attribute types that can't be set via HTML attributes
const ignoredAttributeTypes = ['object', 'unknown', 'Array'];

// Members incorrectly picked up by CEM from assignments to sub-object properties
// (e.g., `this._controller.slotName = 'sr-label'` misinterpreted as a class field)
const ignoredMembers = ['slotName', 'id'];

// Events incorrectly picked up by CEM from dynamic dispatchEvent calls
// (e.g., `new CustomEvent(eventName, ...)` where eventName is a variable)
const ignoredEvents = ['eventName'];

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
 * Returns all JSDoc tags from a node's JSDoc comments.
 * @param {object} node - A TypeScript AST node
 * @returns {object[]} - Array of JSDoc tag objects
 */
function getJsDocTags(node) {
  return (node.jsDoc || []).flatMap((doc) => doc.tags || []);
}

/**
 * Extracts @mixes JSDoc tag names from a node's JSDoc comments.
 * @param {object} node - A TypeScript AST node
 * @param {object} ts - The TypeScript module
 * @returns {string[]} - Array of mixin names
 */
function getJsDocMixesTags(node, ts) {
  return getJsDocTags(node)
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
 * Finds the class node from a top-level AST node, supporting both
 * class declarations and mixin patterns (arrow function with class expression).
 *
 * NOTE: Cannot use `extractMixinNodes` here because it does not handle
 * two-argument mixin patterns like `I18nMixin(defaultI18n, superClass)`.
 */
function findClassNode(node, ts) {
  if (ts.isClassDeclaration(node)) return node;
  if (!ts.isVariableStatement(node)) return undefined;

  const decl = node.declarationList.declarations[0];
  const init = decl?.initializer;
  if (!init || !ts.isArrowFunction(init)) return undefined;

  // Arrow function body is the class expression
  const body = init.body;
  if (ts.isClassExpression(body)) return body;

  // Or the body is a block with a return statement
  if (ts.isBlock(body)) {
    const ret = body.statements.find(ts.isReturnStatement);
    if (ret?.expression && ts.isClassExpression(ret.expression)) return ret.expression;
  }
  return undefined;
}

// Map of declaration name → Map of member name → type text.
// Populated during analyzePhase, applied during packageLinkPhase.
const typeOverrides = new Map();

/**
 * CEM plugin that collects @type JSDoc overrides from getter declarations.
 * The CEM analyzer keeps the inherited member type (e.g., `Object` from I18nMixin)
 * even when a subclass overrides the getter with a more specific `@type` JSDoc tag
 * (e.g., `@type {!AppLayoutI18n}`). Overrides are applied later in packageLinkPhase
 * by `applyTypeOverrides`.
 */
function typeOverridePlugin() {
  return {
    analyzePhase({ ts, node, moduleDoc }) {
      const classNode = findClassNode(node, ts);
      if (!classNode) return;

      for (const member of classNode.members || []) {
        if (!ts.isGetAccessorDeclaration(member) || isStaticMember(member)) continue;

        const propName = member.name?.text;
        if (!propName) continue;

        // Extract @type from JSDoc on the getter
        const typeTag = getJsDocTags(member).find((tag) => tag.tagName?.text === 'type');

        if (!typeTag?.typeExpression) continue;

        const typeText = typeTag.typeExpression.type.getText().replace(/^!/u, '');

        // Store the override keyed by declaration name
        for (const declaration of moduleDoc.declarations || []) {
          if (!declaration.members?.some((m) => m.name === propName)) continue;
          if (!typeOverrides.has(declaration.name)) {
            typeOverrides.set(declaration.name, new Map());
          }
          typeOverrides.get(declaration.name).set(propName, typeText);
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
      const classNode = findClassNode(node, ts);
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

      const tag = getJsDocTags(node).find((t) => t.tagName?.text === 'private' || t.tagName?.text === 'protected');

      if (!tag) return;

      const decl = moduleDoc.declarations?.find((d) => d.name === node.name.text);
      if (decl) {
        decl.privacy = tag.tagName.text;
      }
    },
  };
}

function copyMissingItems(target, source, key) {
  const existing = new Set((target[key] || []).map((item) => item.name));
  let changed = false;
  for (const item of source[key] || []) {
    if (!existing.has(item.name)) {
      target[key] ||= [];
      target[key].push({ ...item });
      existing.add(item.name);
      changed = true;
    }
  }
  return changed;
}

function copyMissingFromParents(decl, allDeclarations) {
  const parentRefs = [...(decl.mixins || [])];
  if (decl.superclass?.name) {
    parentRefs.push(decl.superclass);
  }

  let changed = false;
  for (const parentRef of parentRefs) {
    const parentDecl = allDeclarations.get(parentRef.name);
    if (!parentDecl) continue;
    changed = copyMissingItems(decl, parentDecl, 'members') || changed;
    changed = copyMissingItems(decl, parentDecl, 'attributes') || changed;
  }
  return changed;
}

/**
 * BFS through a declaration's own overrides, then its mixin/superclass chain,
 * applying the closest (most specific) @type override for each member.
 */
function applyClosestOverrides(decl, allDeclarations) {
  const visited = new Set();
  const applied = new Set();
  const queue = [{ name: decl.name }, ...(decl.mixins || [])];
  if (decl.superclass?.name) queue.push(decl.superclass);

  while (queue.length > 0) {
    const ref = queue.shift();
    if (visited.has(ref.name)) continue;
    visited.add(ref.name);

    const overrides = typeOverrides.get(ref.name);
    if (overrides) {
      for (const [memberName, typeText] of overrides) {
        if (applied.has(memberName)) continue;
        const member = (decl.members || []).find((m) => m.name === memberName);
        if (!member) continue;
        member.type = { text: typeText };
        applied.add(memberName);
      }
    }

    const parentDecl = allDeclarations.get(ref.name);
    if (!parentDecl) continue;
    for (const m of parentDecl.mixins || []) queue.push(m);
    if (parentDecl.superclass?.name) queue.push(parentDecl.superclass);
  }
}

/**
 * Apply collected @type JSDoc overrides to declaration members.
 * The CEM analyzer's own inheritance resolution overwrites types set
 * during analyzePhase, so we re-apply them here after all resolution.
 */
function applyTypeOverrides(allDeclarations) {
  for (const decl of allDeclarations.values()) {
    applyClosestOverrides(decl, allDeclarations);
  }
}

/**
 * Copy missing members and attributes from mixin/superclass declarations
 * to class declarations. Runs multiple passes to handle multi-level
 * inheritance chains (e.g., EmailField → TextField → FieldMixin → LabelMixin).
 */
function resolveInheritedMembers(allDeclarations) {
  const classDeclarations = [...allDeclarations.values()].filter((d) => d.kind === 'class');

  let changed = true;
  while (changed) {
    changed = false;
    for (const decl of classDeclarations) {
      changed = copyMissingFromParents(decl, allDeclarations) || changed;
    }
  }
}

export default {
  globs: ['packages/**/src/(vaadin-*.js|*-mixin.js)'],
  packagejson: false,
  litelement: true,
  plugins: [
    classPrivacyPlugin(),
    mixesPlugin(),
    typeOverridePlugin(),
    readonlyPlugin(),
    {
      packageLinkPhase({ customElementsManifest }) {
        const allDeclarations = new Map();
        for (const mod of customElementsManifest.modules) {
          for (const decl of mod.declarations || []) {
            allDeclarations.set(decl.name, decl);
          }
        }

        // Resolve missing inherited members from mixins and superclasses.
        resolveInheritedMembers(allDeclarations);

        // Re-apply @type JSDoc overrides collected during analyzePhase.
        // The CEM analyzer's inheritance resolution overwrites specific types
        // (e.g., AppLayoutI18n) with generic ones from base mixins (e.g., Object).
        applyTypeOverrides(allDeclarations);

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
