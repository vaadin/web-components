/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';

/**
 * A mixin providing common radio-button functionality.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes CheckedMixin
 * @mixes DelegateFocusMixin
 * @mixes LabelMixin
 */
export const RadioButtonMixin = (superclass) =>
  class RadioButtonMixinClass extends LabelMixin(CheckedMixin(DelegateFocusMixin(ActiveMixin(superclass)))) {
    static get properties() {
      return {
        /**
         * The name of the radio button.
         *
         * @type {string}
         */
        name: {
          type: String,
          value: '',
        },

        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         *
         * @override
         * @protected
         */
        tabindex: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
        },
      };
    }

    /** @override */
    static get delegateAttrs() {
      return [...super.delegateAttrs, 'name'];
    }

    constructor() {
      super();

      this._setType('radio');

      // Set the string "on" as the default value for the radio button following the HTML specification:
      // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
      this.value = 'on';
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );
      this.addController(new LabelledInputController(this.inputElement, this._labelController));
    }
  };
