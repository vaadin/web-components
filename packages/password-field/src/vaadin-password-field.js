/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-password-field-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { passwordFieldStyles } from './vaadin-password-field-core-styles.js';
import { PasswordFieldMixin } from './vaadin-password-field-mixin.js';

registerStyles('vaadin-password-field', passwordFieldStyles, { moduleId: 'vaadin-password-field-styles' });

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
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and suffix
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 * `reveal-button`      | The eye icon which toggles the password visibility
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|---------------------------------
 * `disabled`           | Set when the element is disabled
 * `has-value`          | Set when the element has a value
 * `has-label`          | Set when the element has a label
 * `has-helper`         | Set when the element has helper text or slot
 * `has-error-message`  | Set when the element has an error message
 * `has-tooltip`        | Set when the element has a slotted tooltip
 * `invalid`            | Set when the element is invalid
 * `input-prevented`    | Temporarily set when invalid input is prevented
 * `focused`            | Set when the element is focused
 * `focus-ring`         | Set when the element is keyboard focused
 * `readonly`           | Set when the element is readonly
 * `password-visible`   | Set when the password is visible
 *
 * Note, the `input-prevented` state attribute is only supported when `allowedCharPattern` is set.
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
