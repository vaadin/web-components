/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';

const DEFAULT_I18N = {
  send: 'Send',
  message: 'Message',
};

/**
 * @polymerMixin
 * @mixes I18nMixin
 */
export const MessageInputMixin = (superClass) =>
  class MessageInputMixinClass extends I18nMixin(DEFAULT_I18N, superClass) {
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
        '__buttonPropsChanged(_button, disabled, __effectiveI18n)',
        '__textAreaPropsChanged(_textArea, disabled, __effectiveI18n, value)',
      ];
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   // Used as the button label
     *   send: 'Send',
     *
     *   // Used as the input field's placeholder and aria-label
     *   message: 'Message'
     * }
     * ```
     * @return {!MessageInputI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    ready() {
      super.ready();

      this._buttonController = new SlotController(this, 'button', 'vaadin-message-input-button', {
        initializer: (btn) => {
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

          textarea.minRows = 1;
          (textarea.inputElement || textarea).setAttribute('enterkeyhint', 'send');

          this._textArea = textarea;
        },
      });
      this.addController(this._textAreaController);

      this._tooltipController = new TooltipController(this);
      this.addController(this._tooltipController);
    }

    focus(options) {
      if (this._textArea) {
        this._textArea.focus(options);
      }
    }

    /** @private */
    __buttonPropsChanged(button, disabled, effectiveI18n) {
      if (button) {
        button.disabled = disabled;
        button.textContent = effectiveI18n.send;
      }
    }

    /** @private */
    __textAreaPropsChanged(textArea, disabled, effectiveI18n, value) {
      if (textArea) {
        textArea.disabled = disabled;
        textArea.value = value;

        const message = effectiveI18n.message;
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
