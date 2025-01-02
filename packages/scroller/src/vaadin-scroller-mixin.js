/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';

/**
 * @polymerMixin
 * @mixes FocusMixin
 */
export const ScrollerMixin = (superClass) =>
  class ScrollerMixinClass extends FocusMixin(superClass) {
    static get properties() {
      return {
        /**
         * This property indicates the scroll direction. Supported values are `vertical`, `horizontal`, `none`.
         * When `scrollDirection` is undefined scrollbars will be shown in both directions.
         * @attr {string} scroll-direction
         */
        scrollDirection: {
          type: String,
          reflectToAttribute: true,
        },

        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         * @protected
         */
        tabindex: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
        },
      };
    }

    /**
     * Override method inherited from `FocusMixin` to mark the scroller as focused
     * only when the host is focused.
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldSetFocus(event) {
      return event.target === this;
    }
  };
