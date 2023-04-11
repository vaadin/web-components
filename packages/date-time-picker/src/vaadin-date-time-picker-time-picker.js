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
