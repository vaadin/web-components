/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DatePickerElement } from '@vaadin/vaadin-date-picker/src/vaadin-date-picker.js';
import './vaadin-date-time-picker-date-text-field.js';

let memoizedTemplate;

/**
 * The date-picker element.
 *
 * ### Styling
 *
 * See [`<vaadin-date-picker>` documentation](https://github.com/vaadin/vaadin-date-picker/blob/master/src/vaadin-date-picker.html)
 * for `<vaadin-date-time-picker-date-picker>` parts and available slots (prefix, suffix etc.)
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends HTMLElement
 */
class DateTimePickerDatePickerElement extends DatePickerElement {
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

customElements.define(DateTimePickerDatePickerElement.is, DateTimePickerDatePickerElement);
