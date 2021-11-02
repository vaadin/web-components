/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from './disabled-mixin.js';

/**
 * A mixin to toggle the `tabindex` attribute.
 *
 * By default, the attribute is set to 0 that makes the element focusable.
 *
 * The attribute is set to -1 whenever the user disables the element
 * and restored with the last known value once the element is enabled.
 *
 * @polymerMixin
 * @mixes DisabledMixin
 */
export const TabindexMixin = (superclass) =>
  class TabindexMixinClass extends DisabledMixin(superclass) {
    static get properties() {
      return {
        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         * @protected
         */
        tabindex: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
          observer: '_tabindexChanged'
        },

        /**
         * Stores the last known tabindex since the element has been disabled.
         *
         * @private
         */
        __lastTabIndex: {
          type: Number,
          value: 0
        }
      };
    }

    /**
     * When the element gets disabled, the observer saves the last known tabindex
     * and makes the element not focusable by setting tabindex to -1.
     * As soon as the element gets enabled, the observer restores the last known tabindex
     * so that the element can be focusable again.
     *
     * @protected
     * @override
     */
    _disabledChanged(disabled, oldDisabled) {
      super._disabledChanged(disabled, oldDisabled);

      if (disabled) {
        this.__lastTabIndex = this.tabindex;
        this.tabindex = -1;
      } else if (oldDisabled) {
        this.tabindex = this.__lastTabIndex;
      }
    }

    /**
     * When the user has changed tabindex while the element is disabled,
     * the observer reverts tabindex to -1 and rather saves the new tabindex value to apply it later.
     * The new value will be applied as soon as the element becomes enabled.
     *
     * @protected
     */
    _tabindexChanged(tabindex) {
      if (this.disabled && tabindex !== -1) {
        this.__lastTabIndex = tabindex;
        this.tabindex = -1;
      }
    }
  };
