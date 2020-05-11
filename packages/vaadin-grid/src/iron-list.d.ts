import {IronResizableBehavior} from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';

import {IronScrollTargetBehavior} from '@polymer/iron-scroll-target-behavior/iron-scroll-target-behavior.js';

import {LegacyElementMixin} from '@polymer/polymer/lib/legacy/legacy-element-mixin.js';

interface PolymerIronList extends IronResizableBehavior, IronScrollTargetBehavior {
  /**
   * Scroll to a specific index in the virtual list regardless
   * of the physical items in the DOM tree.
   *
   * @param idx - The index of the item
   */
  scrollToIndex(idx: number): void;
}

declare class PolymerIronList extends LegacyElementMixin(HTMLElement) implements PolymerIronList {
}

export {PolymerIronList};
