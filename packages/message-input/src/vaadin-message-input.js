/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/text-area/src/vaadin-text-area.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
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
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageInput extends ElementMixin(ThemableMixin(ControllerMixin(PolymerElement))) {
  static get properties() {
    return {
      /**
       * Current content of the text input field
       */
      value: {
        type: String,
        value: '',
      },

      /**
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

      /** @private */
      _button: {
        type: Object,
      },

      /** @private */
      _textArea: {
        type: Object,
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

        :host([hidden]) {
          display: none !important;
        }

        ::slotted([slot='button']) {
          flex-shrink: 0;
        }

        ::slotted([slot='textarea']) {
          align-self: stretch;
          flex-grow: 1;
        }
      </style>
      <slot name="textarea"></slot>

      <slot name="button"></slot>

      <slot name="tooltip"></slot>
    `;
  }

  static get is() {
    return 'vaadin-message-input';
  }

  static get observers() {
    return [
      '__buttonPropsChanged(_button, disabled, i18n)',
      '__textAreaPropsChanged(_textArea, disabled, i18n, value)',
    ];
  }

  /** @protected */
  ready() {
    super.ready();

    this._buttonController = new SlotController(this, 'button', 'vaadin-button', {
      initializer: (btn) => {
        btn.setAttribute('theme', 'primary contained');

        btn.addEventListener('click', () => {
          this.__submit();
        });

        this._button = btn;
      },
    });
    this.addController(this._buttonController);

    this._textAreaController = new SlotController(this, 'textarea', 'vaadin-text-area', {
      initializer: (textarea) => {
        textarea.addEventListener('value-changed', (event) => {
          this.value = event.detail.value;
        });

        textarea.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.__submit();
          }
        });

        const input = textarea.inputElement;
        input.removeAttribute('aria-labelledby');

        // Set initial height to one row
        input.setAttribute('rows', 1);
        input.style.minHeight = '0';

        this._textArea = textarea;
      },
    });
    this.addController(this._textAreaController);

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  focus() {
    if (this._textArea) {
      this._textArea.focus();
    }
  }

  /** @private */
  __buttonPropsChanged(button, disabled, i18n) {
    if (button) {
      button.disabled = disabled;
      button.textContent = i18n.send;
    }
  }

  /** @private */
  __textAreaPropsChanged(textArea, disabled, i18n, value) {
    if (textArea) {
      textArea.disabled = disabled;
      textArea.value = value;

      const message = i18n.message;
      textArea.placeholder = message;

      if (message) {
        textArea.inputElement.setAttribute('aria-label', message);
      } else {
        textArea.inputElement.removeAttribute('aria-label');
      }
    }
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
    this._textArea.focus();
  }

  /**
   * Fired when a new message is submitted with `<vaadin-message-input>`, either
   * by clicking the "send" button, or pressing the Enter key.
   * @event submit
   */
}

defineCustomElement(MessageInput);

export { MessageInput };
