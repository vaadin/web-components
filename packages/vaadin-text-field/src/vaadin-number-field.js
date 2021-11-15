/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { TextFieldElement } from './vaadin-text-field.js';

const $_documentContainer = html`<dom-module id="vaadin-number-field-template">
  <template>
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
        -ms-user-select: none;
        user-select: none;
      }

      /* Hide the native arrow icons */
      [part='value']::-webkit-outer-spin-button,
      [part='value']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      [part='value'] {
        /* Older Firefox versions (v47.0) requires !important */
        -moz-appearance: textfield !important;
      }

      :host([dir='rtl']) [part='input-field'] {
        direction: ltr;
      }

      :host([dir='rtl']) [part='value']::placeholder {
        direction: rtl;
      }

      :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
        direction: rtl;
      }

      :host([dir='rtl']:not([has-controls])) [part='value']::placeholder {
        text-align: left;
      }

      :host([dir='rtl']:not([has-controls])) [part='input-field'] ::slotted(input)::placeholder {
        text-align: left;
      }
    </style>

    <div
      disabled$="[[!_allowed(-1, value, min, max, step)]]"
      part="decrease-button"
      on-click="_decreaseValue"
      on-touchend="_decreaseButtonTouchend"
      hidden$="[[!hasControls]]"
    ></div>

    <div
      disabled$="[[!_allowed(1, value, min, max, step)]]"
      part="increase-button"
      on-click="_increaseValue"
      on-touchend="_increaseButtonTouchend"
      hidden$="[[!hasControls]]"
    ></div>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
let memoizedTemplate;

/**
 * `<vaadin-number-field>` is a Web Component for number field control in forms.
 *
 * ```html
 * <vaadin-number-field label="Number">
 * </vaadin-number-field>
 * ```
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends TextFieldElement
 */
class NumberFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-number-field';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * Set to true to display value increase/decrease controls.
       * @attr {boolean} has-controls
       * @type {boolean}
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
        reflectToAttribute: true,
        observer: '_minChanged'
      },

      /**
       * The maximum value of the field.
       */
      max: {
        type: Number,
        reflectToAttribute: true,
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

  /** @protected */
  ready() {
    super.ready();
    this.__previousValidInput = this.value || '';
    this.inputElement.type = 'number';
    this.inputElement.addEventListener('change', this.__onInputChange.bind(this));
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

  static get template() {
    if (!memoizedTemplate) {
      // Clone the superclass template
      memoizedTemplate = super.template.cloneNode(true);

      // Retrieve this element's dom-module template
      const thisTemplate = DomModule.import(this.is + '-template', 'template');
      const decreaseButton = thisTemplate.content.querySelector('[part="decrease-button"]');
      const increaseButton = thisTemplate.content.querySelector('[part="increase-button"]');
      const styles = thisTemplate.content.querySelector('style');

      // Add the buttons and styles to the text-field template
      const inputField = memoizedTemplate.content.querySelector('[part="input-field"]');
      const prefixSlot = memoizedTemplate.content.querySelector('[name="prefix"]');
      inputField.insertBefore(decreaseButton, prefixSlot);
      inputField.appendChild(increaseButton);
      memoizedTemplate.content.appendChild(styles);
    }

    return memoizedTemplate;
  }

  /** @protected */
  _createConstraintsObserver() {
    // NOTE: do not call "super" but instead override the method to add extra arguments
    this._createMethodObserver('_constraintsChanged(required, minlength, maxlength, pattern, min, max, step)');
  }

  /** @private */
  _constraintsChanged(required, minlength, maxlength, pattern, min, max) {
    if (!this.invalid) {
      return;
    }

    const isNumUnset = (n) => !n && n !== 0;

    if (!isNumUnset(min) || !isNumUnset(max)) {
      this.validate();
    } else {
      super._constraintsChanged(required, minlength, maxlength, pattern);
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

  /**
   * @param {number} newVal
   * @param {number | undefined} oldVal
   * @protected
   */
  _stepChanged(newVal) {
    // Avoid using initial value in validation
    this.__validateByStep = this.__stepChangedCalled || this.getAttribute('step') !== null;
    this.inputElement.step = this.__validateByStep ? newVal : 'any';

    this.__stepChangedCalled = true;
    this.setAttribute('step', newVal);
  }

  /** @private */
  _minChanged(min) {
    this.inputElement.min = min;
  }

  /** @private */
  _maxChanged(max) {
    this.inputElement.max = max;
  }

  /**
   * @param {unknown} newVal
   * @param {unknown} oldVal
   * @protected
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
   * @param {!KeyboardEvent} e
   * @protected
   */
  _onKeyDown(e) {
    if (e.keyCode == 38) {
      e.preventDefault();
      this._increaseValue();
    } else if (e.keyCode == 40) {
      e.preventDefault();
      this._decreaseValue();
    }
    super._onKeyDown(e);
  }

  /** @private */
  __onInputChange() {
    this.validate();
  }

  /**
   * @return {boolean}
   */
  checkValidity() {
    // text-field mixin does not check against `min`, `max` and `step`
    if (this.min !== undefined || this.max !== undefined || this.__validateByStep) {
      return this.inputElement.checkValidity();
    }

    return super.checkValidity();
  }
}

window.customElements.define(NumberFieldElement.is, NumberFieldElement);

export { NumberFieldElement };
