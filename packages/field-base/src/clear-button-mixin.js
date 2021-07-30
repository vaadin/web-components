/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { InputMixin } from './input-mixin.js';

const ClearButtonMixinImplementation = (superclass) =>
  class ClearButtonMixinClass extends InputMixin(superclass) {
    static get properties() {
      return {
        /**
         * Set to true to display the clear icon which clears the input.
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: true,
          value: false
        }
      };
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
    get _clearOnEsc() {
      return true;
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('keydown', (e) => this._onKeyDown(e));

      if (this.clearElement) {
        this.clearElement.addEventListener('click', this._onClearButtonClick.bind(this));
      }
    }

    /**
     * Clear the value of this field.
     */
    clear() {
      this.value = this._inputNode.value = '';
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this._inputNode.focus();
      this.clear();
      const inputEvent = new Event('input', { bubbles: true, composed: true });
      const changeEvent = new Event('change', { bubbles: true });
      this._inputNode.dispatchEvent(inputEvent);
      this._inputNode.dispatchEvent(changeEvent);
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onKeyDown(event) {
      if (event.key === 'Escape' && this.clearButtonVisible && this._clearOnEsc) {
        const dispatchChange = !!this.value;
        this.clear();
        dispatchChange && this._inputNode.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

/**
 * A mixin to add clear button support to field components.
 */
export const ClearButtonMixin = dedupingMixin(ClearButtonMixinImplementation);
