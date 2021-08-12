/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const InputMixinImplementation = (superclass) =>
  class InputMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * A reference to the input element controlled by the mixin.
         * Any component implementing this mixin is expected to provide it
         * by using `this._setInputElement(input)` Polymer API.
         *
         * A typical case is using this mixin in combination with `InputSlotMixin`,
         * although the input element does not have to always be native <input>.
         * As an example, <vaadin-combo-box-light> accepts other components.
         *
         * @protected
         * @type {!HTMLElement}
         */
        inputElement: {
          type: Object,
          readOnly: true,
          observer: '_inputElementChanged'
        }
      };
    }

    constructor() {
      super();

      this._boundOnInput = this._onInput.bind(this);
      this._boundOnChange = this._onChange.bind(this);
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

    /** @protected */
    _inputElementChanged(input, oldInput) {
      if (input) {
        this._addInputListeners(input);
      } else if (oldInput) {
        this._removeInputListeners(oldInput);
      }
    }

    /**
     * An input event listener.
     * Override this method with an actual implementation.
     * @param {Event} _event
     * @protected
     * @override
     */
    _onInput(_event) {}

    /**
     * A change event listener.
     * Override this method with an actual implementation.
     * @param {Event} _event
     * @protected
     * @override
     */
    _onChange(_event) {}
  };

/**
 * A mixin to store the reference to an input element
 * and add input and change event listeners to it.
 */
export const InputMixin = dedupingMixin(InputMixinImplementation);
