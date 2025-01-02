/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes FocusMixin
 */
export const ItemMixin = (superClass) =>
  class VaadinItemMixin extends ActiveMixin(FocusMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Used for mixin detection because `instanceof` does not work with mixins.
         * e.g. in VaadinListMixin it filters items by using the
         * `element._hasVaadinItemMixin` condition.
         * @type {boolean}
         */
        _hasVaadinItemMixin: {
          value: true,
        },

        /**
         * If true, the item is in selected state.
         * @type {boolean}
         */
        selected: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '_selectedChanged',
          sync: true,
        },

        /** @private */
        _value: String,
      };
    }

    /**
     * By default, `Space` is the only possible activation key for a focusable HTML element.
     * Nonetheless, the item is an exception as it can be also activated by pressing `Enter`.
     * See the "Keyboard Support" section in https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html.
     *
     * @protected
     * @override
     */
    get _activeKeys() {
      return ['Enter', ' '];
    }

    /**
     * @return {string}
     */
    get value() {
      return this._value !== undefined ? this._value : this.textContent.trim();
    }

    /**
     * @param {string} value
     */
    set value(value) {
      this._value = value;
    }

    /** @protected */
    ready() {
      super.ready();

      const attrValue = this.getAttribute('value');
      if (attrValue !== null) {
        this.value = attrValue;
      }
    }

    /**
     * Override native `focus` to set focused attribute
     * when focusing the item programmatically.
     * @protected
     * @override
     */
    focus() {
      if (this.disabled) {
        return;
      }

      super.focus();
      this._setFocused(true);
    }

    /**
     * @param {KeyboardEvent | MouseEvent} _event
     * @protected
     * @override
     */
    _shouldSetActive(event) {
      return !this.disabled && !(event.type === 'keydown' && event.defaultPrevented);
    }

    /** @private */
    _selectedChanged(selected) {
      this.setAttribute('aria-selected', selected);
    }

    /**
     * Override an observer from `DisabledMixin`.
     * @protected
     * @override
     */
    _disabledChanged(disabled) {
      super._disabledChanged(disabled);

      if (disabled) {
        this.selected = false;
        this.blur();
      }
    }

    /**
     * In order to be fully accessible from the keyboard, the item should
     * manually fire the `click` event once an activation key is pressed.
     *
     * According to the UI Events specifications,
     * the `click` event should be fired exactly on `keydown`:
     * https://www.w3.org/TR/uievents/#event-type-keydown
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this._activeKeys.includes(event.key) && !event.defaultPrevented) {
        event.preventDefault();

        // `DisabledMixin` overrides the standard `click()` method
        // so that it doesn't fire the `click` event when the element is disabled.
        this.click();
      }
    }
  };
