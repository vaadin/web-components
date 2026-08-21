/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { parseNumber } from './number-utils.js';

/**
 * A mixin providing common number field functionality.
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

    static get observers() {
      return ['_stepChanged(step)'];
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max', 'step'];
    }

    constructor() {
      super();
      this._setType('text');
    }

    /** @protected */
    get slotStyles() {
      const tag = this.localName;
      return [
        `
          ${tag}[dir='rtl'] input[slot="input"]::placeholder {
            direction: rtl;
          }

          ${tag}[dir='rtl']:not([step-buttons-visible]) input[slot="input"]::placeholder {
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

    /**
     * Whether the input element's value is unparsable.
     *
     * @private
     */
    get __hasUnparsableValue() {
      return !!this._inputElementValue && !this._hasValue;
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

      this._tooltipController = new TooltipController(this);
      this.addController(this._tooltipController);
      this._tooltipController.setPosition('top');
      this._tooltipController.setAriaTarget(this.inputElement);
    }

    /**
     * Override the method from `InputConstraintsMixin`
     * to compute the constraint validation verdict in JavaScript
     * instead of delegating to the native input, and to run it even
     * if the user didn't add any constraints explicitly:
     * the field has to be regardless checked for bad input.
     *
     * @override
     */
    checkValidity() {
      if (this.inputElement) {
        return this.__validity.valid;
      }

      return !this.invalid;
    }

    /**
     * A `ValidityState`-like object computed from the field's constraints.
     * Kept as an object rather than inline booleans so that the native
     * parity tests can compare it field by field against a native
     * `[type=number]` input.
     *
     * @private
     */
    get __validity() {
      const badInput = this.__hasUnparsableValue;
      // Native reports both flags for unparsable text in a required field,
      // since the input value getter returns an empty string for it — so
      // valueMissing deliberately does not exclude badInput.
      const valueMissing = !!this.required && !this._hasValue;
      // The only place where the canonical value string becomes a Number:
      // comparisons against min / max / step legitimately need one.
      const num = this._hasValue ? Number(this.value) : null;
      const rangeUnderflow = num !== null && this.min != null && num < this.min;
      const rangeOverflow = num !== null && this.max != null && num > this.max;
      // Step is optional: no step means no mismatch, and a non-positive
      // step is not applied as a constraint.
      const stepMismatch = num !== null && this.step > 0 && this.__hasStepMismatch(num);
      return {
        badInput,
        valueMissing,
        rangeUnderflow,
        rangeOverflow,
        stepMismatch,
        valid: !(badInput || valueMissing || rangeUnderflow || rangeOverflow || stepMismatch),
      };
    }

    /** @protected */
    _onDecreaseButtonTouchend(e) {
      // Cancel the following click and focus events. If the event is not cancelable,
      // it means scrolling is in progress, therefore we shouldn't update field value.
      if (e.cancelable) {
        e.preventDefault();
        this.__blurActiveElement();
        this._decreaseValue();
      }
    }

    /** @protected */
    _onIncreaseButtonTouchend(e) {
      // Cancel the following click and focus events. If the event is not cancelable,
      // it means scrolling is in progress, therefore we shouldn't update field value.
      if (e.cancelable) {
        e.preventDefault();
        this.__blurActiveElement();
        this._increaseValue();
      }
    }

    /** @private */
    __blurActiveElement() {
      // If another element is focused, blur it on step button touch to hide
      // the mobile keyboard that might still be open for the other element.
      // See https://github.com/vaadin/web-components/issues/7494
      const activeElement = getDeepActiveElement();
      if (activeElement && activeElement !== this.inputElement) {
        activeElement.blur();
      }
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
        this.inputElement.value = String(parseFloat(newValue));
        this.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.__commitValueChange();
      }
    }

    /** @private */
    __getStepContext(value) {
      let step = this.step || 1,
        min = this.min || 0;

      // To avoid problems with decimal math, multiplying to operate with integers.
      const multiplier = Math.max(this._getMultiplier(value), this._getMultiplier(step), this._getMultiplier(min));

      // Rounding removes the float error from the scaled terms, e.g.
      // 0.07 * 100 === 7.000000000000001. The fallback covers terms in
      // exponential notation (e.g. step="1e-7"), whose decimal count is
      // misread so the product rounds to 0 and the margin would be NaN.
      step = Math.round(step * multiplier) || step * multiplier;
      min = Math.round(min * multiplier) || min * multiplier;
      value = Math.round(value * multiplier);

      return {
        value,
        min,
        step,
        multiplier,
        margin: (value - min) % step,
      };
    }

    /**
     * Whether the given value does not match the step constraint.
     * Must share the decimal-safe scaled math with the step buttons
     * through `__getStepContext` — re-deriving it from the multiplier
     * helpers would let the two verdicts drift apart.
     *
     * @param {number} value
     * @return {boolean}
     * @private
     */
    __hasStepMismatch(value) {
      return this.__getStepContext(value).margin !== 0;
    }

    /** @private */
    _getIncrement(incr, currentValue) {
      const { value, step, multiplier, margin } = this.__getStepContext(currentValue);

      if (incr > 0) {
        return (value - margin + step) / multiplier;
      } else if (incr < 0) {
        return (value - (margin || step)) / multiplier;
      }
      return value / multiplier;
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
     * @param {number} step
     * @protected
     */
    _stepChanged(step) {
      if (step != null && step <= 0) {
        issueWarning(
          `<${this.localName}> The \`step\` property must be a positive number but \`${step}\` was provided, so it was ignored.`,
        );
      }
    }

    /**
     * @param {unknown} newVal
     * @param {unknown} oldVal
     * @protected
     * @override
     */
    _valueChanged(newVal, oldVal) {
      // Validate value to be numeric
      if (newVal && parseNumber(String(newVal)) === null) {
        issueWarning(`Trying to set non-numeric value "${newVal}" to <${this.localName}>. Clearing the value.`);
        this.value = '';
      } else if (typeof this.value !== 'string') {
        this.value = String(this.value);
      }

      super._valueChanged(this.value, oldVal);

      if (!this.__keepCommittedValue) {
        this.__committedValue = this.value;
        this.__committedUnparsableValueStatus = false;
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

    /**
     * Override this method from `InputMixin` to parse the input element
     * text before assigning it to the value property, and to prevent
     * the value change caused by user input from being treated
     * as initiated programmatically by the developer and therefore
     * from getting silently committed by the value observer without
     * any change event. The value change will be committed later
     * on blur or Enter.
     *
     * @param {InputEvent} event
     * @override
     * @protected
     */
    _onInput(event) {
      const raw = event.composedPath()[0].value;
      // Parse trusted input only: synthetic input event text (step buttons,
      // clear button) is already canonical. Assigning raw text and letting
      // the value observer clear it would leak unparsable text into `value`
      // for a moment, firing value-changed events for the round-trip.
      const parsed = event.isTrusted ? parseNumber(raw) : raw;
      this.__keepCommittedValue = true;
      this.__userInput = event.isTrusted;
      this.value = parsed == null ? '' : parsed;
      this.__userInput = false;
      this.__keepCommittedValue = false;

      // Re-validate on the unparsable -> unparsable path, where `value`
      // stays an empty string and the value observer never runs.
      if (this.invalid) {
        this._requestValidation();
      }
    }

    /**
     * Override this method from `InputControlMixin`
     * to stop propagation of the native change event.
     *
     * @param {Event} event
     * @override
     * @protected
     */
    _onChange(event) {
      event.stopPropagation();
    }

    /**
     * Override this method from `ClearButtonMixin`
     * to properly commit the empty value since
     * the change handler doesn't do that anymore.
     *
     * @param {MouseEvent} event
     * @override
     * @protected
     */
    _onClearAction(event) {
      super._onClearAction(event);
      this.__commitValueChange();
    }

    /**
     * Override this method from `FocusMixin`
     * to commit a possible pending value change on blur.
     *
     * @param {boolean} focused
     * @override
     * @protected
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused) {
        this.__commitValueChange();
      }
    }

    /**
     * Override this method from `KeyboardMixin`
     * to commit a possible pending value change on Enter.
     *
     * @param {KeyboardEvent} event
     * @override
     * @protected
     */
    _onEnter(event) {
      super._onEnter(event);
      this.__commitValueChange();
    }

    /**
     * Depending on the nature of the value change that has occurred since
     * the last commit attempt, triggers validation and fires an event:
     *
     * Value change             | Event
     * :------------------------|:------------------
     * empty => parsable        | change
     * empty => unparsable      | unparsable-change
     * parsable => empty        | change
     * parsable => parsable     | change
     * parsable => unparsable   | change
     * unparsable => empty      | unparsable-change
     * unparsable => parsable   | change
     * unparsable => unparsable | -
     *
     * Note, there is currently no way to detect unparsable => unparsable changes
     * because the browser doesn't provide access to unparsable values of native
     * [type=number] inputs.
     *
     * @private
     */
    __commitValueChange() {
      if (this.__committedValue !== this.value) {
        this._requestValidation();
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      } else if (this.__committedUnparsableValueStatus !== this.__hasUnparsableValue) {
        this._requestValidation();
        this.dispatchEvent(new CustomEvent('unparsable-change'));
      }

      this.__committedValue = this.value;
      this.__committedUnparsableValueStatus = this.__hasUnparsableValue;
    }
  };
