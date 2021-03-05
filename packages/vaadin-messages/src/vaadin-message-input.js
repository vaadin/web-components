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
          message: 'Message'
        }),
        observer: '__i18nChanged'
      },

      /**
       * Set to true to disable this element.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
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
          flex-shrink: 0;
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
      <vaadin-text-area disabled="[[disabled]]" value="{{value}}" placeholder="[[i18n.message]]"></vaadin-text-area>
      <vaadin-button disabled="[[disabled]]" theme="primary contained" on-click="__submit">[[i18n.send]]</vaadin-button>
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

    const textarea = this.__inputElement;
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

  __i18nChanged(i18n) {
    // Set aria-label to provide an accessible name for the labelless input
    this.__inputElement.setAttribute('aria-label', i18n.message);
  }

  /**
   * Gets the native `<textarea>` inside the `<vaadin-text-area>`.
   */
  get __inputElement() {
    return this.shadowRoot.querySelector('vaadin-text-area').inputElement;
  }
}

customElements.define(MessageInputElement.is, MessageInputElement);

export { MessageInputElement };
