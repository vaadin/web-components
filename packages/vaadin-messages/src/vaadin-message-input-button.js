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
      margin: 0;
    }
  `,
  { moduleId: 'vaadin-message-input-button-styles' }
);

/**
 * The button element for a message input.
 *
 * ### Styling
 *
 * See [`<vaadin-button>` documentation](https://github.com/vaadin/vaadin-button/blob/master/src/vaadin-button.js)
 * for `<vaadin-message-input-button>` parts and available slots
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin#readme)
 *
 * @extends ButtonElement
 */
class MessageInputButtonElement extends ButtonElement {
  static get is() {
    return 'vaadin-message-input-button';
  }

  static get version() {
    return '2.0.0-alpha2';
  }
}

customElements.define(MessageInputButtonElement.is, MessageInputButtonElement);
