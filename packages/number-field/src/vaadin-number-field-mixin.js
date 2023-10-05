/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { NumberParser } from '@internationalized/number';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';

/**
 * A mixin providing common number field functionality.
 *
 * @polymerMixin
 * @mixes InputFieldMixin
 */
export const NumberFieldMixin = (superClass) =>
  class NumberFieldMixinClass extends InputFieldMixin(superClass) {
    static get properties() {
      return {
        /**
         * The minimum value of the field.
         */
        min: {
          type: Number,
        },

        /**
         * The maximum value of the field.
         */
        max: {
          type: Number,
        },

        /**
         * Specifies the allowed number intervals of the field.
         * @type {number}
         */
        step: {
          type: Number,
        },

        /**
         * Set to true to show increase/decrease buttons.
         * @attr {boolean} step-buttons-visible
         */
        stepButtonsVisible: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max', 'step'];
    }

    constructor() {
      super();

      this.__onWheel = this.__onWheel.bind(this);

      this._lastCommittedValue = '';

      this._validity = {
        badInput: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        valueMissing: false,
        valid: true,
      };
    }

    /** @protected */
    get numberParser() {
      if (!this._numberParser) {
        this._numberParser = new NumberParser(navigator.language, {});
      }
      return this._numberParser;
    }

    /** @protected */
    get slotStyles() {
      const tag = this.localName;
      return [
        `
          ${tag} input[type="number"]::-webkit-outer-spin-button,
          ${tag} input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          ${tag} input[type="number"] {
            -moz-appearance: textfield;
          }

          ${tag}[dir='rtl'] input[type="number"]::placeholder {
            direction: rtl;
          }

          ${tag}[dir='rtl']:not([step-buttons-visible]) input[type="number"]::placeholder {
            text-align: left;
          }
        `,
      ];
    }

    /**
     * Used by `InputControlMixin` as a reference to the clear button element.
     * @protected
     */
    get clearElement() {
      return this.$.clearButton;
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

    /**
     * Override the method from `InputConstraintsMixin`
     * to enforce HTML constraint validation even if
     * the user didn't add any constraints explicitly:
     * the field has to be regardless checked for bad input.
     *
     * @override
     */
    checkValidity() {
      if (this.inputElement) {
        return this._checkInputValidity();
      }

      return !this.invalid;
    }

    /**
     * Override the method from `ClearButtonMixin`
     * to set last committed value to old value.
     *
     * @override
     */
    _onClearAction() {
      this._lastCommittedValue = this.value;

      // Do not forward clearing the input value
      // because it's done by the clear() method.
      this.__skipForwarding = true;
      super._onClearAction();
      this.__skipForwarding = false;
    }

    /**
     * Override the method from `InputMixin` to add
     * a wheel event listener to the input element.
     *
     * @param {HTMLElement} input
     * @override
     * @protected
     */
    _addInputListeners(input) {
      super._addInputListeners(input);
      input.addEventListener('wheel', this.__onWheel);
    }

    /**
     * Override the method from `InputMixin` to remove
     * the wheel event listener from the input element.
     *
     * @param {HTMLElement} input
     * @override
     * @protected
     */
    _removeInputListeners(input) {
      super._removeInputListeners(input);
      input.removeEventListener('wheel', this.__onWheel);
    }

    /** @private */
    _checkInputValidity() {
      const inputValue = this._inputElementValue;
      const isEmpty = inputValue == null || inputValue === '';

      const value = this.numberParser.parse(inputValue);

      // Set to `true` if the value can not be parsed.
      const badInput = !isEmpty && isNaN(value);

      // Set to `true` if the value is less than `min` property.
      const rangeUnderflow = typeof this.min !== 'undefined' ? value < this.min : false;

      // Set to `true` if the value is bigger than `min` property.
      const rangeOverflow = typeof this.max !== 'undefined' ? value > this.max : false;

      // Set to `true` if the value does not match the `step`.
      let stepMismatch = false;
      if (this.step) {
        const min = typeof this.min !== 'undefined' ? this.min : 0;
        const remainder = (value - min) % this.step;
        stepMismatch = remainder !== 0;
      }

      const valueMissing = this.required ? isEmpty : false;

      const valid = !(valueMissing || badInput || rangeUnderflow || rangeOverflow || stepMismatch);

      this._validity = {
        badInput,
        rangeOverflow,
        rangeUnderflow,
        stepMismatch,
        valueMissing,
        valid,
      };

      return valid;
    }

    /**
     * Prevents default browser behavior for wheel events on the input element
     * when it's focused. More precisely, this prevents the browser from attempting
     * to increment or decrement the value when the mouse wheel is used within
     * the input element.
     *
     * CAVEAT: As a side-effect, this also prevents page scrolling when
     * the pointer is positioned over the field and the field is focused.
     *
     * @param {WheelEvent} event
     * @private
     */
    __onWheel(event) {
      if (this.hasAttribute('focused')) {
        event.preventDefault();
      }
    }

    /** @protected */
    _onDecreaseButtonTouchend(e) {
      // Cancel the following click and focus events
      e.preventDefault();
      this._decreaseValue();
    }

    /** @protected */
    _onIncreaseButtonTouchend(e) {
      // Cancel the following click and focus events
      e.preventDefault();
      this._increaseValue();
    }

    /** @protected */
    _onDecreaseButtonClick() {
      this._decreaseValue();
    }

    /** @protected */
    _onIncreaseButtonClick() {
      this._increaseValue();
    }

    /** @private */
    _decreaseValue() {
      this._incrementValue(-1);
    }

    /** @private */
    _increaseValue() {
      this._incrementValue(1);
    }

    /** @private */
    _incrementValue(incr) {
      if (this.disabled || this.readonly) {
        return;
      }

      const step = this.step || 1;
      let value = parseFloat(this.value);

      if (!this.value) {
        if ((this.min === 0 && incr < 0) || (this.max === 0 && incr > 0) || (this.max === 0 && this.min === 0)) {
          incr = 0;
          value = 0;
        } else if ((this.max == null || this.max >= 0) && (this.min == null || this.min <= 0)) {
          value = 0;
        } else if (this.min > 0) {
          value = this.min;
          if (this.max < 0 && incr < 0) {
            value = this.max;
          }
          incr = 0;
        } else if (this.max < 0) {
          value = this.max;
          if (incr < 0) {
            incr = 0;
          } else if (this._getIncrement(1, value - step) > this.max) {
            value -= 2 * step;
            // FIXME(yuriy): find a proper solution to make correct step back
          } else {
            value -= step;
          }
        }
      } else if (value < this.min) {
        incr = 0;
        value = this.min;
      } else if (value > this.max) {
        incr = 0;
        value = this.max;
      }

      const newValue = this._getIncrement(incr, value);
      if (!this.value || incr === 0 || this._incrementIsInsideTheLimits(incr, value)) {
        this._setValue(newValue);
      }
    }

    /** @private */
    _setValue(value) {
      this.value = this.inputElement.value = String(parseFloat(value));
      this._lastCommittedValue = this.value;
      this.validate();
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    /** @private */
    _getIncrement(incr, currentValue) {
      let step = this.step || 1,
        min = this.min || 0;

      // To avoid problems with decimal math, multiplying to operate with integers.
      const multiplier = Math.max(
        this._getMultiplier(currentValue),
        this._getMultiplier(step),
        this._getMultiplier(min),
      );

      step *= multiplier;
      currentValue = Math.round(currentValue * multiplier);
      min *= multiplier;

      const margin = (currentValue - min) % step;

      if (incr > 0) {
        return (currentValue - margin + step) / multiplier;
      } else if (incr < 0) {
        return (currentValue - (margin || step)) / multiplier;
      }
      return currentValue / multiplier;
    }

    /** @private */
    _getDecimalCount(number) {
      const s = String(number);
      const i = s.indexOf('.');
      return i === -1 ? 1 : s.length - i - 1;
    }

    /** @private */
    _getMultiplier(number) {
      if (!isNaN(number)) {
        return 10 ** this._getDecimalCount(number);
      }
    }

    /** @private */
    _incrementIsInsideTheLimits(incr, value) {
      if (incr < 0) {
        return this.min == null || this._getIncrement(incr, value) >= this.min;
      } else if (incr > 0) {
        return this.max == null || this._getIncrement(incr, value) <= this.max;
      }
      return this._getIncrement(incr, value) <= this.max && this._getIncrement(incr, value) >= this.min;
    }

    /** @protected */
    _isButtonEnabled(sign) {
      const incr = sign * (this.step || 1);
      const value = parseFloat(this.value);
      return !this.value || (!this.disabled && this._incrementIsInsideTheLimits(incr, value));
    }

    /**
     * @param {unknown} newVal
     * @param {unknown} oldVal
     * @protected
     * @override
     */
    _valueChanged(newVal, oldVal) {
      // Validate value to be numeric
      if (newVal && isNaN(parseFloat(newVal))) {
        this.value = '';
      } else if (typeof this.value !== 'string') {
        this.value = String(this.value);
      }

      super._valueChanged(this.value, oldVal);
    }

    /**
     * Override method from `InputMixin`
     * @param {string} value
     * @protected
     * @override
     */
    _forwardInputValue(value) {
      // When the `<input>` value can not be parsed, set the `value`
      // property to empty string, but keep the input value as is.
      if (this.__skipForwarding) {
        return;
      }

      this._lastCommittedValue = value;

      super._forwardInputValue(value);
    }

    /**
     * @param {Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      // Update internal validity state on each input event.
      this._checkInputValidity();

      // Native [type=number] inputs don't update their value
      // when entering input that the browser is unable to parse.
      // Mimic this behavior to ensure `value` does not contain
      // unparsable input committed e.g. a single `-` character.
      if (!this._validity.badInput) {
        super._onInput(event);
      } else {
        // Set value to empty string in case of unparsable input.
        this.__skipForwarding = true;
        this.value = '';
        this.__skipForwarding = false;
      }
    }

    /**
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      event.stopPropagation();

      const { badInput } = this._validity;

      // Fire change event in the following cases:
      // 1. Valid value -> unparsable input value,
      // 2. Valid value -> another valid value.
      if ((badInput && this._lastCommittedValue !== '') || (!badInput && this.value !== this._lastCommittedValue)) {
        super._onChange(event);
        this._lastCommittedValue = this.value;
        return;
      }

      // Only validate if the `<input>` has focus, which
      // is the case when pressing Enter to commit value.
      if (isElementFocused(this.inputElement)) {
        this.validate();
      }
    }

    /**
     * Override an event listener from `InputControlMixin`
     * to avoid adding a separate listener.
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this._increaseValue();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this._decreaseValue();
      }

      super._onKeyDown(event);
    }
  };
