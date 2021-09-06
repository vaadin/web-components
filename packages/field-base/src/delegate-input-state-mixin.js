/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DelegateStateMixin } from './delegate-state-mixin.js';
import { InputMixin } from './input-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

const DelegateInputStateMixinImplementation = (superclass) =>
  class DelegateInputStateMixinClass extends DelegateStateMixin(ValidateMixin(InputMixin(superclass))) {
    static get properties() {
      return {
        /**
         * The name of this field.
         */
        name: {
          type: String,
          reflectToAttribute: true
        },

        /**
         * A hint to the user of what can be entered in the field.
         */
        placeholder: {
          type: String,
          reflectToAttribute: true
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * The text usually displayed in a tooltip popup when the mouse is over the field.
         */
        title: {
          type: String,
          reflectToAttribute: true
        }
      };
    }

    static get delegateAttrs() {
      return ['name', 'type', 'placeholder', 'required', 'readonly', 'invalid', 'title'];
    }

    /** @protected */
    get _delegateStateTarget() {
      return this.inputElement;
    }
  };

/**
 * A mixin to delegate attributes to the input element.
 */
export const DelegateInputStateMixin = dedupingMixin(DelegateInputStateMixinImplementation);
