/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * A mixin to store the reference to an input element
 * and add input and change event listeners to it.
 *
 * @polymerMixin
 */
export const InputMixin = dedupingMixin(
  (superclass) =>
    class InputMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * A reference to the input element controlled by the mixin.
           * Any component implementing this mixin is expected to provide it
           * by using `this._setInputElement(input)` Polymer API.
           *
           * A typical case is using `InputController` that does this automatically.
           * However, the input element does not have to always be native <input>:
           * as an example, <vaadin-combo-box-light> accepts other components.
           *
           * @protected
           * @type {!HTMLElement}
           */
          inputElement: {
            type: Object,
            readOnly: true,
            observer: '_inputElementChanged'
          },

          /**
           * String used to define input type.
           * @protected
           */
          type: {
            type: String,
            readOnly: true
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

      constructor() {
        super();

        this._boundOnInput = this._onInput.bind(this);
        this._boundOnChange = this._onChange.bind(this);
      }

      /**
       * Clear the value of the field.
       */
      clear() {
        this.value = '';
      }

      /**
       * Add event listeners to the input element instance.
       * Override this method to add custom listeners.
       * @param {!HTMLElement} input
       */
      _addInputListeners(input) {
        input.addEventListener('input', this._boundOnInput);
        input.addEventListener('change', this._boundOnChange);
      }

      /**
       * Remove event listeners from the input element instance.
       * @param {!HTMLElement} input
       */
      _removeInputListeners(input) {
        input.removeEventListener('input', this._boundOnInput);
        input.removeEventListener('change', this._boundOnChange);
      }

      /**
       * A method to forward the value property set on the field
       * programmatically back to the input element value.
       * Override this method to perform additional checks,
       * for example to skip this in certain conditions.
       * @param {string} value
       * @protected
       * @override
       */
      _forwardInputValue(value) {
        // Value might be set before an input element is initialized.
        // This case should be handled separately by a component that
        // implements this mixin, for example in `connectedCallback`.
        if (!this.inputElement) {
          return;
        }

        if (value != undefined) {
          this.inputElement.value = value;
        } else {
          this.inputElement.value = '';
        }
      }

      /** @protected */
      _inputElementChanged(input, oldInput) {
        if (input) {
          this._addInputListeners(input);
        } else if (oldInput) {
          this._removeInputListeners(oldInput);
        }
      }

      /**
       * An input event listener used to update the field value.
       * Override this method with an actual implementation.
       * @param {Event} _event
       * @protected
       * @override
       */
      _onInput(event) {
        // Ignore fake input events e.g. used by clear button.
        this.__userInput = event.isTrusted;
        this.value = event.target.value;
        this.__userInput = false;
      }

      /**
       * A change event listener.
       * Override this method with an actual implementation.
       * @param {Event} _event
       * @protected
       * @override
       */
      _onChange(_event) {}

      /**
       * Toggle the has-value attribute based on the value property.
       * @param {boolean} hasValue
       * @protected
       */
      _toggleHasValue(hasValue) {
        this.toggleAttribute('has-value', hasValue);
      }

      /**
       * Observer called when a value property changes.
       * @param {string | undefined} newVal
       * @param {string | undefined} oldVal
       * @protected
       * @override
       */
      _valueChanged(newVal, oldVal) {
        this._toggleHasValue(newVal !== '' && newVal != null);

        // Setting initial value to empty string, do nothing.
        if (newVal === '' && oldVal === undefined) {
          return;
        }

        // Value is set by the user, no need to sync it back to input.
        if (this.__userInput) {
          return;
        }

        // Setting a value programmatically, sync it to input element.
        this._forwardInputValue(newVal);
      }
    }
);
