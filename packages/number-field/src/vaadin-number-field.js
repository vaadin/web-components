/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import '@vaadin/input-container/src/vaadin-input-container.js';
import '@vaadin/text-field/src/vaadin-input-field-shared-styles.js';

/**
 * `<vaadin-number-field>` is an input field web component that only accepts numeric input.
 *
 * ```html
 * <vaadin-number-field label="Balance"></vaadin-number-field>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `label`         | The label element wrapper
 * `input-field`   | The element that wraps prefix, textarea and suffix
 * `error-message` | The error message element wrapper
 * `helper-text`   | The helper text element wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|----------
 * `disabled`          | Set when the element is disabled          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `focus-ring`        | Set when the element is keyboard focused  | :host
 * `readonly`          | Set when the element is readonly          | :host
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
 * @mixes InputSlotMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
export class NumberField extends InputFieldMixin(InputSlotMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-number-field';
  }

  static get template() {
    return html`
      <style include="vaadin-input-field-shared-styles">
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

        /* TODO: provide alternatives for Safari */
        :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
          direction: rtl;
        }

        :host([dir='rtl']:not([has-controls])) [part='input-field'] ::slotted(input)::placeholder {
          text-align: left;
        }
      </style>

      <div part="container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="indicator" aria-hidden="true"></span>
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
        type: Number,
        observer: '_maxChanged'
      },

      /**
       * Specifies the allowed number intervals of the field.
       * @type {number}
       */
      step: {
        type: Number,
        value: 1,
        observer: '_stepChanged'
      }
    };
  }

  static get constraints() {
    return [...super.constraints, 'min', 'max', 'step'];
  }

  constructor() {
    super();
    this._setType('number');
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
      this.inputElement.min = this.min;
      this.inputElement.max = this.max;
      this.__applyStep(this.step);
    }
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

  /**
   * @protected
   * @override
   */
  _constraintsChanged(required, min, max, _step) {
    if (!this.invalid) {
      return;
    }

    const isNumUnset = (n) => !n && n !== 0;
    if (!isNumUnset(min) || !isNumUnset(max)) {
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
      return Math.pow(10, this._getDecimalCount(number));
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
  __applyStep(step) {
    if (this.inputElement) {
      this.inputElement.step = this.__validateByStep ? step : 'any';
    }
  }

  /**
   * @param {number} newVal
   * @param {number | undefined} oldVal
   * @protected
   */
  _stepChanged(newVal) {
    // TODO: refactor to not have initial value
    // https://github.com/vaadin/vaadin-text-field/issues/435

    // Avoid using initial value in validation
    this.__validateByStep = this.__stepChangedCalled || this.getAttribute('step') !== null;

    this.__applyStep(newVal);

    this.__stepChangedCalled = true;
    this.setAttribute('step', newVal);
  }

  /** @private */
  _minChanged(min) {
    if (this.inputElement) {
      this.inputElement.min = min;
    }
  }

  /** @private */
  _maxChanged(max) {
    if (this.inputElement) {
      this.inputElement.max = max;
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
   * Override an event listener inherited from `InputMixin`.
   * @param {Event} _event
   * @protected
   * @override
   */
  _onChange(_event) {
    this.validate();
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    if (
      this.inputElement &&
      (this.required || this.min !== undefined || this.max !== undefined || this.__validateByStep)
    ) {
      return this.inputElement.checkValidity();
    } else {
      return !this.invalid;
    }
  }
}

customElements.define(NumberField.is, NumberField);
