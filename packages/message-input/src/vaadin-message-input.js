/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-message-input-text-area.js';
import './vaadin-message-input-button.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * ### Internal components
 *
 * In addition to `<vaadin-message-input>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-message-input-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - `<vaadin-message-input-text-area>` - has the same API as [`<vaadin-text-area>`](#/elements/vaadin-text-area).
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageInput extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get properties() {
    return {
      /**
       * Current content of the text input field
       */
      value: {
        type: String,
      },

      /**
       *
       * The object used to localize this component.
       * For changing the default localization, change the entire
       * `i18n` object.
       *
       * The object has the following JSON structure and default values:
       *
       * ```
       * {
       *   // Used as the button label
       *   send: 'Send',
       *
       *   // Used as the input field's placeholder and aria-label
       *   message: 'Message'
       * }
       * ```
       *
       * @type {!MessageInputI18n}
       * @default {English}
       */
      i18n: {
        type: Object,
        value: () => ({
          send: 'Send',
          message: 'Message',
        }),
      },

      /**
       * Set to true to disable this element.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
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
          flex-shrink: 0;
        }
      </style>
      <vaadin-message-input-text-area
        disabled="[[disabled]]"
        value="{{value}}"
        placeholder="[[i18n.message]]"
        aria-label="[[i18n.message]]"
        on-enter="__submit"
      ></vaadin-message-input-text-area>
      <vaadin-message-input-button disabled="[[disabled]]" theme="primary contained" on-click="__submit"
        >[[i18n.send]]</vaadin-message-input-button
      >
    `;
  }

  static get is() {
    return 'vaadin-message-input';
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
    this.shadowRoot.querySelector('vaadin-message-input-text-area').focus();
  }
}

customElements.define(MessageInput.is, MessageInput);

export { MessageInput };
