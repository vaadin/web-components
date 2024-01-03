/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-password-field-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { PasswordFieldMixin } from './vaadin-password-field-mixin.js';

const ownTemplate = html`
  <div part="reveal-button" slot="suffix">
    <slot name="reveal"></slot>
  </div>
`;

let memoizedTemplate;

/**
 * `<vaadin-password-field>` is an extension of `<vaadin-text-field>` component for entering passwords.
 *
 * ```html
 * <vaadin-password-field label="Password"></vaadin-password-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-password-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------------------------------------------
 * `reveal-button` | The eye icon which toggles the password visibility
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute          | Description
 * -------------------|---------------------------------
 * `password-visible` | Set when the password is visible
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
 * @mixes PasswordFieldMixin
 */
export class PasswordField extends PasswordFieldMixin(TextField) {
  static get is() {
    return 'vaadin-password-field';
  }

  static get template() {
    if (!memoizedTemplate) {
      // Clone the superclass template
      memoizedTemplate = super.template.cloneNode(true);

      // Retrieve this element's dom-module template
      const revealButton = ownTemplate.content.querySelector('[part="reveal-button"]');

      // Append reveal-button and styles to the text-field template
      const inputField = memoizedTemplate.content.querySelector('[part="input-field"]');
      inputField.appendChild(revealButton);
    }

    return memoizedTemplate;
  }
}

defineCustomElement(PasswordField);
