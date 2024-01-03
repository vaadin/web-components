/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';

/**
 * @polymerMixin
 * @mixes ItemMixin
 */
export const TabMixin = (superClass) =>
  class TabMixinClass extends ItemMixin(superClass) {
    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'tab');
    }

    /**
     * Override an event listener from `KeyboardMixin`
     * to handle clicking anchors inside the tabs.
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyUp(event) {
      const willClick = this.hasAttribute('active');

      super._onKeyUp(event);

      if (willClick) {
        const anchor = this.querySelector('a');
        if (anchor) {
          anchor.click();
        }
      }
    }
  };
