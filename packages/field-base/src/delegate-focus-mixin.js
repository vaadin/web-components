/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { FocusMixin } from './focus-mixin.js';
import { DisabledMixin } from './disabled-mixin.js';

const DelegateFocusMixinImplementation = (superclass) =>
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
          readOnly: true
        }
      };
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

    focus() {
      if (!this.focusElement || this.disabled) {
        return;
      }

      this.focusElement.focus();
      this._setFocused(true);
    }

    blur() {
      if (!this.focusElement) {
        return;
      }
      this.focusElement.blur();
      this._setFocused(false);
    }

    click() {
      if (this.focusElement && !this.disabled) {
        this.focusElement.click();
      }
    }

    /**
     * @param {Event} event
     * @return {boolean}
     * @protected
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
  };

/**
 * A mixin to forward focus to an element in the light DOM.
 */
export const DelegateFocusMixin = dedupingMixin(DelegateFocusMixinImplementation);
