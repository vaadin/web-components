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
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message-input-button',
  css`
    :host {
      flex-shrink: 0;
    }
  `,
  { moduleId: 'vaadin-message-input-button-styles' },
);

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @extends Button
 * @protected
 */
class MessageInputButton extends Button {
  static get is() {
    return 'vaadin-message-input-button';
  }
}

customElements.define(MessageInputButton.is, MessageInputButton);
