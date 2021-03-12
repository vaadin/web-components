/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 * @polymerMixin
 */
export const ItemMixin = (superClass) =>
  class VaadinItemMixin extends superClass {
    static get properties() {
      return {
        /**
         * Used for mixin detection because `instanceof` does not work with mixins.
         * e.g. in VaadinListMixin it filters items by using the
         * `element._hasVaadinItemMixin` condition.
         * @type {boolean}
         */
        _hasVaadinItemMixin: {
          value: true
        },

        /**
         * If true, the user cannot interact with this element.
         * @type {boolean}
         */
        disabled: {
          type: Boolean,
          value: false,
          observer: '_disabledChanged',
          reflectToAttribute: true
        },

        /**
         * If true, the item is in selected state.
         * @type {boolean}
         */
        selected: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '_selectedChanged'
        },

        /** @private */
        _value: String
      };
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

      this.addEventListener('focus', () => this._setFocused(true), true);
      this.addEventListener('blur', () => this._setFocused(false), true);
      this.addEventListener('mousedown', () => {
        this._setActive((this._mousedown = true));
        const mouseUpListener = () => {
          this._setActive((this._mousedown = false));
          document.removeEventListener('mouseup', mouseUpListener);
        };
        document.addEventListener('mouseup', mouseUpListener);
      });
      this.addEventListener('keydown', (e) => this._onKeydown(e));
      this.addEventListener('keyup', (e) => this._onKeyup(e));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // in Firefox and Safari, blur does not fire on the element when it is removed,
      // especially between keydown and keyup events, being active at the same time.
      // reproducible in `<vaadin-select>` when closing overlay on select.
      if (this.hasAttribute('active')) {
        this._setFocused(false);
      }
    }

    /** @private */
    _selectedChanged(selected) {
      this.setAttribute('aria-selected', selected);
    }

    /** @private */
    _disabledChanged(disabled) {
      if (disabled) {
        this.selected = false;
        this.setAttribute('aria-disabled', 'true');
        this.blur();
      } else {
        this.removeAttribute('aria-disabled');
      }
    }

    /**
     * @param {boolean} focused
     * @protected
     */
    _setFocused(focused) {
      if (focused) {
        this.setAttribute('focused', '');
        if (!this._mousedown) {
          this.setAttribute('focus-ring', '');
        }
      } else {
        this.removeAttribute('focused');
        this.removeAttribute('focus-ring');
        this._setActive(false);
      }
    }

    /**
     * @param {boolean} active
     * @protected
     */
    _setActive(active) {
      if (active) {
        this.setAttribute('active', '');
      } else {
        this.removeAttribute('active');
      }
    }

    /**
     * @param {!KeyboardEvent} event
     * @protected
     */
    _onKeydown(event) {
      if (/^( |SpaceBar|Enter)$/.test(event.key) && !event.defaultPrevented) {
        event.preventDefault();
        this._setActive(true);
      }
    }

    /**
     * @param {!KeyboardEvent} event
     * @protected
     */
    _onKeyup() {
      if (this.hasAttribute('active')) {
        this._setActive(false);
        this.click();
      }
    }
  };
