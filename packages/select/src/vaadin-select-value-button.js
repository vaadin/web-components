/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-select-value-button',
  css`
    :host {
      margin: 0;
      min-width: 0;
      width: 0;
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
  { moduleId: 'vaadin-select-value-button-styles' },
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
