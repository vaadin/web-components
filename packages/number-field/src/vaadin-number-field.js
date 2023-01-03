/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, PolymerElement } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-number-field', inputFieldShared, { moduleId: 'vaadin-number-field-styles' });

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
 * Note, the `input-prevented` state attribute is only supported when `allowedCharPattern` is set.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @extends HTMLElement
 * @mixes InputFieldMixin
 * @mixes SlotStylesMixin
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
          theme$="[[_theme]]"
        >
          <div
            disabled$="[[!_allowed(-1, value, min, max, step)]]"
            part="decrease-button"
            on-click="_decreaseValue"
            on-touchend="_decreaseButtonTouchend"
            hidden$="[[!_isStepButtonVisible(hasControls, stepButtonsVisible)]]"
            aria-hidden="true"
            slot="prefix"
          ></div>
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
          <div
            disabled$="[[!_allowed(1, value, min, max, step)]]"
            part="increase-button"
            on-click="_increaseValue"
            on-touchend="_increaseButtonTouchend"
            hidden$="[[!_isStepButtonVisible(hasControls, stepButtonsVisible)]]"
            aria-hidden="true"
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

      <slot name="tooltip"></slot>
    `;
  }

  static get properties() {
    return {
      /**
       * Set to true to display value increase/decrease controls.
       * @attr {boolean} has-controls
       * @deprecated since 23.3.
       * Use [`stepButtonsVisible`](#/elements/vaadin-number-field#property-stepButtonsVisible) instead
       */
      hasControls: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
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
    };
  }

  static get observers() {
    return ['_stepChanged(step, inputElement)'];
  }

  static get delegateProps() {
    return [...super.delegateProps, 'min', 'max'];
  }

  static get constraints() {
    return [...super.constraints, 'min', 'max', 'step'];
  }

  constructor() {
    super();
    this._setType('number');
  }

  /** @protected */
  get slotStyles() {
    const tag = this.localName;
    return [
      ...super.slotStyles,
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

        ${tag}[dir='rtl']:not([step-buttons-visible]):not([has-controls]) input[type="number"]::placeholder {
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

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
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
      return this.inputElement.checkValidity();
    }

    return !this.invalid;
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

  /** @private */
  _allowed(sign) {
    const incr = sign * (this.step || 1);
    const value = parseFloat(this.value);
    return !this.value || (!this.disabled && this._incrementIsInsideTheLimits(incr, value));
  }

  /**
   * @param {number} step
   * @param {HTMLElement | undefined} inputElement
   * @protected
   */
  _stepChanged(step, inputElement) {
    if (inputElement) {
      inputElement.step = step || 'any';
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
   * Determines whether to hide the increase / decrease buttons based on the
   * deprecated `hasControls` property, and the replacement `stepButtonsVisible`
   * property
   * @private
   */
  _isStepButtonVisible(hasControls, stepButtonsVisible) {
    return hasControls || stepButtonsVisible;
  }

  /**
   * Native [type=number] inputs don't update their value
   * when you are entering input that the browser is unable to parse
   * e.g. "--5", hence we have to override this method from `InputMixin`
   * so that, when value is empty, it would additionally check
   * for bad input based on the native `validity.badInput` property.
   *
   * @param {InputEvent} event
   * @protected
   * @override
   */
  _setHasInputValue(event) {
    const target = event.composedPath()[0];
    this._hasInputValue = target.value.length > 0 || target.validity.badInput;
  }
}

customElements.define(NumberField.is, NumberField);
