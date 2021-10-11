/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputControlMixin } from './input-control-mixin.js';

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 *
 * @polymerMixin
 * @mixes InputControlMixin
 */
export const InputFieldMixin = (superclass) =>
  class InputFieldMixinClass extends InputControlMixin(superclass) {
    static get properties() {
      return {
        /**
         * Whether the value of the control can be automatically completed by the browser.
         * List of available options at:
         * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
         */
        autocomplete: {
          type: String
        },

        /**
         * This is a property supported by Safari that is used to control whether
         * autocorrection should be enabled when the user is entering/editing the text.
         * Possible values are:
         * on: Enable autocorrection.
         * off: Disable autocorrection.
         */
        autocorrect: {
          type: String
        },

        /**
         * This is a property supported by Safari and Chrome that is used to control whether
         * autocapitalization should be enabled when the user is entering/editing the text.
         * Possible values are:
         * characters: Characters capitalization.
         * words: Words capitalization.
         * sentences: Sentences capitalization.
         * none: No capitalization.
         */
        autocapitalize: {
          type: String
        },

        /**
         * A pattern matched against individual characters the user inputs.
         * When set, the field will prevent:
         * - `keyDown` events if the entered key doesn't match `/^_enabledCharPattern$/`
         * - `paste` events if the pasted text doesn't match `/^_enabledCharPattern*$/`
         * - `drop` events if the dropped text doesn't match `/^_enabledCharPattern*$/`
         *
         * For example, to enable entering only numbers and minus signs,
         * `_enabledCharPattern = "[\\d-]"`
         * @protected
         */
        _enabledCharPattern: {
          type: String,
          observer: '_enabledCharPatternChanged'
        }
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'autocapitalize', 'autocomplete', 'autocorrect'];
    }

    constructor() {
      super();

      this._boundOnPaste = this._onPaste.bind(this);
      this._boundOnDrop = this._onDrop.bind(this);
      this._boundOnBeforeInput = this._onBeforeInput.bind(this);
    }

    /**
     * @param {HTMLElement} input
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        // Discard value set on the custom slotted input.
        if (input.value && input.value !== this.value) {
          console.warn(`Please define value on the <${this.localName}> component!`);
          input.value = '';
        }

        if (this.value) {
          input.value = this.value;
        }
      }
    }

    // Workaround for https://github.com/Polymer/polymer/issues/5259
    get __data() {
      return this.__dataValue || {};
    }

    set __data(value) {
      this.__dataValue = value;
    }

    /**
     * Override an event listener from `DelegateFocusMixin`.
     * @param {FocusEvent} event
     * @protected
     * @override
     */
    _onBlur(event) {
      super._onBlur(event);

      this.validate();
    }

    /**
     * Override a method from `InputMixin` to validate the field
     * when a new value is set programmatically.
     * @param {string} value
     * @protected
     * @override
     */
    _forwardInputValue(value) {
      super._forwardInputValue(value);

      if (this.invalid) {
        this.validate();
      }
    }

    /**
     * Override a method from `InputMixin`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _addInputListeners(input) {
      super._addInputListeners(input);

      input.addEventListener('paste', this._boundOnPaste);
      input.addEventListener('drop', this._boundOnDrop);
      input.addEventListener('beforeinput', this._boundOnBeforeInput);
    }

    /**
     * Override a method from `InputMixin`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _removeInputListeners(input) {
      super._removeInputListeners(input);

      input.removeEventListener('paste', this._boundOnPaste);
      input.removeEventListener('drop', this._boundOnDrop);
      input.removeEventListener('beforeinput', this._boundOnBeforeInput);
    }

    /**
     * Override an event listener from `ClearButtonMixin`
     * to avoid adding a separate listener.
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (this._enabledCharPattern && !this.__shouldAcceptKey(event)) {
        event.preventDefault();
      }

      super._onKeyDown(event);
    }

    /** @private */
    __shouldAcceptKey(event) {
      return (
        event.metaKey ||
        event.ctrlKey ||
        !event.key || // allow typing anything if event.key is not supported
        event.key.length !== 1 || // allow "Backspace", "ArrowLeft" etc.
        this.__enabledCharRegExp.test(event.key)
      );
    }

    /** @private */
    _onPaste(e) {
      if (this._enabledCharPattern) {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!this.__enabledTextRegExp.test(pastedText)) {
          e.preventDefault();
        }
      }
    }

    /** @private */
    _onDrop(e) {
      if (this._enabledCharPattern) {
        const draggedText = e.dataTransfer.getData('text');
        if (!this.__enabledTextRegExp.test(draggedText)) {
          e.preventDefault();
        }
      }
    }

    /** @private */
    _onBeforeInput(e) {
      // The `beforeinput` event covers all the cases for `_enabledCharPattern`: keyboard, pasting and dropping,
      // but it is still experimental technology so we can't rely on it. It's used here just as an additional check,
      // because it seems to be the only way to detect and prevent specific keys on mobile devices.
      // See https://github.com/vaadin/vaadin-text-field/issues/429
      if (this._enabledCharPattern && e.data && !this.__enabledTextRegExp.test(e.data)) {
        e.preventDefault();
      }
    }

    /** @private */
    _enabledCharPatternChanged(charPattern) {
      if (charPattern) {
        this.__enabledCharRegExp = new RegExp('^' + charPattern + '$');
        this.__enabledTextRegExp = new RegExp('^' + charPattern + '*$');
      }
    }
  };
