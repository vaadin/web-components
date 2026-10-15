import { isPrimitiveType } from '../lib/cem-helpers.js';

/**
 * CEM analyzer plugin that keeps only the public API in the manifest: it drops
 * private and protected classes and members, internal static getters, the
 * attributes that cannot be set from HTML, and the items inherited from the
 * mixins on the deny list. Attribute names become dash-case, the items are
 * sorted by name, and modules left without declarations and exports go away.
 */

/**
 * @param {string} str e.g. "clearButtonVisible"
 * @return {string} e.g. "clear-button-visible"
 */
const camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase();

/** Compares items by name, ignoring case. */
function byNameIgnoreCase(a, b) {
  const nameA = a.name?.toUpperCase();
  const nameB = b.name?.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

const isPublic = (item) => item.privacy !== 'private' && item.privacy !== 'protected';

// Members the analyzer picks up from assignments to the properties of another
// object, such as `this._controller.slotName = 'sr-label'`
const ignoredMembers = ['slotName', 'id'];

// Events the analyzer picks up from a dynamic `new CustomEvent(eventName, ...)`
const ignoredEvents = ['eventName'];

// Static getters of the base classes and mixins that configure the elements
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

// Mixins whose inherited items are internal
const inheritanceDenyList = ['PolylitMixin', 'DirMixin'];

const notFromDeniedMixin = (item) => !inheritanceDenyList.includes(item.inheritedFrom?.name);

export function publicApiPlugin() {
  /** Drops the private and protected classes of a module, and their exports. */
  function removePrivateClasses(module) {
    const privateClassNames = new Set((module.declarations || []).filter((d) => !isPublic(d)).map((d) => d.name));
    if (privateClassNames.size > 0) {
      module.declarations = module.declarations.filter((d) => !privateClassNames.has(d.name));
      module.exports = (module.exports || []).filter((e) => !privateClassNames.has(e.declaration?.name));
    }
  }

  /** Keeps the public members, with the attribute of a field in dash-case. */
  function publicMembers(members) {
    return members
      .filter(isPublic)
      .filter((member) => !member.name.startsWith('_'))
      .filter((member) => !ignoredMembers.includes(member.name))
      .filter((member) => !(member.static && ignoredStaticMembers.includes(member.name)))
      .map((member) => {
        if (member.kind === 'field' && member.attribute) {
          return { ...member, attribute: camelToDash(member.attribute) };
        }
        return member;
      })
      .sort(byNameIgnoreCase);
  }

  /**
   * Keeps the attributes that can be set from HTML: of a public field that is
   * not read-only, with a primitive type or none, as the untyped ones come from
   * `observedAttributes`. The names become dash-case.
   */
  function publicAttributes(attributes, members) {
    const publicMemberNames = new Set(members.map((m) => m.name));
    const readonlyMemberNames = new Set(members.filter((m) => m.readonly).map((m) => m.name));
    return attributes
      .filter((attr) => !attr.fieldName || publicMemberNames.has(attr.fieldName))
      .filter((attr) => !readonlyMemberNames.has(attr.fieldName))
      .filter(notFromDeniedMixin)
      .filter((attr) => !attr.name.startsWith('_'))
      .filter((attr) => !attr.type || isPrimitiveType(attr.type.text))
      .map((attr) => ({ ...attr, name: camelToDash(attr.name) }))
      .sort(byNameIgnoreCase);
  }

  /** A field keeps `attribute` and `reflects` only when its attribute is listed. */
  function dropUnlistedAttributes(members, attributes) {
    const attributeNames = new Set(attributes.map((attr) => attr.name));
    return members.map((member) => {
      if (member.attribute && !attributeNames.has(member.attribute)) {
        const { attribute, reflects, ...rest } = member;
        return rest;
      }
      return member;
    });
  }

  /** Keeps the named events that are not internal. */
  function publicEvents(events) {
    return events
      .filter(notFromDeniedMixin)
      .filter((event) => !(event.type?.text === 'CustomEvent' && !event.name))
      .filter((event) => !ignoredEvents.includes(event.name))
      .sort(byNameIgnoreCase);
  }

  return {
    name: 'vaadin-public-api',

    packageLinkPhase({ customElementsManifest }) {
      for (const module of customElementsManifest.modules) {
        removePrivateClasses(module);
        for (const declaration of module.declarations || []) {
          if (declaration.members?.length) {
            declaration.members = publicMembers(declaration.members);
          }
          if (declaration.attributes?.length) {
            declaration.attributes = publicAttributes(declaration.attributes, declaration.members || []);
          }
          if (declaration.members?.length) {
            declaration.members = dropUnlistedAttributes(declaration.members, declaration.attributes || []);
          }
          if (declaration.events?.length) {
            declaration.events = publicEvents(declaration.events);
          }
        }
      }
      customElementsManifest.modules = customElementsManifest.modules.filter(
        (module) => module.declarations?.length || module.exports?.length,
      );
    },
  };
}
