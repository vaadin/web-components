/**
 * CEM analyzer plugin that keeps the `type` and `privacy` a class or mixin
 * declares itself.
 *
 * The analyzer merges inherited items into a class after all modules are
 * analyzed. When the class overrides an item, the ancestor's `type` and
 * `privacy` win over the class's own. `GridI18n` then becomes `Object`, a
 * `@private` override becomes public, and `@fires Event` becomes `CustomEvent`.
 * The module link phase runs before that merge, so the plugin records each
 * declaration's own values there and restores them afterwards.
 */
const FIELDS = ['members', 'attributes', 'events', 'slots', 'cssParts', 'cssStates', 'cssProperties'];

const key = (modulePath, declaration) => `${modulePath}#${declaration.name}`;

function restore(declaration, items) {
  for (const field of FIELDS) {
    for (const item of declaration[field] || []) {
      const ownItem = items.get(`${field} ${item.name}`);
      if (ownItem?.type) {
        item.type = ownItem.type;
      }
      if (ownItem?.privacy) {
        item.privacy = ownItem.privacy;
      }
    }
  }
}

export function preserveOverridesPlugin() {
  // Keyed by module path and declaration name, as mixin names repeat across packages
  const own = new Map();

  return {
    name: 'vaadin-preserve-overrides',

    moduleLinkPhase({ moduleDoc }) {
      for (const declaration of moduleDoc.declarations || []) {
        if (declaration.kind !== 'class' && declaration.kind !== 'mixin') {
          continue;
        }
        const items = new Map();
        for (const field of FIELDS) {
          for (const { name, type, privacy } of declaration[field] || []) {
            items.set(`${field} ${name}`, { type, privacy });
          }
        }
        own.set(key(moduleDoc.path, declaration), items);
      }
    },

    packageLinkPhase({ customElementsManifest }) {
      for (const module of customElementsManifest.modules) {
        for (const declaration of module.declarations || []) {
          const items = own.get(key(module.path, declaration));
          if (items) {
            restore(declaration, items);
          }
        }
      }
    },
  };
}
