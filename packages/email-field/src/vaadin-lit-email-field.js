/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { TextField } from '@vaadin/text-field/src/vaadin-lit-text-field.js';
import { emailFieldStyles } from './vaadin-email-field-styles.js';

/**
 * LitElement based version of `<vaadin-email-field>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
export class EmailField extends TextField {
  static get is() {
    return 'vaadin-email-field';
  }

  static get styles() {
    return [...super.styles, emailFieldStyles];
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
