/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that observes the breadcrumb's default light-DOM slot and:
 *
 * 1. Routes the first `<vaadin-breadcrumb-item>` child into the named `root`
 *    slot in shadow DOM. Any previous root holder has its `slot` attribute
 *    cleared. Non-item children (e.g. plain `<span>` elements) are ignored.
 * 2. Toggles the `current` state attribute on the last
 *    `<vaadin-breadcrumb-item>` child whenever the trail changes (children
 *    added/removed) or whenever an item's `path` attribute is added/removed.
 *    The last item is marked `current` if and only if it has no `path`
 *    attribute, per Key Design Decisions §3 (the current page is the last
 *    item without `path`). All other items have `current` cleared.
 *
 * To detect `path` attribute mutations after the trail is rendered, the
 * controller installs a per-item `MutationObserver` filtered to `path` in
 * `initNode`/`initCustomNode`, and tears it down in `teardownNode`.
 *
 * @private
 */
class RootItemController extends SlotController {
  constructor(host) {
    super(host, '', null, { multiple: true, observe: true });
    /** @private */
    this.__pathObservers = new WeakMap();
  }

  /**
   * @protected
   * @override
   */
  hostConnected() {
    super.hostConnected();

    // The base SlotController only observes the default slot. The first item
    // is moved into the named `root` slot, so removing it does not trigger a
    // `slotchange` on the default slot. Listen for slot changes on the
    // `root` slot too, so we can reassign `slot="root"` to the new first item
    // when the previous holder is removed from light DOM.
    if (!this.__rootSlotListenerAttached) {
      const rootSlot = this.host.shadowRoot.querySelector('slot[name="root"]');
      if (rootSlot) {
        rootSlot.addEventListener('slotchange', () => {
          this.__updateRootSlotAssignment();
          this.__updateCurrentItem();
        });
        this.__rootSlotListenerAttached = true;
      }
    }
  }

  /**
   * @protected
   * @override
   */
  initNode(node) {
    this.__observePath(node);
    this.__updateRootSlotAssignment();
    this.__updateCurrentItem();
  }

  /**
   * @protected
   * @override
   */
  initCustomNode(node) {
    this.__observePath(node);
    this.__updateRootSlotAssignment();
    this.__updateCurrentItem();
  }

  /**
   * @protected
   * @override
   */
  teardownNode(node) {
    this.__unobservePath(node);
    this.__updateRootSlotAssignment();
    this.__updateCurrentItem();
  }

  /** @private */
  __observePath(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE || node.localName !== 'vaadin-breadcrumb-item') {
      return;
    }
    if (this.__pathObservers.has(node)) {
      return;
    }
    const observer = new MutationObserver(() => {
      this.__updateCurrentItem();
    });
    observer.observe(node, { attributes: true, attributeFilter: ['path'] });
    this.__pathObservers.set(node, observer);
  }

  /** @private */
  __unobservePath(node) {
    if (!node || !this.__pathObservers.has(node)) {
      return;
    }
    this.__pathObservers.get(node).disconnect();
    this.__pathObservers.delete(node);
  }

  /** @private */
  __updateRootSlotAssignment() {
    const items = this.__getItems();
    const firstItem = items[0];

    items.forEach((item) => {
      if (item === firstItem) {
        if (item.getAttribute('slot') !== 'root') {
          item.setAttribute('slot', 'root');
        }
      } else if (item.getAttribute('slot') === 'root') {
        item.removeAttribute('slot');
      }
    });
  }

  /** @private */
  __updateCurrentItem() {
    const items = this.__getItems();
    const lastItem = items[items.length - 1];
    const currentItem = lastItem && !lastItem.hasAttribute('path') ? lastItem : null;

    items.forEach((item) => {
      if (item === currentItem) {
        if (!item.hasAttribute('current')) {
          item.toggleAttribute('current', true);
        }
      } else if (item.hasAttribute('current')) {
        item.toggleAttribute('current', false);
      }
    });
  }

  /** @private */
  __getItems() {
    return Array.from(this.host.children).filter((child) => child.localName === 'vaadin-breadcrumb-item');
  }
}

/**
 * A mixin providing common `<vaadin-breadcrumb>` functionality.
 *
 * @polymerMixin
 */
export const BreadcrumbMixin = (superClass) =>
  class BreadcrumbMixinClass extends superClass {
    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Set default role if the application has not provided one.
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }

      // Observe the default slot and route the first item into slot="root".
      this._rootController = new RootItemController(this);
      this.addController(this._rootController);
    }
  };
