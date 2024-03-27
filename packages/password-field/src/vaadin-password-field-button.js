/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * An element used internally by `<vaadin-password-field>`. Not intended to be used separately.
 *
 * @extends Button
 * @private
 */
class PasswordFieldButton extends Button {
  static get is() {
    return 'vaadin-password-field-button';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <slot name="tooltip"></slot>
    `;
  }
}

customElements.define(PasswordFieldButton.is, PasswordFieldButton);
