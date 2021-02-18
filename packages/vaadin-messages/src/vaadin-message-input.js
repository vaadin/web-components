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
 * The message can be sent by one of the following actions:
 * - by pressing Enter (use Shift + Enter to add a new line)
 * - by clicking `submit` button.
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
  static get properties() {
    return {
      /**
       * Current content of the text input field
       */
      value: {
        type: String
      }
    };
  }

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
      <vaadin-text-area value="{{value}}" placeholder="Message"></vaadin-text-area>
      <vaadin-button theme="primary contained" on-click="__submit">Send</vaadin-button>
    `;
  }

  static get is() {
    return 'vaadin-message-input';
  }

  static get version() {
    return '2.0.0-alpha1';
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

    // Add enter handling for text area.
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.__submit();
      }
    });
  }

  /**
   * Submits the current value as an custom event named 'submit'.
   * It also clears the text input and refocuses it for sending another message.
   * In UI, can be triggered by pressing the submit button or pressing enter key when field is focused.
   * It does not submit anything if text is empty.
   */
  __submit() {
    if (this.value !== '') {
      this.dispatchEvent(new CustomEvent('submit', { detail: { value: this.value } }));
      this.value = '';
    }
    this.shadowRoot.querySelector('vaadin-text-area').focus();
  }
}

customElements.define(MessageInputElement.is, MessageInputElement);

export { MessageInputElement };
