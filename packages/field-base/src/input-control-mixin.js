/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { FieldMixin } from './field-mixin.js';
import { InputConstraintsMixin } from './input-constraints-mixin.js';

/**
 * A mixin to provide shared logic for the editable form input controls.
 *
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes FieldMixin
 * @mixes InputConstraintsMixin
 * @mixes KeyboardMixin
 */
export const InputControlMixin = (superclass) =>
  class InputControlMixinClass extends DelegateFocusMixin(
    InputConstraintsMixin(FieldMixin(KeyboardMixin(superclass))),
  ) {
    static get properties() {
      return {
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
