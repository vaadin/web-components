/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { DatePicker } from '@vaadin/date-picker/src/vaadin-date-picker.js';

/**
 * An element used internally by `<vaadin-date-time-picker>`. Not intended to be used separately.
 *
 * @extends DatePicker
 * @private
 */
class DateTimePickerDatePicker extends DatePicker {
  static get is() {
    return 'vaadin-date-time-picker-date-picker';
  }
}

customElements.define(DateTimePickerDatePicker.is, DateTimePickerDatePicker);
