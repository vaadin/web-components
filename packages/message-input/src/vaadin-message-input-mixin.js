/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';

/**
 * @polymerMixin
 * @mixes ControllerMixin
 */
export const MessageInputMixin = (superClass) =>
  class MessageInputMixinClass extends ControllerMixin(superClass) {
    static get properties() {
      return {
        /**
         * Current content of the text input field
         */
        value: {
          type: String,
          value: '',
          sync: true,
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
          sync: true,
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
          sync: true,
        },

        /** @private */
        _button: {
          type: Object,
          sync: true,
        },

        /** @private */
        _textArea: {
          type: Object,
          sync: true,
        },
      };
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

          // With Lit version, input element renders asynchronously and it will
          // override the `rows` attribute set to `1` in the `minRows` observer.
          // Workaround: perform update twice to run the observer synchronously.
          // TODO: needs https://github.com/vaadin/web-components/pull/8168
          if (textarea.performUpdate) {
            textarea.performUpdate();
            textarea.performUpdate();
          }

          const input = textarea.inputElement;

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
        textArea.accessibleName = message;
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
  };
