/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';

const DEFAULT_I18N = {
  send: 'Send',
  message: 'Message',
};

const CONTENT_SLOTS = ['header', 'prefix', 'footer'];

/**
 * Returns true if the element has text that is exposed to assistive technologies.
 * Content in a named slot or marked with `aria-hidden` does not count: a tooltip
 * writes its text to the light DOM, and `vaadin-button` renders the `prefix` and
 * `suffix` slots inside `aria-hidden` wrappers.
 *
 * @param {Element} element
 * @return {boolean}
 */
function hasVisibleText(element) {
  return Array.from(element.childNodes)
    .filter((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return true;
      }
      return !node.slot && node.getAttribute('aria-hidden') !== 'true';
    })
    .some((node) => node.textContent.trim() !== '');
}

/**
 * A controller for the send button slot.
 */
class MessageInputButtonController extends SlotController {
  #hasCustomLabel = false;

  constructor(host, initializer) {
    super(host, 'button', 'vaadin-message-input-button', { initializer });
  }

  /**
   * Override method from `SlotController` to store whether the custom button
   * has own accessible name before setting a custom `aria-label`.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(node) {
    this.#hasCustomLabel =
      hasVisibleText(node) || node.hasAttribute('aria-label') || node.hasAttribute('aria-labelledby');

    super.initCustomNode(node);
  }

  /**
   * Apply the localized send text to the button: as text content for the
   * default button, and as an accessible name for a custom button that does
   * not provide one itself.
   *
   * @param {string} label
   */
  setLabel(label) {
    const { node } = this;

    if (node === this.defaultNode) {
      node.textContent = label;
    } else if (!this.#hasCustomLabel) {
      node.setAttribute('aria-label', label);
    }
  }
}

export const MessageInputMixin = (superClass) =>
  class MessageInputMixinClass extends I18nMixin(FocusMixin(superClass)) {
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
        '__buttonPropsChanged(_button, disabled, __effectiveI18n, value)',
        '__textAreaPropsChanged(_textArea, disabled, __effectiveI18n, value)',
      ];
    }

    static get defaultI18n() {
      return DEFAULT_I18N;
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
     * @type {!MessageInputI18n}
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

      this._buttonController = new MessageInputButtonController(this, (btn) => {
        btn.addEventListener('click', () => {
          this.__submit();
        });

        this._button = btn;
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

      this.__slotObserver = new SlotObserver(
        this.shadowRoot,
        () => {
          CONTENT_SLOTS.forEach((name) => {
            this.toggleAttribute(`has-${name}`, !!this.querySelector(`:scope > [slot="${name}"]`));
          });
        },
        { syncInitial: true },
      );

      this.addEventListener('mousedown', (event) => {
        // Focus the text area when clicking the space around it.
        if (event.target === this) {
          // Prevent mousedown to avoid blur and re-focus if already focused.
          event.preventDefault();
          this.focus({ focusVisible: false });
        }
      });
    }

    /**
     * Override method inherited from `FocusMixin` to forward focus
     * to the text area, which is the focusable part of the component.
     *
     * @param {FocusOptions=} options
     * @protected
     * @override
     */
    focus(options) {
      if (this._textArea && !this.disabled) {
        this._textArea.focus(options);
        super.focus(options);
      }
    }

    /**
     * Override method inherited from `FocusMixin` to only set the `focused`
     * attribute when the text area is focused.
     *
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(event) {
      return event.composedPath().includes(this._textArea);
    }

    /** @private */
    __buttonPropsChanged(button, disabled, effectiveI18n, value) {
      if (button) {
        button.disabled = disabled || !value;

        this._buttonController.setLabel(effectiveI18n.send);
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
  };
