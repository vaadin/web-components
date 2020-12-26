/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CustomFieldElement } from '@vaadin/vaadin-custom-field/src/vaadin-custom-field.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-date-time-picker-custom-field',
  css`
    :host,
    .container {
      width: 100%;
    }
  `,
  { moduleId: 'vaadin-date-time-picker-custom-field' }
);

/**
 * The custom-field element.
 *
 * ### Styling
 *
 * See [`<vaadin-custom-field>` documentation](https://github.com/vaadin/vaadin-custom-field/blob/master/src/vaadin-custom-field.html)
 * for `<vaadin-date-time-picker-custom-field>` parts and available slots (prefix, suffix etc.)
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends HTMLElement
 */
class DateTimePickerCustomFieldElement extends CustomFieldElement {
  static get is() {
    return 'vaadin-date-time-picker-custom-field';
  }

  connectedCallback() {
    this.__toggleHasValue = function (value) {
      if (value !== null && value !== '' && value.split('T').indexOf('') === -1) {
        this.setAttribute('has-value', '');
      } else {
        this.removeAttribute('has-value');
      }
    };

    super.connectedCallback();
  }

  validate() {
    return;
  }
}

customElements.define(DateTimePickerCustomFieldElement.is, DateTimePickerCustomFieldElement);
