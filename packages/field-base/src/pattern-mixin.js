/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ForwardInputPropsMixin } from './forward-input-props-mixin.js';

const PatternMixinImplementation = (superclass) =>
  class PatternMixinClass extends ForwardInputPropsMixin(superclass) {
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

    static get forwardProps() {
      return [...super.forwardProps, 'pattern'];
    }

    static get constraints() {
      return [...super.constraints, 'pattern'];
    }

    /**
     * Override an observer from `ValidateMixin` to add `pattern` constraint.
     * @param {boolean | undefined} required
     * @param {string | undefined} pattern
     * @protected
     * @override
     */
    _constraintsChanged(required, pattern) {
      // Prevent marking field as invalid when setting required state
      // or any other constraint before a user has entered the value.
      if (!this.invalid) {
        return;
      }

      if (!required && !pattern) {
        this.invalid = false;
      } else {
        this.validate();
      }
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
          return;
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

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      if (this.required || this.pattern) {
        return this.inputElement ? this.inputElement.checkValidity() : undefined;
      } else {
        return !this.invalid;
      }
    }
  };

/**
 * A mixin to provide `pattern` and `preventInvalidInput` properties.
 */
export const PatternMixin = dedupingMixin(PatternMixinImplementation);
