/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { NumberField } from '@vaadin/number-field/src/vaadin-lit-number-field.js';

/**
 * LitElement based version of `<vaadin-integer-field>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
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
