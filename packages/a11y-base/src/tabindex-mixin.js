/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from './disabled-mixin.js';

/**
 * A mixin to toggle the `tabindex` attribute.
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
         *
         * @protected
         */
        tabindex: {
          type: Number,
          reflectToAttribute: true,
          observer: '_tabindexChanged',
        },

        /**
         * Stores the last known tabindex since the element has been disabled.
         *
         * @protected
         */
        _lastTabIndex: {
          type: Number,
        },
      };
    }

    /**
     * When the element gets disabled, this observer saves the last known tabindex
     * and removes the `tabindex` attribute to make the element non-focusable.
     * Once the element is enabled again, the observer restores the saved tabindex
     * so that the element becomes focusable again.
     *
     * @protected
     * @override
     */
    _disabledChanged(disabled, oldDisabled) {
      super._disabledChanged(disabled, oldDisabled);

      if (disabled) {
        if (this.tabindex !== undefined) {
          this._lastTabIndex = this.tabindex;
        }
        this.tabindex = undefined;
      } else if (oldDisabled) {
        this.tabindex = this._lastTabIndex;
      }
    }

    /**
     * When the user has changed tabindex while the element is disabled,
     * the observer removes the `tabindex` attribute to ensure the element
     * remains non-focusable and instead saves the new tabindex value to
     * apply it later. The new value is applied when the element is enabled
     * again.
     *
     * @param {number | undefined} tabindex
     * @protected
     */
    _tabindexChanged(tabindex) {
      if (this.disabled && tabindex !== undefined) {
        this._lastTabIndex = tabindex;
        this.tabindex = undefined;
      }
    }
  };
