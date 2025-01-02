/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-password-field-button.js';
import { html } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-lit-text-field.js';
import { PasswordFieldMixin } from './vaadin-password-field-mixin.js';

/**
 * LitElement based version of `<vaadin-password-field>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
export class PasswordField extends PasswordFieldMixin(TextField) {
  static get is() {
    return 'vaadin-password-field';
  }

  /**
   * @protected
   * @override
   */
  _renderSuffix() {
    return html`
      ${super._renderSuffix()}
      <div part="reveal-button" slot="suffix">
        <slot name="reveal"></slot>
      </div>
    `;
  }
}

defineCustomElement(PasswordField);
