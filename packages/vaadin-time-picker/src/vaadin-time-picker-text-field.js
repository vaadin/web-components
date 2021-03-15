/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-time-picker-text-field',
  css`
    :host([dir='rtl']) [part='input-field'] {
      direction: ltr;
    }

    :host([dir='rtl']) [part='value']::placeholder {
      direction: rtl;
      text-align: left;
    }

    :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
      direction: rtl;
      text-align: left;
    }
  `,
  { moduleId: 'vaadin-time-picker-text-field-styles' }
);

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @extends TextFieldElement
 * @protected
 */
class TimePickerTextFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-time-picker-text-field';
  }
}

customElements.define(TimePickerTextFieldElement.is, TimePickerTextFieldElement);
