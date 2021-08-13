/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { InputFieldMixin } from './input-field-mixin.js';
import { PatternMixin } from './pattern-mixin.js';

const TextFieldMixinImplementation = (superclass) =>
  class TextFieldMixinClass extends InputFieldMixin(PatternMixin(superclass)) {
    static get properties() {
      return {
        /**
         * Maximum number of characters (in Unicode code points) that the user can enter.
         */
        maxlength: {
          type: Number
        },

        /**
         * Minimum number of characters (in Unicode code points) that the user can enter.
         */
        minlength: {
          type: Number
        }
      };
    }

    static get forwardProps() {
      return [...super.forwardProps, 'maxlength', 'minlength'];
    }

    /**
     * Override the method inherited from `PatternMixin` to add minlength and maxlength.
     * @protected
     */
    _createConstraintsObserver() {
      // This complex observer needs to be added dynamically instead of using `static get observers()`
      // to make it possible to tweak this behavior in classes that apply this mixin.
      // An example is `vaadin-email-field` where the pattern is set before defining the observer.
      this._createMethodObserver('_constraintsChanged(required, minlength, maxlength, pattern)');
    }

    /**
     * * Override the method inherited from `PatternMixin` to add minlength and maxlength.
     * @param {boolean | undefined} required
     * @param {number | undefined} minlength
     * @param {number | undefined} maxlength
     * @param {string | undefined} pattern
     * @protected
     */
    _constraintsChanged(required, minlength, maxlength, pattern) {
      // Prevent marking field as invalid when setting required state
      // or any other constraint before a user has entered the value.
      if (!this.invalid) {
        return;
      }

      if (!required && !minlength && !maxlength && !pattern) {
        this.invalid = false;
      } else {
        this.validate();
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any)
     * @return {boolean}
     */
    checkValidity() {
      if (this.required || this.pattern || this.maxlength || this.minlength) {
        return this.inputElement ? this.inputElement.checkValidity() : undefined;
      } else {
        return !this.invalid;
      }
    }
  };

/**
 * A mixin to provide validation constraints for vaadin-text-field and related components.
 */
export const TextFieldMixin = dedupingMixin(TextFieldMixinImplementation);
