/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { animationFrame } from '@polymer/polymer/lib/utils/async.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { AriaLabelMixin } from './aria-label-mixin.js';
import { ClearButtonMixin } from './clear-button-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { FieldAriaMixin } from './field-aria-mixin.js';
import { ForwardInputPropsMixin } from './forward-input-props-mixin.js';

const InputFieldMixinImplementation = (superclass) =>
  class InputFieldMixinClass extends ClearButtonMixin(
    FieldAriaMixin(ForwardInputPropsMixin(AriaLabelMixin(DelegateFocusMixin(superclass))))
  ) {
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
         * Specify that the value should be automatically selected when the field gains focus.
         */
        autoselect: {
          type: Boolean,
          value: false
        }
      };
    }

    static get forwardProps() {
      return [...super.forwardProps, 'autocapitalize', 'autocomplete', 'autocorrect'];
    }

    static get observers() {
      return ['__observeOffsetHeight(errorMessage, invalid, label, helperText)'];
    }

    /**
     * Element used by `FieldAriaMixin` to set ARIA attributes.
     * @protected
     */
    get _ariaTarget() {
      return this.inputElement;
    }

    /**
     * Element used by `DelegatesFocusMixin` to handle focus.
     * @return {!HTMLInputElement}
     */
    get focusElement() {
      return this.inputElement;
    }

    constructor() {
      super();

      this._boundOnBlur = this._onBlur.bind(this);
      this._boundOnFocus = this._onFocus.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this.inputElement) {
        // Discard value set on the custom slotted input.
        if (this.inputElement.value !== this.value) {
          console.warn(`Please define value on the <${this.localName}> component!`);
          this.inputElement.value = '';
        }

        if (this.value) {
          this.inputElement.value = this.value;
        }
      }
    }

    /** @protected */
    ready() {
      super.ready();

      // Lumo theme defines a max-height transition for the "error-message"
      // part on invalid state change.
      const errorPart = this.shadowRoot.querySelector('[part="error-message"]');
      if (errorPart) {
        errorPart.addEventListener('transitionend', () => {
          this.__observeOffsetHeight();
        });
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      if (this.required) {
        return this.inputElement ? this.inputElement.checkValidity() : undefined;
      } else {
        return !this.invalid;
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
     * @param {HTMLInputElement} input
     * @protected
     */
    _addInputListeners(input) {
      super._addInputListeners(input);

      input.addEventListener('blur', this._boundOnBlur);
      input.addEventListener('focus', this._boundOnFocus);
    }

    /** @private */
    _onFocus() {
      if (this.autoselect && this.inputElement) {
        this.inputElement.select();
      }
    }

    /** @private */
    _onBlur() {
      this.validate();
    }

    /**
     * Dispatch an event if a specific size measurement property has changed.
     * Supporting multiple properties here is needed for `vaadin-text-area`.
     * @protected
     */
    _dispatchIronResizeEventIfNeeded(prop, value) {
      const oldSize = '__old' + prop;
      if (this[oldSize] !== undefined && this[oldSize] !== value) {
        this.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true, composed: true }));
      }

      this[oldSize] = value;
    }

    /** @private */
    __observeOffsetHeight() {
      this.__observeOffsetHeightDebouncer = Debouncer.debounce(
        this.__observeOffsetHeightDebouncer,
        animationFrame,
        () => {
          this._dispatchIronResizeEventIfNeeded('Height', this.offsetHeight);
        }
      );
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
  };

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 */
export const InputFieldMixin = dedupingMixin(InputFieldMixinImplementation);
