/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TimePickerElement } from '@vaadin/vaadin-time-picker/src/vaadin-time-picker.js';
import './vaadin-date-time-picker-time-text-field.js';

let memoizedTemplate;

/**
 * An element used internally by `<vaadin-date-time-picker>`. Not intended to be used separately.
 *
 * @extends TimePickerElement
 * @private
 */
class DateTimePickerTimePickerElement extends TimePickerElement {
  static get is() {
    return 'vaadin-date-time-picker-time-picker';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);

      memoizedTemplate.innerHTML = memoizedTemplate.innerHTML.replace(
        'vaadin-time-picker-text-field',
        'vaadin-date-time-picker-time-text-field'
      );
    }
    return memoizedTemplate;
  }

  _getInputElement() {
    return this.shadowRoot.querySelector('vaadin-date-time-picker-time-text-field');
  }
}

customElements.define(DateTimePickerTimePickerElement.is, DateTimePickerTimePickerElement);
