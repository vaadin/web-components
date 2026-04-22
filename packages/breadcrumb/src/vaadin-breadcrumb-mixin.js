/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that observes the breadcrumb's default light-DOM slot and
 * routes the first `<vaadin-breadcrumb-item>` child into the named `root`
 * slot in shadow DOM. Any previous root holder has its `slot` attribute
 * cleared. Non-item children (e.g. plain `<span>` elements) are ignored.
 *
 * @private
 */
class RootItemController extends SlotController {
  constructor(host) {
    super(host, '', null, { multiple: true, observe: true });
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
        });
        this.__rootSlotListenerAttached = true;
      }
    }
  }

  /**
   * @protected
   * @override
   */
  initNode() {
    this.__updateRootSlotAssignment();
  }

  /**
   * @protected
   * @override
   */
  initCustomNode() {
    this.__updateRootSlotAssignment();
  }

  /**
   * @protected
   * @override
   */
  teardownNode() {
    this.__updateRootSlotAssignment();
  }

  /** @private */
  __updateRootSlotAssignment() {
    const items = Array.from(this.host.children).filter((child) => child.localName === 'vaadin-breadcrumb-item');
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
