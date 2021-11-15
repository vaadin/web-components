/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonElement } from '@vaadin/vaadin-button/src/vaadin-button.js';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

registerStyles(
  'vaadin-message-input-button',
  css`
    :host {
      flex-shrink: 0;
    }
  `,
  { moduleId: 'vaadin-message-input-button-styles' }
);

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @extends ButtonElement
 * @protected
 */
class MessageInputButtonElement extends ButtonElement {
  static get is() {
    return 'vaadin-message-input-button';
  }

  static get version() {
    return '21.0.4';
  }
}

customElements.define(MessageInputButtonElement.is, MessageInputButtonElement);
