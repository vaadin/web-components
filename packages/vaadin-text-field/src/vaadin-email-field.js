/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextFieldElement } from './vaadin-text-field.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-email-field',
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
  { moduleId: 'vaadin-email-field-styles' }
);

/**
 * `<vaadin-email-field>` is a Web Component for email field control in forms.
 *
 * ```html
 * <vaadin-email-field label="Email">
 * </vaadin-email-field>
 * ```
 *
 * ### Styling
 *
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends TextFieldElement
 */
class EmailFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-email-field';
  }

  static get version() {
    return '21.0.4';
  }

  /** @protected */
  ready() {
    super.ready();
    this.inputElement.type = 'email';
    this.inputElement.autocapitalize = 'off';
  }

  /** @protected */
  _createConstraintsObserver() {
    // NOTE: pattern needs to be set before constraints observer is initialized
    this.pattern = this.pattern || '^([a-zA-Z0-9_\\.\\-+])+@[a-zA-Z0-9-.]+\\.[a-zA-Z0-9-]{2,}$';

    super._createConstraintsObserver();
  }
}

customElements.define(EmailFieldElement.is, EmailFieldElement);

export { EmailFieldElement };
