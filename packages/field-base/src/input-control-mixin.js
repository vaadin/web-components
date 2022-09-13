/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { FieldMixin } from './field-mixin.js';
import { InputConstraintsMixin } from './input-constraints-mixin.js';
import { SlotStylesMixin } from './slot-styles-mixin.js';

/**
 * A mixin to provide shared logic for the editable form input controls.
 *
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes FieldMixin
 * @mixes InputConstraintsMixin
 * @mixes KeyboardMixin
 * @mixes SlotStylesMixin
 */
export const InputControlMixin = (superclass) =>
  class InputControlMixinClass extends SlotStylesMixin(
    DelegateFocusMixin(InputConstraintsMixin(FieldMixin(KeyboardMixin(superclass)))),
  ) {
    static get properties() {
      return {
        /**
         * A pattern matched against individual characters the user inputs.
         *
         * When set, the field will prevent:
         * - `keydown` events if the entered key doesn't match `/^allowedCharPattern$/`
         * - `paste` events if the pasted text doesn't match `/^allowedCharPattern*$/`
         * - `drop` events if the dropped text doesn't match `/^allowedCharPattern*$/`
         *
         * For example, to allow entering only numbers and minus signs, use:
         * `allowedCharPattern = "[\\d-]"`
         * @attr {string} allowed-char-pattern
         */
        allowedCharPattern: {
          type: String,
          observer: '_allowedCharPatternChanged',
        },

        /**
         * If true, the input text gets fully selected when the field is focused using click or touch / tap.
         */
        autoselect: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to display the clear icon which clears the input.
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: true,
          value: false,
        },

        /**
         * The name of this field.
         */
        name: {
          type: String,
          reflectToAttribute: true,
        },

        /**
         * A hint to the user of what can be entered in the field.
         */
        placeholder: {
          type: String,
          reflectToAttribute: true,
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * The text usually displayed in a tooltip popup when the mouse is over the field.
         */
        title: {
          type: String,
          reflectToAttribute: true,
        },
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'name', 'type', 'placeholder', 'readonly', 'invalid', 'title'];
    }

    constructor() {
      super();

      this._boundOnPaste = this._onPaste.bind(this);
      this._boundOnDrop = this._onDrop.bind(this);
      this._boundOnBeforeInput = this._onBeforeInput.bind(this);
    }

    /**
     * Any element extending this mixin is required to implement this getter.
     * It returns the reference to the clear button element.
     * @protected
     * @return {Element | null | undefined}
     */
    get clearElement() {
      console.warn(`Please implement the 'clearElement' property in <${this.localName}>`);
      return null;
    }

    /** @protected */
    get slotStyles() {
      // Needed for Safari, where ::slotted(...)::placeholder does not work
      return [
        `
          :is(input[slot='input'], textarea[slot='textarea'])::placeholder {
            font: inherit;
            color: inherit;
          }
        `,
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      if (this.clearElement) {
        this.clearElement.addEventListener('click', (e) => this._onClearButtonClick(e));
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this.inputElement.focus();
      this.__clear();
    }

    /**
     * Override an event listener from `DelegateFocusMixin`.
     * @param {FocusEvent} event
     * @protected
     * @override
     */
    _onFocus(event) {
      super._onFocus(event);

      if (this.autoselect && this.inputElement) {
        this.inputElement.select();
      }
    }

    /**
     * Override an event listener inherited from `KeydownMixin` to clear on Esc.
     * Components that extend this mixin can prevent this behavior by overriding
     * this method without calling `super._onEscape` to provide custom logic.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      super._onEscape(event);

      if (this.clearButtonVisible && !!this.value) {
        event.stopPropagation();
        this.__clear();
      }
    }

    /**
     * Override an event listener inherited from `InputMixin`
     * to capture native `change` event and make sure that
     * a new one is dispatched after validation runs.
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      event.stopPropagation();

      this.validate();

      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            sourceEvent: event,
          },
          bubbles: event.bubbles,
          cancelable: event.cancelable,
        }),
      );
    }

    /** @private */
    __clear() {
      this.clear();
      this.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
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
     * Override an event listener from `KeyboardMixin`.
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this.allowedCharPattern && !this.__shouldAcceptKey(event)) {
        event.preventDefault();
        this._markInputPrevented();
      }
    }

    /** @protected */
    _markInputPrevented() {
      // Add input-prevented attribute for 200ms
      this.setAttribute('input-prevented', '');
      this._preventInputDebouncer = Debouncer.debounce(this._preventInputDebouncer, timeOut.after(200), () => {
        this.removeAttribute('input-prevented');
      });
    }

    /** @private */
    __shouldAcceptKey(event) {
      return (
        event.metaKey ||
        event.ctrlKey ||
        !event.key || // Allow typing anything if event.key is not supported
        event.key.length !== 1 || // Allow "Backspace", "ArrowLeft" etc.
        this.__allowedCharRegExp.test(event.key)
      );
    }

    /** @private */
    _onPaste(e) {
      if (this.allowedCharPattern) {
        const pastedText = e.clipboardData.getData('text');
        if (!this.__allowedTextRegExp.test(pastedText)) {
          e.preventDefault();
          this._markInputPrevented();
        }
      }
    }

    /** @private */
    _onDrop(e) {
      if (this.allowedCharPattern) {
        const draggedText = e.dataTransfer.getData('text');
        if (!this.__allowedTextRegExp.test(draggedText)) {
          e.preventDefault();
          this._markInputPrevented();
        }
      }
    }

    /** @private */
    _onBeforeInput(e) {
      // The `beforeinput` event covers all the cases for `allowedCharPattern`: keyboard, pasting and dropping,
      // but it is still experimental technology so we can't rely on it. It's used here just as an additional check,
      // because it seems to be the only way to detect and prevent specific keys on mobile devices.
      // See https://github.com/vaadin/vaadin-text-field/issues/429
      if (this.allowedCharPattern && e.data && !this.__allowedTextRegExp.test(e.data)) {
        e.preventDefault();
        this._markInputPrevented();
      }
    }

    /** @private */
    _allowedCharPatternChanged(charPattern) {
      if (charPattern) {
        try {
          this.__allowedCharRegExp = new RegExp(`^${charPattern}$`);
          this.__allowedTextRegExp = new RegExp(`^${charPattern}*$`);
        } catch (e) {
          console.error(e);
        }
      }
    }

    /**
     * Fired when the user commits a value change.
     *
     * @event change
     */

    /**
     * Fired when the value is changed by the user: on every typing keystroke,
     * and the value is cleared using the clear button.
     *
     * @event input
     */
  };
