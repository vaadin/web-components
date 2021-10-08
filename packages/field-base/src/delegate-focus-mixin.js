/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';

/**
 * A mixin to forward focus to an element in the light DOM.
 *
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes FocusMixin
 */
export const DelegateFocusMixin = dedupingMixin(
  (superclass) =>
    class DelegateFocusMixinClass extends FocusMixin(DisabledMixin(superclass)) {
      static get properties() {
        return {
          /**
           * Specify that this control should have input focus when the page loads.
           */
          autofocus: {
            type: Boolean
          },

          /**
           * A reference to the focusable element controlled by the mixin.
           * It can be an input, textarea, button or any element with tabindex > -1.
           *
           * Any component implementing this mixin is expected to provide it
           * by using `this._setFocusElement(input)` Polymer API.
           *
           * @protected
           * @type {!HTMLElement}
           */
          focusElement: {
            type: Object,
            readOnly: true,
            observer: '_focusElementChanged'
          }
        };
      }

      constructor() {
        super();

        this._boundOnBlur = this._onBlur.bind(this);
        this._boundOnFocus = this._onFocus.bind(this);
      }

      /** @protected */
      ready() {
        super.ready();

        if (this.autofocus && !this.disabled) {
          requestAnimationFrame(() => {
            this.focus();
            this.setAttribute('focus-ring', '');
          });
        }
      }

      /**
       * @protected
       * @override
       */
      focus() {
        if (!this.focusElement || this.disabled) {
          return;
        }

        this.focusElement.focus();
        this._setFocused(true);
      }

      /**
       * @protected
       * @override
       */
      blur() {
        if (!this.focusElement) {
          return;
        }
        this.focusElement.blur();
        this._setFocused(false);
      }

      /**
       * @protected
       * @override
       */
      click() {
        if (this.focusElement && !this.disabled) {
          this.focusElement.click();
        }
      }

      /** @protected */
      _focusElementChanged(element, oldElement) {
        if (element) {
          element.disabled = this.disabled;
          this._addFocusListeners(element);
        } else if (oldElement) {
          this._removeFocusListeners(oldElement);
        }
      }

      /**
       * @param {HTMLElement} element
       * @protected
       */
      _addFocusListeners(element) {
        element.addEventListener('blur', this._boundOnBlur);
        element.addEventListener('focus', this._boundOnFocus);
      }

      /**
       * @param {HTMLElement} element
       * @protected
       */
      _removeFocusListeners(element) {
        element.removeEventListener('blur', this._boundOnBlur);
        element.removeEventListener('focus', this._boundOnFocus);
      }

      /**
       * Focus event does not bubble, so we dispatch it manually
       * on the host element to support adding focus listeners
       * when the focusable element is placed in light DOM.
       * @param {FocusEvent} event
       * @protected
       */
      _onFocus(event) {
        event.stopPropagation();
        this.dispatchEvent(new Event('focus'));
      }

      /**
       * Blur event does not bubble, so we dispatch it manually
       * on the host element to support adding blur listeners
       * when the focusable element is placed in light DOM.
       * @param {FocusEvent} event
       * @protected
       */
      _onBlur(event) {
        event.stopPropagation();
        this.dispatchEvent(new Event('blur'));
      }

      /**
       * @param {Event} event
       * @return {boolean}
       * @protected
       * @override
       */
      _shouldSetFocus(event) {
        return event.target === this.focusElement;
      }

      /**
       * @param {boolean} disabled
       * @protected
       */
      _disabledChanged(disabled) {
        super._disabledChanged(disabled);

        if (this.focusElement) {
          this.focusElement.disabled = disabled;
        }

        if (disabled) {
          this.blur();
        }
      }
    }
);
