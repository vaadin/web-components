/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { InputMixin } from './input-mixin.js';

/**
 * A mixin that manages the clear button.
 *
 * @polymerMixin
 * @mixes InputMixin
 * @mixes KeyboardMixin
 */
export const ClearButtonMixin = (superclass) =>
  class ClearButtonMixinClass extends InputMixin(KeyboardMixin(superclass)) {
    static get properties() {
      return {
        /**
         * Set to true to display the clear icon which clears the input.
         *
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: true,
          value: false,
        },
      };
    }

    /**
     * Any element extending this mixin is required to implement this getter.
     * It returns the reference to the clear button element.
     *
     * @protected
     * @return {Element | null | undefined}
     */
    get clearElement() {
      console.warn(`Please implement the 'clearElement' property in <${this.localName}>`);
      return null;
    }

    /** @protected */
    ready() {
      super.ready();

      if (this.clearElement) {
        this.clearElement.addEventListener('click', (event) => this._onClearButtonClick(event));
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this.inputElement.focus();
      this._onClearAction();
    }

    /**
     * Override an event listener inherited from `KeydownMixin` to clear on Esc.
     * Components that extend this mixin can prevent this behavior by overriding
     * this method without calling `super._onEscape` to provide custom logic.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      super._onEscape(event);

      if (this.clearButtonVisible && !!this.value) {
        event.stopPropagation();
        this._onClearAction();
      }
    }

    /** @protected */
    _onClearAction() {
      this.clear();
      this.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };
