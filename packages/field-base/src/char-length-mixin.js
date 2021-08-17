/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ForwardInputPropsMixin } from './forward-input-props-mixin.js';

const CharLengthMixinImplementation = (superclass) =>
  class CharLengthMixinClass extends ForwardInputPropsMixin(superclass) {
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

    static get constraints() {
      return [...super.constraints, 'maxlength', 'minlength'];
    }

    /**
     * Override an observer from `ValidateMixin` to add `minlength` and `maxlength` constraints.
     * @param {boolean | undefined} required
     * @param {number | undefined} minlength
     * @param {number | undefined} maxlength
     * @protected
     * @override
     */
    _constraintsChanged(required, minlength, maxlength) {
      // Prevent marking field as invalid when setting required state
      // or any other constraint before a user has entered the value.
      if (!this.invalid) {
        return;
      }

      if (!required && !minlength && !maxlength) {
        this.invalid = false;
      } else {
        this.validate();
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      if (this.required || this.maxlength || this.minlength) {
        return this.inputElement ? this.inputElement.checkValidity() : undefined;
      } else {
        return !this.invalid;
      }
    }
  };

/**
 * A mixin to provide `minlength` and `maxlength` properties
 * for components that use `<input>` or `<textarea>`.
 */
export const CharLengthMixin = dedupingMixin(CharLengthMixinImplementation);
