/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DatePicker } from '@vaadin/vaadin-date-picker/src/vaadin-date-picker.js';
import './vaadin-date-time-picker-date-text-field.js';

let memoizedTemplate;

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

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);

      memoizedTemplate.innerHTML = memoizedTemplate.innerHTML.replace(
        'vaadin-date-picker-text-field',
        'vaadin-date-time-picker-date-text-field'
      );
    }
    return memoizedTemplate;
  }
}

customElements.define(DateTimePickerDatePicker.is, DateTimePickerDatePicker);
