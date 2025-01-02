/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
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

      // Set tabindex to 0 by default to not lose focus on click in Safari
      // See https://github.com/vaadin/web-components/pull/6780
      this.tabindex = 0;
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
