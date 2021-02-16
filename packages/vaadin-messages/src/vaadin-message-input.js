/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-button/src/vaadin-button.js';
import '@vaadin/vaadin-text-field/src/vaadin-text-area.js';
/**
 * `<vaadin-message-input>` is a Web Component for sending messages.
 * It consists of a text area that grows on along with the content, and a send button to send message.
 *
 * ```html
 * <vaadin-message-input></vaadin-message-input>
 * ```
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageInputElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          align-items: flex-start;
          box-sizing: border-box;
          display: flex;
          max-height: 50vh;
          overflow: hidden;
        }
        vaadin-text-area {
          align-self: stretch;
          flex-grow: 1;
          padding: 0;
        }
        vaadin-button {
          flex-shrink: 0;
          margin: 0;
        }
      </style>
      <vaadin-text-area placeholder="Message"></vaadin-text-area>
      <vaadin-button theme="primary contained">Send</vaadin-button>
    `;
  }

  static get is() {
    return 'vaadin-message-input';
  }

  static get version() {
    return '1.0.0-alpha1';
  }

  ready() {
    super.ready();

    // Set aria-label to provide an accessible name for the labelless input
    const textarea = this.shadowRoot.querySelector('vaadin-text-area').inputElement;
    textarea.setAttribute('aria-label', 'Message');
    textarea.removeAttribute('aria-labelledby');

    // Set initial height to one row
    textarea.setAttribute('rows', 1);
    textarea.style.minHeight = '0';
  }
}

customElements.define(MessageInputElement.is, MessageInputElement);

export { MessageInputElement };
