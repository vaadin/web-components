/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { InputConstraintsMixin } from './input-constraints-mixin.js';

const CharLengthMixinImplementation = (superclass) =>
  class CharLengthMixinClass extends InputConstraintsMixin(superclass) {
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

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'maxlength', 'minlength'];
    }

    static get constraints() {
      return [...super.constraints, 'maxlength', 'minlength'];
    }
  };

/**
 * A mixin to provide `minlength` and `maxlength` properties
 * for components that use `<input>` or `<textarea>`.
 */
export const CharLengthMixin = dedupingMixin(CharLengthMixinImplementation);
