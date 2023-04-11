/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * A mixin to provide required state and validation logic.
 *
 * @polymerMixin
 */
export const ValidateMixin = dedupingMixin(
  (superclass) =>
    class ValidateMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * Set to true when the field is invalid.
           */
          invalid: {
            type: Boolean,
            reflectToAttribute: true,
            notify: true,
            value: false,
          },

          /**
           * Specifies that the user must fill in a value.
           */
          required: {
            type: Boolean,
            reflectToAttribute: true,
          },
        };
      }

      /**
       * Returns true if field is valid, and sets `invalid` based on the field validity.
       *
       * @return {boolean} True if the value is valid.
       */
      validate() {
        return !(this.invalid = !this.checkValidity());
      }

      /**
       * Returns true if the field value satisfies all constraints (if any).
       *
       * @return {boolean}
       */
      checkValidity() {
        return !this.required || !!this.value;
      }
    },
);
