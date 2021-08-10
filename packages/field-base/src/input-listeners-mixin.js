/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const InputListenersMixinImplementation = (superclass) =>
  class InputListenersMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * A reference to the input element.
         * @type {!HTMLInputElement}
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
     * @param {!HTMLInputElement} input
     */
    _addInputListeners(input) {
      input.addEventListener('input', this._boundOnInput);
      input.addEventListener('change', this._boundOnChange);
    }

    /** @protected */
    _inputElementChanged(input) {
      if (input) {
        this._addInputListeners(input);
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
 * A mixin to add event listeners to the input element.
 */
export const InputListenersMixin = dedupingMixin(InputListenersMixinImplementation);
