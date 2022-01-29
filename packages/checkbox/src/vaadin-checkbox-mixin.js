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
 * A mixin to provide checkbox component logic.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes CheckedMixin
 * @mixes DelegateFocusMixin
 * @mixes LabelMixin
 */
export const CheckboxMixin = (superclass) =>
  class Checkbox extends LabelMixin(CheckedMixin(DelegateFocusMixin(ActiveMixin(superclass)))) {
    static get properties() {
      return {
        /**
         * True if the checkbox is in the indeterminate state which means
         * it is not possible to say whether it is checked or unchecked.
         * The state is reset once the user switches the checkbox by hand.
         *
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
         *
         * @type {boolean}
         */
        indeterminate: {
          type: Boolean,
          notify: true,
          value: false,
          reflectToAttribute: true
        },

        /**
         * The name of the checkbox.
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
    static get delegateProps() {
      return [...super.delegateProps, 'indeterminate'];
    }

    /** @override */
    static get delegateAttrs() {
      return [...super.delegateAttrs, 'name'];
    }

    constructor() {
      super();

      this._setType('checkbox');

      // Set the string "on" as the default value for the checkbox following the HTML specification:
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
        `WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.
      Please use <label slot="label"> wrapper or the label property instead.`
      );
    }

    /**
     * Extends the method from `ActiveMixin` in order to
     * prevent setting the `active` attribute when interacting with a link inside the label.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetActive(event) {
      if (event.target.localName === 'a') {
        return false;
      }

      return super._shouldSetActive(event);
    }

    /**
     * Extends the method from `CheckedMixin` in order to
     * reset the indeterminate state once the user switches the checkbox.
     *
     * @param {boolean} checked
     * @protected
     * @override
     */
    _toggleChecked(checked) {
      if (this.indeterminate) {
        this.indeterminate = false;
      }

      super._toggleChecked(checked);
    }
  };
