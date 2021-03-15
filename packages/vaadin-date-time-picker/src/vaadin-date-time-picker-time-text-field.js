/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';

/**
 * An element used internally by `<vaadin-date-time-picker>`. Not intended to be used separately.
 *
 * @extends TextFieldElement
 * @private
 */
class DateTimePickerTimeTextFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-date-time-picker-time-text-field';
  }
}

customElements.define(DateTimePickerTimeTextFieldElement.is, DateTimePickerTimeTextFieldElement);
