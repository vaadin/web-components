/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { CharLengthMixin } from './char-length-mixin.js';
import { InputFieldMixin } from './input-field-mixin.js';
import { PatternMixin } from './pattern-mixin.js';

const TextFieldMixinImplementation = (superclass) =>
  class TextFieldMixinClass extends InputFieldMixin(CharLengthMixin(PatternMixin(superclass))) {
    /**
     * Override an observer from `ValidateMixin` to combine `pattern`, `minlength` and `maxlength`.
     * @param {boolean | undefined} required
     * @param {string | undefined} pattern
     * @param {number | undefined} minlength
     * @param {number | undefined} maxlength
     * @protected
     * @override
     */
    _constraintsChanged(required, pattern, minlength, maxlength) {
      // Prevent marking field as invalid when setting required state
      // or any other constraint before a user has entered the value.
      if (!this.invalid) {
        return;
      }

      if (!required && !pattern && !minlength && !maxlength) {
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
