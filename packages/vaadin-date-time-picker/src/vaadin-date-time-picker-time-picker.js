/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TimePickerElement } from '@vaadin/vaadin-time-picker/src/vaadin-time-picker.js';
import './vaadin-date-time-picker-time-text-field.js';

let memoizedTemplate;

/**
 * The time-picker element.
 *
 * ### Styling
 *
 * See [`<vaadin-time-picker>` documentation](https://github.com/vaadin/vaadin-time-picker/blob/master/src/vaadin-time-picker.html)
 * for `<vaadin-date-time-picker-time-picker>` parts and available slots (prefix, suffix etc.)
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends HTMLElement
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
