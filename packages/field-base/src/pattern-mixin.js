/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { InputConstraintsMixin } from './input-constraints-mixin.js';

/**
 * A mixin to provide `pattern` and `preventInvalidInput` properties.
 *
 * @polymerMixin
 * @mixes InputConstraintsMixin
 */
export const PatternMixin = (superclass) =>
  class PatternMixinClass extends InputConstraintsMixin(superclass) {
    static get properties() {
      return {
        /**
         * A regular expression that the value is checked against.
         * The pattern must match the entire value, not just some subset.
         */
        pattern: {
          type: String
        },

        /**
         * When set to true, user is prevented from typing a value that
         * conflicts with the given `pattern`.
         * @attr {boolean} prevent-invalid-input
         */
        preventInvalidInput: {
          type: Boolean
        }
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'pattern'];
    }

    static get constraints() {
      return [...super.constraints, 'pattern'];
    }

    /** @private */
    _checkInputValue() {
      if (this.preventInvalidInput) {
        const input = this.inputElement;
        if (input && input.value.length > 0 && !this.checkValidity()) {
          input.value = this.value || '';
          // add input-prevented attribute for 200ms
          this.setAttribute('input-prevented', '');
          this._inputDebouncer = Debouncer.debounce(this._inputDebouncer, timeOut.after(200), () => {
            this.removeAttribute('input-prevented');
          });
        }
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onInput(event) {
      this._checkInputValue();

      super._onInput(event);
    }
  };
