/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
