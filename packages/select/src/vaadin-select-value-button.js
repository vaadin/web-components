/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-select-value-button',
  css`
    :host {
      margin: 0;
    }

    ::slotted(vaadin-item) {
      padding-left: 0;
      padding-right: 0;
      flex: auto;
    }

    /* placeholder styles */
    ::slotted(:not([selected])) {
      line-height: normal;
    }

    /* TODO: unsupported selector */
    .vaadin-button-container {
      text-align: inherit;
    }

    [part='label'] {
      width: 100%;
      padding: 0;
      line-height: inherit;
    }
  `,
  { moduleId: 'vaadin-select-value-button-styles' }
);

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends Button
 * @protected
 */
class SelectValueButton extends Button {
  static get is() {
    return 'vaadin-select-value-button';
  }
}

customElements.define(SelectValueButton.is, SelectValueButton);
