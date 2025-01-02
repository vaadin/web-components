/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { emailFieldStyles } from './vaadin-email-field-styles.js';

registerStyles('vaadin-email-field', emailFieldStyles, { moduleId: 'vaadin-email-field-styles' });

/**
 * `<vaadin-email-field>` is a Web Component for email field control in forms.
 *
 * ```html
 * <vaadin-email-field label="Email"></vaadin-email-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-email-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends TextField
 */
export class EmailField extends TextField {
  static get is() {
    return 'vaadin-email-field';
  }

  constructor() {
    super();
    this._setType('email');
    this.pattern = '^[a-zA-Z0-9_\\-+]+(?:\\.[a-zA-Z0-9_\\-+]+)*@[a-zA-Z0-9\\-.]+\\.[a-zA-Z0-9\\-]{2,}$';
  }

  /** @protected */
  ready() {
    super.ready();

    if (this.inputElement) {
      this.inputElement.autocapitalize = 'off';
    }
  }
}

defineCustomElement(EmailField);
