/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';

/**
 * The text-field element for time input.
 *
 * ### Styling
 *
 * See [`<vaadin-text-field>` documentation](https://github.com/vaadin/vaadin-text-field/blob/master/src/vaadin-text-field.html)
 * for `<vaadin-date-time-picker-time-text-field>` parts and available slots (prefix, suffix etc.)
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends HTMLElement
 */
class DateTimePickerTimeTextFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-date-time-picker-time-text-field';
  }
}

customElements.define(DateTimePickerTimeTextFieldElement.is, DateTimePickerTimeTextFieldElement);
