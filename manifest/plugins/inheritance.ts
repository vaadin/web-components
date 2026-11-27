import type { ClassLike, Reference } from 'custom-elements-manifest';
import type { Plugin } from '../lib/plugin-types.ts';

/**
 * CEM analyzer plugin that applies inheritance from the items each class and
 * mixin declares itself.
 *
 * The analyzer follows only the last mixin of each chain
 * (open-wc/custom-elements-manifest#147), copies from ancestors it already
 * merged, so the result depends on the module order, and lets an ancestor
 * override the `type` and `privacy` of an item the class declares itself.
 *
 * This plugin records the own items of every declaration in `moduleLinkPhase`,
 * before the analyzer merges anything, and rebuilds every class and mixin in
 * `packageLinkPhase` from the ancestors nearest first. Each mixin comes before
 * the mixins it applies itself, the superclass comes last. When several
 * declarations in the chain have an item of the same name, the nearest one
 * wins and the farther ones fill the fields it leaves out, such as the
 * description or the privacy of an override without JSDoc. An inherited item
 * names the nearest declaring module in `inheritedFrom`.
 */

// The arrays of a class or mixin declaration that inheritance applies to. Slots,
// parts, states and CSS properties are documented on each component class instead.
const ITEM_FIELDS = ['attributes', 'members', 'events'] as const;

type ItemField = (typeof ITEM_FIELDS)[number];

/** An attribute, a member or an event. */
interface Item {
  name: string;
  inheritedFrom?: Reference;
  resolveInitializer?: unknown;
  [field: string]: unknown;
}

/** A class or mixin declaration, with the item fields that inheritance replaces. */
type ItemHolder = Omit<ClassLike, ItemField> & Partial<Record<ItemField, Item[]>>;

/** What a class or mixin declares itself. */
interface Snapshot {
  name: string;
  module: string;
  parents: Reference[];
  items: Record<ItemField, Item[]>;
}

// Mixin names repeat across packages, so a declaration is identified by its module too
const declarationKey = (modulePath: string, name: string): string => `${modulePath}#${name}`;

/**
 * Copies the items of a declaration before the analyzer merges or post-processes them,
 * without `resolveInitializer`, a marker the analyzer deletes in a later step. The marker
 * only occurs on fields assigned from a constructor parameter here.
 */
const copyOwnItems = (items: Item[] = []): Item[] =>
  items.map(({ resolveInitializer, ...item }) => structuredClone(item));

/**
 * Sets the fields of the item from a nearer declaration that only the item
 * from a farther declaration has, such as the description of an override.
 */
function fillMissingFields(nearerItem: Item, fartherItem: Item): void {
  for (const [name, value] of Object.entries(fartherItem)) {
    nearerItem[name] ??= value;
  }
}

/**
 * Maps a `mixins` entry or the `superclass` of a declaration to the manifest
 * path of the module that declares it, `packages/<package>/src/<file>.js`.
 * The analyzer records a relative import with a leading slash, as it resolves
 * it against `file:///`, and a bare import as a package. A `@vaadin/<package>`
 * import points to the workspace of that name under `packages/`.
 * @return undefined for a package outside this repo, such as `lit`
 */
function referencedModulePath(reference: Reference): string | undefined {
  if (reference.module) {
    return reference.module.replace(/^\//u, '');
  }
  if (reference.package?.startsWith('@vaadin/')) {
    return `packages/${reference.package.slice('@vaadin/'.length)}`;
  }
  return undefined;
}

export function inheritancePlugin(): Plugin {
  // What every class and mixin declares itself, by declaration key
  const snapshots = new Map<string, Snapshot>();

  /** @return the snapshot of the declaration a `mixins` entry or `superclass` points to */
  function referencedSnapshot(reference: Reference): Snapshot | undefined {
    const modulePath = referencedModulePath(reference);
    return modulePath ? snapshots.get(declarationKey(modulePath, reference.name)) : undefined;
  }

  // The ancestors of each snapshot, computed once per snapshot
  const ancestorsBySnapshot = new Map<Snapshot, Snapshot[]>();

  /**
   * Lists the snapshots of the ancestors of a declaration nearest first, each once.
   * A mixin applied more than once is listed at its innermost application, as
   * `dedupeMixin` skips the outer ones. The few mixins applied twice without it
   * have no override in between, so the same rule applies to them.
   */
  function ancestorsNearestFirst(snapshot: Snapshot): Snapshot[] {
    if (!ancestorsBySnapshot.has(snapshot)) {
      // An empty entry ends a cycle of references
      ancestorsBySnapshot.set(snapshot, []);
      const all = snapshot.parents
        .map(referencedSnapshot)
        .filter((ancestor) => ancestor !== undefined)
        .flatMap((ancestor) => [ancestor, ...ancestorsNearestFirst(ancestor)]);
      ancestorsBySnapshot.set(
        snapshot,
        all.filter((ancestor, index) => ancestor !== snapshot && all.lastIndexOf(ancestor) === index),
      );
    }
    return ancestorsBySnapshot.get(snapshot)!;
  }

  /** Replaces the items of the declaration with its own items and the inherited ones. */
  function applyInheritance(declaration: ItemHolder, snapshot: Snapshot): void {
    const chain = [snapshot, ...ancestorsNearestFirst(snapshot)];
    for (const field of ITEM_FIELDS) {
      // The item of each name from the nearest declaration in the chain, and that declaration
      const itemsByName = new Map<string, { item: Item; declaredBy: Snapshot }>();
      for (const declaredBy of chain) {
        for (const item of declaredBy.items[field]) {
          const nearer = itemsByName.get(item.name);
          if (nearer) {
            fillMissingFields(nearer.item, item);
          } else {
            itemsByName.set(item.name, { item: structuredClone(item), declaredBy });
          }
        }
      }
      const items = [...itemsByName.values()].map(({ item, declaredBy }) =>
        declaredBy === snapshot
          ? item
          : { ...item, inheritedFrom: { name: declaredBy.name, module: declaredBy.module } },
      );
      if (items.length) {
        declaration[field] = items;
      } else {
        delete declaration[field];
      }
    }
  }

  return {
    name: 'vaadin-inheritance',

    moduleLinkPhase({ moduleDoc }) {
      for (const declaration of moduleDoc.declarations || []) {
        if (declaration.kind !== 'class' && declaration.kind !== 'mixin') {
          continue;
        }
        snapshots.set(declarationKey(moduleDoc.path, declaration.name), {
          name: declaration.name,
          module: moduleDoc.path,
          parents: [...(declaration.mixins || []), declaration.superclass].filter((parent) => parent !== undefined),
          items: Object.fromEntries(
            ITEM_FIELDS.map((field) => [field, copyOwnItems((declaration as ItemHolder)[field])]),
          ) as Snapshot['items'],
        });
      }
    },

    packageLinkPhase({ customElementsManifest }) {
      for (const module of customElementsManifest.modules) {
        for (const declaration of module.declarations || []) {
          const snapshot = snapshots.get(declarationKey(module.path, declaration.name));
          if (snapshot) {
            applyInheritance(declaration as ItemHolder, snapshot);
          }
        }
      }
    },
  };
}
