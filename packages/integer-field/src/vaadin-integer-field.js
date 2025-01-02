/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
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
 * `<vaadin-integer-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name         | Description
 * ------------------|-------------------------
 * `increase-button` | Increase ("plus") button
 * `decrease-button` | Decrease ("minus") button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Change events
 *
 * Depending on the nature of the value change that the user attempts to commit e.g. by pressing Enter,
 * the component can fire either a `change` event or an `unparsable-change` event:
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
 * Note, there is currently no way to detect unparsable => unparsable changes because the browser
 * doesn't provide access to unparsable values of native [type=number] inputs.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} unparsable-change - Fired when the user commits an unparsable value change and there is no change event.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends NumberField
 */
export class IntegerField extends NumberField {
  static get is() {
    return 'vaadin-integer-field';
  }

  constructor() {
    super();

    this.allowedCharPattern = '[-+\\d]';
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
   * @param {HTMLElement | undefined} inputElement
   * @protected
   * @override
   */
  _stepChanged(step, inputElement) {
    if (step != null && !this.__hasOnlyDigits(step)) {
      console.warn(
        `<vaadin-integer-field> The \`step\` property must be a positive integer but \`${step}\` was provided, so the property was reset to \`null\`.`,
      );
      this.step = null;
      return;
    }

    super._stepChanged(step, inputElement);
  }

  /** @private */
  __isInteger(value) {
    return /^(-\d)?\d*$/u.test(String(value));
  }

  /** @private */
  __hasOnlyDigits(value) {
    return /^\d+$/u.test(String(value));
  }
}

defineCustomElement(IntegerField);
