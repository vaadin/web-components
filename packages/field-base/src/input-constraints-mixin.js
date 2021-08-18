/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { InputMixin } from './input-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

const InputConstraintsMixinImplementation = (superclass) =>
  class InputConstraintsMixinClass extends ValidateMixin(InputMixin(superclass)) {
    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      if (this.inputElement && this.constructor.constraints.some((c) => this.__isValidConstraint(this[c]))) {
        return this.inputElement.checkValidity();
      } else {
        return !this.invalid;
      }
    }

    /**
     * Override an observer from `ValidateMixin` to add support for multiple constraints.
     * @param {unknown[]} constraints
     * @protected
     * @override
     */
    _constraintsChanged(...constraints) {
      // Prevent marking field as invalid when setting required state
      // or any other constraint before a user has entered the value.
      if (!this.invalid) {
        return;
      }

      if (constraints.some((c) => this.__isValidConstraint(c))) {
        this.validate();
      } else {
        this.invalid = false;
      }
    }

    /** @private */
    __isValidConstraint(constraint) {
      // 0 is valid for `minlength` and `maxlength`
      return Boolean(constraint) || constraint === 0;
    }
  };

/**
 * A mixin to combine multiple input validation constraints.
 */
export const InputConstraintsMixin = dedupingMixin(InputConstraintsMixinImplementation);
