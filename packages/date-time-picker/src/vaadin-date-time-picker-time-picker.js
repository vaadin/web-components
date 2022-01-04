/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TimePicker } from '@vaadin/time-picker/src/vaadin-time-picker.js';

/**
 * An element used internally by `<vaadin-date-time-picker>`. Not intended to be used separately.
 *
 * @extends TimePicker
 * @private
 */
class DateTimePickerTimePicker extends TimePicker {
  static get is() {
    return 'vaadin-date-time-picker-time-picker';
  }
}

customElements.define(DateTimePickerTimePicker.is, DateTimePickerTimePicker);
