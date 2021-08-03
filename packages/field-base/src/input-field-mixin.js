/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { animationFrame } from '@polymer/polymer/lib/utils/async.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ClearButtonMixin } from './clear-button-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { FieldAriaMixin } from './field-aria-mixin.js';
import { InputPropsMixin } from './input-props-mixin.js';

const InputFieldMixinImplementation = (superclass) =>
  class InputFieldMixinClass extends ClearButtonMixin(FieldAriaMixin(InputPropsMixin(DelegateFocusMixin(superclass)))) {
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
        },

        /**
         * The value of the field.
         */
        value: {
          type: String,
          value: '',
          observer: '_valueChanged',
          notify: true
        }
      };
    }

    static get hostProps() {
      return [...super.hostProps, 'autocapitalize', 'autocomplete', 'autocorrect'];
    }

    static get observers() {
      return ['__observeOffsetHeight(errorMessage, invalid, label, helperText)'];
    }

    /**
     * Element used by `FieldAriaMixin` to set ARIA attributes.
     * @protected
     */
    get _ariaTarget() {
      return this._inputNode;
    }

    /**
     * Element used by `DelegatesFocusMixin` to handle focus.
     * @return {!HTMLInputElement}
     */
    get focusElement() {
      return this._inputNode;
    }

    constructor() {
      super();

      this._boundOnInput = this._onInput.bind(this);
      this._boundOnBlur = this._onBlur.bind(this);
      this._boundOnFocus = this._onFocus.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this._inputNode) {
        this._addInputListeners(this._inputNode);

        // Discard value set on the custom slotted input.
        if (this._inputNode.value !== this.value) {
          console.warn(`Please define value on the <${this.localName}> component!`);
          this._inputNode.value = '';
        }

        if (this.value) {
          this._inputNode.value = this.value;
          this.validate();
        }
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this._inputNode) {
        this._removeInputListeners(this._inputNode);
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
        return this._inputNode ? this._inputNode.checkValidity() : undefined;
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
     * @param {HTMLElement} node
     * @protected
     */
    _addInputListeners(node) {
      node.addEventListener('input', this._boundOnInput);
      node.addEventListener('blur', this._boundOnBlur);
      node.addEventListener('focus', this._boundOnFocus);
    }

    /**
     * @param {HTMLElement} node
     * @protected
     */
    _removeInputListeners(node) {
      node.removeEventListener('input', this._boundOnInput);
      node.removeEventListener('blur', this._boundOnBlur);
      node.removeEventListener('focus', this._boundOnFocus);
    }

    /** @private */
    _onFocus() {
      if (this.autoselect && this._inputNode) {
        this._inputNode.select();
      }
    }

    /** @private */
    _onBlur() {
      this.validate();
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onInput(event) {
      // Ignore manual clear button events
      this.__userInput = event.isTrusted;
      this.value = event.target.value;
      this.__userInput = false;
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
     * @param {unknown} newVal
     * @param {unknown} oldVal
     * @protected
     */
    _valueChanged(newVal, oldVal) {
      // Setting initial value to empty string, skip validation
      if (newVal === '' && oldVal === undefined) {
        return;
      }

      if (newVal !== '' && newVal != null) {
        this.setAttribute('has-value', '');
      } else {
        this.removeAttribute('has-value');
      }

      // Value is set before an element is connected to the DOM:
      // this case is handled separately in `connectedCallback`.
      if (!this._inputNode) {
        return;
      }

      // Value is set by the user, no need to sync it back to input.
      // Also no need to validate, as we call `validate` on blur.
      if (this.__userInput) {
        return;
      }

      // Setting a value programmatically, sync it to input element.
      if (newVal != undefined) {
        this._inputNode.value = newVal;
      } else {
        this.clear();
      }

      // Validate the field after a new value is set programmatically.
      if (this.invalid) {
        this.validate();
      }
    }
  };

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 */
export const InputFieldMixin = dedupingMixin(InputFieldMixinImplementation);
