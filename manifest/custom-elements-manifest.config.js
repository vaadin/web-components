import fs from 'node:fs';
import { byName, isPrimitiveType } from './lib/cem-helpers.js';
import { classPrivacyPlugin } from './plugins/class-privacy.js';
import { inheritancePlugin } from './plugins/inheritance.js';
import { readonlyPlugin } from './plugins/readonly.js';

const inheritanceDenyList = ['PolylitMixin', 'DirMixin'];

// Members incorrectly picked up by CEM from assignments to sub-object properties
// (e.g., `this._controller.slotName = 'sr-label'` misinterpreted as a class field)
const ignoredMembers = ['slotName', 'id'];

// Events to exclude from CEM output:
// - eventName: false positive from dynamic dispatchEvent calls (e.g., `new CustomEvent(eventName, ...)`)
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

export default {
  globs: ['packages/**/src/(vaadin-*.js|*-mixin.js)'],
  packagejson: false,
  litelement: true,
  // `globby` lists the files in no fixed order, and the analyzer applies
  // inheritance in module order, so sort them for a stable manifest
  overrideModuleCreation({ ts, globs }) {
    return [...globs]
      .sort(byName)
      .map((file) => ts.createSourceFile(file, fs.readFileSync(file, 'utf-8'), ts.ScriptTarget.ES2015, true));
  },
  plugins: [
    inheritancePlugin(),
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
            // - Filter out attributes of read-only fields, which ignore attribute changes.
            // - Filter out starting with underscore e.g. `_lastTabIndex`
            // - Filter out attributes with non-primitive types (can't be set via HTML attributes).
            //   Untyped ones come from `observedAttributes` and are kept.
            // - Transform camelCase attribute names to dash-case.
            if (declaration?.attributes?.length) {
              const members = declaration.members || [];
              const publicMemberNames = new Set(members.map((m) => m.name));
              const readonlyMemberNames = new Set(members.filter((m) => m.readonly).map((m) => m.name));
              declaration.attributes = declaration.attributes
                .filter((attr) => !attr.fieldName || publicMemberNames.has(attr.fieldName))
                .filter((attr) => !readonlyMemberNames.has(attr.fieldName))
                .filter((member) => !inheritanceDenyList.includes(member.inheritedFrom?.name))
                .filter((member) => !member.name.startsWith('_'))
                .filter((attr) => !attr.type || isPrimitiveType(attr.type.text))
                .map((attr) => ({ ...attr, name: camelToDash(attr.name) }))
                .sort(sortName);
            }

            // A field keeps `attribute` and `reflects` only when its attribute is listed
            const attributeNames = new Set((declaration.attributes || []).map((attr) => attr.name));
            for (const member of declaration.members || []) {
              if (member.attribute && !attributeNames.has(member.attribute)) {
                delete member.attribute;
                delete member.reflects;
              }
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
