/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ActiveMixin } from '@vaadin/a11y-base/src/active-mixin.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';

/**
 * A mixin providing common checkbox functionality.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes CheckedMixin
 * @mixes DelegateFocusMixin
 * @mixes FieldMixin
 */
export const CheckboxMixin = (superclass) =>
  class CheckboxMixinClass extends FieldMixin(CheckedMixin(DelegateFocusMixin(ActiveMixin(superclass)))) {
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
          reflectToAttribute: true,
        },

        /**
         * The name of the checkbox.
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
    static get delegateProps() {
      return [...super.delegateProps, 'indeterminate'];
    }

    /** @override */
    static get delegateAttrs() {
      return [...super.delegateAttrs, 'name', 'invalid'];
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

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );
      this.addController(new LabelledInputController(this.inputElement, this._labelController));

      this._createMethodObserver('_checkedChanged(checked)');
    }

    /**
     * Override method inherited from `ActiveMixin` to prevent setting
     * `active` attribute when clicking a link placed inside the label,
     * or when clicking slotted helper or error message element.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetActive(event) {
      if (event.target.localName === 'a' || event.target === this._helperNode || event.target === this._errorNode) {
        return false;
      }

      return super._shouldSetActive(event);
    }

    /**
     * Override method inherited from `CheckedMixin` to reset
     * `indeterminate` state checkbox is toggled by the user.
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

    /**
     * @override
     * @return {boolean}
     */
    checkValidity() {
      return !this.required || !!this.checked;
    }

    /**
     * Override method inherited from `FocusMixin` to validate on blur.
     * @param {boolean} focused
     * @protected
     */
    _setFocused(focused) {
      super._setFocused(focused);

      // Do not validate when focusout is caused by document
      // losing focus, which happens on browser tab switch.
      if (!focused && document.hasFocus()) {
        this.validate();
      }
    }

    /** @private */
    _checkedChanged(checked) {
      if (checked || this.__oldChecked) {
        this.validate();
      }

      this.__oldChecked = checked;
    }

    /**
     * Override an observer from `FieldMixin`
     * to validate when required is removed.
     *
     * @protected
     * @override
     */
    _requiredChanged(required) {
      super._requiredChanged(required);

      if (required === false) {
        this.validate();
      }
    }

    /** @private */
    _onRequiredIndicatorClick() {
      this._labelNode.click();
    }

    /**
     * Fired when the checkbox is checked or unchecked by the user.
     *
     * @event change
     */
  };
