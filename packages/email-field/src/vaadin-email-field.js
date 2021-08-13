/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

// See https://github.com/vaadin/vaadin-text-field/issues/466
registerStyles(
  'vaadin-email-field',
  css`
    :host([dir='rtl']) [part='input-field'] {
      direction: ltr;
    }

    :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
      direction: rtl;
      text-align: left;
    }
  `,
  { moduleId: 'vaadin-email-field-styles' }
);

export class EmailField extends TextField {
  static get is() {
    return 'vaadin-email-field';
  }

  static get version() {
    return '22.0.0-alpha1';
  }

  constructor() {
    super();
    this._setType('email');
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (this.inputElement) {
      this.inputElement.autocapitalize = 'off';
    }
  }

  /** @protected */
  _createConstraintsObserver() {
    // NOTE: pattern needs to be set before constraints observer is initialized
    this.pattern = this.pattern || '^([a-zA-Z0-9_\\.\\-+])+@[a-zA-Z0-9-.]+\\.[a-zA-Z0-9-]{2,}$';

    super._createConstraintsObserver();
  }
}
