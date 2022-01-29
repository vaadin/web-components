/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { SlotTargetController } from '@vaadin/field-base/src/slot-target-controller.js';

/**
 * A mixin to provide radio-button component logic.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes CheckedMixin
 * @mixes DelegateFocusMixin
 * @mixes LabelMixin
 */
export const RadioButtonMixin = (superclass) =>
  class Checkbox extends LabelMixin(CheckedMixin(DelegateFocusMixin(ActiveMixin(superclass)))) {
    static get properties() {
      return {
        /**
         * The name of the radio button.
         *
         * @type {string}
         */
        name: {
          type: String,
          value: ''
        }
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

      this._inputController = new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      });
      this.addController(this._inputController);
      this.addController(new LabelledInputController(this.inputElement, this._labelController));
      this.addController(
        new SlotTargetController(
          this.$.noop,
          () => this._labelController.node,
          () => this.__warnDeprecated()
        )
      );
    }

    /** @private */
    __warnDeprecated() {
      console.warn(
        `WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-radio-button> is deprecated.
    Please use <label slot="label"> wrapper or the label property instead.`
      );
    }
  };
