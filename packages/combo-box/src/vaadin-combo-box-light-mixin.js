/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { ValidateMixin } from '@vaadin/field-base/src/validate-mixin.js';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';

/**
 * @polymerMixin
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 * @mixes ValidateMixin
 */
export const ComboBoxLightMixin = (superClass) =>
  class ComboBoxLightMixinClass extends ComboBoxDataProviderMixin(ComboBoxMixin(ValidateMixin(superClass))) {
    static get properties() {
      return {
        /**
         * Name of the two-way data-bindable property representing the
         * value of the custom input field.
         * @attr {string} attr-for-value
         * @type {string}
         */
        attrForValue: {
          type: String,
          value: 'value',
        },
      };
    }

    /**
     * Used by `InputControlMixin` as a reference to the clear button element.
     * @protected
     * @return {!HTMLElement}
     */
    get clearElement() {
      return this.querySelector('.clear-button');
    }

    /**
     * Override this getter from `InputMixin` to allow using
     * an arbitrary property name instead of `value`
     * for accessing the input element's value.
     *
     * @protected
     * @override
     * @return {string}
     */
    get _inputElementValueProperty() {
      return dashToCamelCase(this.attrForValue);
    }

    /**
     * @protected
     * @override
     * @return {HTMLInputElement | undefined}
     */
    get _nativeInput() {
      const input = this.inputElement;

      if (input) {
        // Support `<input class="input">`
        if (input instanceof HTMLInputElement) {
          return input;
        }

        // Support `<input>` in light DOM (e.g. `vaadin-text-field`)
        const slottedInput = input.querySelector('input');
        if (slottedInput) {
          return slottedInput;
        }

        if (input.shadowRoot) {
          // Support `<input>` in Shadow DOM (e.g. `mwc-textfield`)
          const shadowInput = input.shadowRoot.querySelector('input');
          if (shadowInput) {
            return shadowInput;
          }
        }
      }

      return undefined;
    }

    /** @protected */
    ready() {
      super.ready();

      this._toggleElement = this.querySelector('.toggle-button');

      // Wait until the slotted input DOM is ready
      afterNextRender(this, () => {
        this._setInputElement(this.querySelector('vaadin-text-field,.input'));
        this._revertInputValue();
      });
    }

    /**
     * @protected
     * @override
     */
    _isClearButton(event) {
      return (
        super._isClearButton(event) ||
        (event.type === 'input' && !event.isTrusted) || // Fake input event dispatched by clear button
        event.composedPath()[0].getAttribute('part') === 'clear-button'
      );
    }

    /**
     * @protected
     * @override
     */
    _shouldRemoveFocus(event) {
      const isBlurringControlButtons = event.target === this._toggleElement || event.target === this.clearElement;
      const isFocusingInputElement = event.relatedTarget && event.relatedTarget === this._nativeInput;

      // prevent closing the overlay when moving focus from clear or toggle buttons to the internal input
      if (isBlurringControlButtons && isFocusingInputElement) {
        return false;
      }

      return super._shouldRemoveFocus(event);
    }
  };
