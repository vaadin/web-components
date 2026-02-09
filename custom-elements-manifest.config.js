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
  plugins: [
    {
      packageLinkPhase({ customElementsManifest }) {
        for (const definition of customElementsManifest.modules) {
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
      },
    },
  ],
};
