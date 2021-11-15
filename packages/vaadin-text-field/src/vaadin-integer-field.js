/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { NumberFieldElement } from './vaadin-number-field.js';

/**
 * `<vaadin-integer-field>` is a Web Component for integer field control in forms.
 *
 * ```html
 * <vaadin-integer-field label="Number">
 * </vaadin-integer-field>
 * ```
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends NumberFieldElement
 */
class IntegerFieldElement extends NumberFieldElement {
  static get is() {
    return 'vaadin-integer-field';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    // Hide inherited props that don't work with <input type="number"> from JSDoc.
    return {
      /** @private */
      pattern: String,

      /** @private */
      preventInvalidInput: Boolean,

      /** @private */
      minlength: Number,

      /** @private */
      maxlength: Number
    };
  }

  /** @protected */
  ready() {
    super.ready();
    this._enabledCharPattern = '[-+\\d]';
  }

  /**
   * @param {unknown} newVal
   * @param {unknown} oldVal
   * @protected
   */
  _valueChanged(newVal, oldVal) {
    if (newVal !== '' && !this.__isInteger(newVal)) {
      console.warn(`Trying to set non-integer value "${newVal}" to <vaadin-integer-field>.` + ` Clearing the value.`);
      this.value = '';
      return;
    }
    super._valueChanged(newVal, oldVal);
  }

  /**
   * @param {number} newVal
   * @param {number | undefined} oldVal
   * @protected
   */
  _stepChanged(newVal, oldVal) {
    if (!this.__hasOnlyDigits(newVal)) {
      console.warn(
        `Trying to set invalid step size "${newVal}",` +
          ` which is not a positive integer, to <vaadin-integer-field>.` +
          ` Resetting the default value 1.`
      );
      this.step = 1;
      return;
    }
    super._stepChanged(newVal, oldVal);
  }

  /** @private */
  __isInteger(value) {
    return /^(-\d)?\d*$/.test(String(value));
  }

  /** @private */
  __hasOnlyDigits(value) {
    return /^\d*$/.test(String(value));
  }
}

window.customElements.define(IntegerFieldElement.is, IntegerFieldElement);

export { IntegerFieldElement };
