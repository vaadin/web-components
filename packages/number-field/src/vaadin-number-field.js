/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, PolymerElement } from '@polymer/polymer';
import { isAndroid, isIPhone } from '@vaadin/component-base/src/browser-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-number-field', inputFieldShared, { moduleId: 'vaadin-number-field-styles' });

const intlOptions = new Intl.NumberFormat().resolvedOptions();
const hasDecimals = intlOptions.maximumFractionDigits > 0;

const isNumUnset = (n) => !n && n !== 0;

/**
 * Handle problematic values when calculating a remainder.
 * Source: Source: https://stackoverflow.com/a/31711034
 */
const floatSafeRemainder = (value, step) => {
  const valDecCount = (value.toString().split('.')[1] || '').length;
  const stepDecCount = (step.toString().split('.')[1] || '').length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(value.toFixed(decCount).replace('.', ''));
  const stepInt = parseInt(step.toFixed(decCount).replace('.', ''));
  return (((valInt % stepInt) + stepInt) % stepInt) / 10 ** decCount;
};

/**
 * `<vaadin-number-field>` is an input field web component that only accepts numeric input.
 *
 * ```html
 * <vaadin-number-field label="Balance"></vaadin-number-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-number-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name         | Description
 * ------------------|-------------------------
 * `increase-button` | Increase ("plus") button
 * `decrease-button` | Decrease ("minus") button
 *
 * Note, the `input-prevented` state attribute is not supported by `<vaadin-number-field>`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes InputFieldMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
export class NumberField extends InputFieldMixin(ThemableMixin(ElementMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-number-field';
  }

  static get template() {
    return html`
      <style>
        :host([readonly]) [part$='button'] {
          pointer-events: none;
        }

        [part='decrease-button']::before {
          content: '−';
        }

        [part='increase-button']::before {
          content: '+';
        }

        [part='decrease-button'],
        [part='increase-button'] {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }

        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }
      </style>

      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[theme]]"
        >
          <div
            disabled$="[[!_allowed(-1, value, min, max, step)]]"
            part="decrease-button"
            on-click="_decreaseValue"
            on-touchend="_decreaseButtonTouchend"
            hidden$="[[!hasControls]]"
            slot="prefix"
          ></div>
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix"></div>
          <div
            disabled$="[[!_allowed(1, value, min, max, step)]]"
            part="increase-button"
            on-click="_increaseValue"
            on-touchend="_increaseButtonTouchend"
            hidden$="[[!hasControls]]"
            slot="suffix"
          ></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * Set to true to display value increase/decrease controls.
       * @attr {boolean} has-controls
       */
      hasControls: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The minimum value of the field.
       */
      min: {
        type: Number,
        observer: '_minChanged'
      },

      /**
       * The maximum value of the field.
       */
      max: {
        type: Number
      },

      /**
       * Specifies the allowed number intervals of the field.
       * @type {number}
       */
      step: {
        type: Number
      }
    };
  }

  static get constraints() {
    return [...super.constraints, 'min', 'max', 'step'];
  }

  constructor() {
    super();
    // TODO: extend text-field
    this._setType('text');
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (this.inputElement) {
      this.__setInputMode(this.inputElement, this.min);
    }
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
      })
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelNode));

    this.inputElement.addEventListener('wheel', (e) => this._onWheel(e));
  }

  /**
   * The `inputmode` attribute influences the software keyboard that is shown on touch devices.
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
   * Browsers and operating systems are quite inconsistent about what keys are available.
   * We choose between numeric and decimal based on whether negative numbers are allowed,
   * and based on testing on various devices to determine what keys are available.
   * @private
   */
  __setInputMode(input, min) {
    const hasNegative = isNaN(min) || min < 0;
    let inputMode = 'numeric';

    if (isIPhone) {
      // iPhone doesn't have a minus sign in either numeric or decimal.
      // Note this is only for iPhone, not iPad, which always has both
      // minus and decimal in numeric.
      if (hasNegative) {
        inputMode = 'text';
      } else if (hasDecimals) {
        inputMode = 'decimal';
      }
    } else if (isAndroid) {
      // Android numeric has both a decimal point and minus key.
      // decimal does not have a minus key.
      if (hasNegative) {
        inputMode = 'numeric';
      } else if (hasDecimals) {
        inputMode = 'decimal';
      }
    }

    input.setAttribute('inputmode', inputMode);
  }

  /** @private */
  _decreaseButtonTouchend(e) {
    // Cancel the following click and focus events
    e.preventDefault();
    this._decreaseValue();
  }

  /** @private */
  _increaseButtonTouchend(e) {
    // Cancel the following click and focus events
    e.preventDefault();
    this._increaseValue();
  }

  /** @private */
  _onWheel(e) {
    // Only handle scroll events when field is focused and can be edited
    if (this.disabled || this.readonly || !this.hasAttribute('focused')) {
      return;
    }

    // On a trackpad, users can scroll in both X and Y directions at once.
    // Check the magnitude and ignore if it's mostly in the X direction.
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) {
      return;
    }

    // Cancel the default behavior
    e.preventDefault();

    if (e.deltaY > 0) {
      this._increaseValue();
    } else if (e.deltaY < 0) {
      this._decreaseValue();
    }
  }

  /**
   * @protected
   * @override
   */
  _constraintsChanged(required, min, max, step) {
    if (!this.invalid) {
      return;
    }

    if (!isNumUnset(min) || !isNumUnset(max) || !isNumUnset(step)) {
      this.validate();
    } else if (!required) {
      this.invalid = false;
    }
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

    let value = parseFloat(this.value);

    if (!this.value) {
      if ((this.min == 0 && incr < 0) || (this.max == 0 && incr > 0) || (this.max == 0 && this.min == 0)) {
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
        } else {
          // FIXME(yuriy): find a proper solution to make correct step back
          if (this._getIncrement(1, value - this.step) > this.max) {
            value -= 2 * this.step;
          } else {
            value -= this.step;
          }
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
    if (!this.value || incr == 0 || this._incrementIsInsideTheLimits(incr, value)) {
      this._setValue(newValue);
    }
  }

  /** @private */
  _setValue(value) {
    this.value = this.inputElement.value = String(parseFloat(value));
    this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
  }

  /** @private */
  _getIncrement(incr, currentValue) {
    let step = this.step || 1,
      min = this.min || 0;

    // To avoid problems with decimal math, multiplying to operate with integers.
    const multiplier = Math.max(this._getMultiplier(currentValue), this._getMultiplier(step), this._getMultiplier(min));

    step *= multiplier;
    currentValue = Math.round(currentValue * multiplier);
    min *= multiplier;

    const margin = (currentValue - min) % step;

    if (incr > 0) {
      return (currentValue - margin + step) / multiplier;
    } else if (incr < 0) {
      return (currentValue - (margin || step)) / multiplier;
    } else {
      return currentValue / multiplier;
    }
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
    } else {
      return this._getIncrement(incr, value) <= this.max && this._getIncrement(incr, value) >= this.min;
    }
  }

  /** @private */
  _allowed(sign) {
    const incr = sign * (this.step || 1);
    const value = parseFloat(this.value);
    return !this.value || (!this.disabled && this._incrementIsInsideTheLimits(incr, value));
  }

  /** @private */
  _minChanged(min) {
    if (this.inputElement) {
      this.__setInputMode(this.inputElement, min);
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
    if (newVal && isNaN(parseFloat(newVal))) {
      this.value = '';
    } else if (typeof this.value !== 'string') {
      this.value = String(this.value);
    }

    super._valueChanged(this.value, oldVal);
  }

  /** @private */
  __isValidByStep(value) {
    if (isNumUnset(this.step) || this.step === 0) {
      return true;
    }

    const stepBasis = isNumUnset(this.min) ? 0 : this.min;

    // Handle problematic fractional values, e.g. 0.9 % 0.3
    return floatSafeRemainder(Number(value) - stepBasis, this.step) == 0;
  }

  /**
   * Override an event listener from `ClearButtonMixin`
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
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    if (
      this.inputElement &&
      (this.required || this.min !== undefined || this.max !== undefined || this.step !== undefined)
    ) {
      if (this.value == null || this.value == '') {
        return super.checkValidity();
      } else {
        // Mimic validation logic provided by native `<input type="number">` as we don't use it.
        return !(this.value > this.max || this.value < this.min || !this.__isValidByStep(this.value));
      }
    } else {
      return !this.invalid;
    }
  }
}

customElements.define(NumberField.is, NumberField);
