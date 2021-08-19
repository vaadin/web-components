/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { NumberField } from '@vaadin/number-field/src/vaadin-number-field.js';

/**
 * `<vaadin-integer-field>` is an input field web component that only accepts entering integer numbers.
 *
 * ```html
 * <vaadin-integer-field label="X"></vaadin-integer-field>
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
 * @extends NumberField
 */
export class IntegerField extends NumberField {
  static get is() {
    return 'vaadin-integer-field';
  }

  static get version() {
    return '22.0.0-alpha1';
  }

  static get properties() {
    return {
      /**
       * A pattern matched against individual characters the user inputs.
       * When set, the field will prevent:
       * - `keyDown` events if the entered key doesn't match `/^_enabledCharPattern$/`
       * - `paste` events if the pasted text doesn't match `/^_enabledCharPattern*$/`
       * - `drop` events if the dropped text doesn't match `/^_enabledCharPattern*$/`
       *
       * For example, to enable entering only numbers and minus signs,
       * `_enabledCharPattern = "[\\d-]"`
       * @protected
       */
      _enabledCharPattern: {
        type: String,
        value: '[-+\\d]',
        observer: '_enabledCharPatternChanged'
      }
    };
  }

  constructor() {
    super();

    this._boundOnPaste = this._onPaste.bind(this);
    this._boundOnDrop = this._onDrop.bind(this);
    this._boundOnBeforeInput = this._onBeforeInput.bind(this);
  }

  /**
   * Override a method from `InputMixin`.
   * @param {!HTMLElement} input
   * @protected
   * @override
   */
  _addInputListeners(input) {
    super._addInputListeners(input);

    input.addEventListener('paste', this._boundOnPaste);
    input.addEventListener('drop', this._boundOnDrop);
    input.addEventListener('beforeinput', this._boundOnBeforeInput);
  }

  /**
   * Override a method from `InputMixin`.
   * @param {!HTMLElement} input
   * @protected
   * @override
   */
  _removeInputListeners(input) {
    super._removeInputListeners(input);

    input.removeEventListener('paste', this._boundOnPaste);
    input.removeEventListener('drop', this._boundOnDrop);
    input.removeEventListener('beforeinput', this._boundOnBeforeInput);
  }

  /**
   * Override an event listener from `ClearButtonMixin`
   * to avoid adding a separate listener.
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyDown(event) {
    if (this._enabledCharPattern && !this.__shouldAcceptKey(event)) {
      event.preventDefault();
    }

    super._onKeyDown(event);
  }

  /** @private */
  __shouldAcceptKey(event) {
    return (
      event.metaKey ||
      event.ctrlKey ||
      !event.key || // allow typing anything if event.key is not supported
      event.key.length !== 1 || // allow "Backspace", "ArrowLeft" etc.
      this.__enabledCharRegExp.test(event.key)
    );
  }

  /** @private */
  _onPaste(e) {
    if (this._enabledCharPattern) {
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      if (!this.__enabledTextRegExp.test(pastedText)) {
        e.preventDefault();
      }
    }
  }

  /** @private */
  _onDrop(e) {
    if (this._enabledCharPattern) {
      const draggedText = e.dataTransfer.getData('text');
      if (!this.__enabledTextRegExp.test(draggedText)) {
        e.preventDefault();
      }
    }
  }

  /** @private */
  _onBeforeInput(e) {
    // The `beforeinput` event covers all the cases for `_enabledCharPattern`: keyboard, pasting and dropping,
    // but it is still experimental technology so we can't rely on it. It's used here just as an additional check,
    // because it seems to be the only way to detect and prevent specific keys on mobile devices.
    // See https://github.com/vaadin/vaadin-text-field/issues/429
    if (this._enabledCharPattern && e.data && !this.__enabledTextRegExp.test(e.data)) {
      e.preventDefault();
    }
  }

  /** @private */
  _enabledCharPatternChanged(charPattern) {
    if (charPattern) {
      this.__enabledCharRegExp = new RegExp('^' + charPattern + '$');
      this.__enabledTextRegExp = new RegExp('^' + charPattern + '*$');
    }
  }

  /**
   * Override an observer from `InputMixin` to clear the value
   * when trying to type invalid characters.
   * @param {string | undefined} newVal
   * @param {string | undefined} oldVal
   * @protected
   * @override
   */
  _valueChanged(newVal, oldVal) {
    if (newVal !== '' && !this.__isInteger(newVal)) {
      console.warn(`Trying to set non-integer value "${newVal}" to <vaadin-integer-field>. Clearing the value.`);
      this.value = '';
      return;
    }
    super._valueChanged(newVal, oldVal);
  }

  /**
   * Override an observer from `NumberField` to reset the step
   * property when an invalid step is set.
   * @param {number} newVal
   * @param {number | undefined} oldVal
   * @protected
   * @override
   */
  _stepChanged(newVal, oldVal) {
    if (!this.__hasOnlyDigits(newVal)) {
      console.warn(
        `Trying to set invalid step size "${newVal}", which is not a positive integer, to <vaadin-integer-field>. Resetting the default value 1.`
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

customElements.define(IntegerField.is, IntegerField);
