/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { getFlattenedElements } from '@vaadin/component-base/src/dom-utils.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';

/**
 * Default implementation of the parse function that creates individual field
 * values from the single component value.
 * @param value
 * @returns {*}
 */
const defaultParseValue = (value) => {
  return value.split('\t');
};

/**
 * Default implementation of the format function that creates a single component
 * value from individual field values.
 * @param inputValues
 * @returns {*}
 */
const defaultFormatValue = (inputValues) => {
  return inputValues.join('\t');
};

/**
 * @polymerMixin
 * @mixes FieldMixin
 * @mixes FocusMixin
 * @mixes KeyboardMixin
 */
export const CustomFieldMixin = (superClass) =>
  class CustomFieldMixin extends FieldMixin(FocusMixin(KeyboardMixin(superClass))) {
    static get properties() {
      return {
        /**
         * The name of the control, which is submitted with the form data.
         */
        name: String,

        /**
         * The value of the field. When wrapping several inputs, it will contain `\t`
         * (Tab character) as a delimiter indicating parts intended to be used as the
         * corresponding inputs values.
         * Use the [`formatValue`](#/elements/vaadin-custom-field#property-formatValue)
         * and [`parseValue`](#/elements/vaadin-custom-field#property-parseValue)
         * properties to customize this behavior.
         */
        value: {
          type: String,
          observer: '__valueChanged',
          notify: true,
          sync: true,
        },

        /**
         * Array of available input nodes
         * @type {!Array<!HTMLElement> | undefined}
         */
        inputs: {
          type: Array,
          readOnly: true,
          observer: '__inputsChanged',
        },

        /**
         * A function to format the values of the individual fields contained by
         * the custom field into a single component value. The function receives
         * an array of all values of the individual fields in the order of their
         * presence in the DOM, and must return a single component value.
         * This function is called each time a value of an internal field is
         * changed.
         *
         * Example:
         * ```js
         * customField.formatValue = (fieldValues) => {
         *   return fieldValues.join("-");
         * }
         * ```
         * @type {!CustomFieldFormatValueFn | undefined}
         */
        formatValue: {
          type: Function,
        },

        /**
         * A function to parse the component value into values for the individual
         * fields contained by the custom field. The function receives the
         * component value, and must return an array of values for the individual
         * fields in the order of their presence in the DOM.
         * The function is called each time the value of the component changes.
         *
         * Example:
         * ```js
         * customField.parseValue = (componentValue) => {
         *   return componentValue.split("-");
         * }
         * ```
         * @type {!CustomFieldParseValueFn | undefined}
         */
        parseValue: {
          type: Function,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();

      // See https://github.com/vaadin/vaadin-web-components/issues/94
      this.setAttribute('role', 'group');

      this.ariaTarget = this;

      this.__childrenObserver = new MutationObserver(() => {
        this.__setInputsFromSlot();
      });

      this.__setInputsFromSlot();
      this.$.slot.addEventListener('slotchange', () => {
        this.__setInputsFromSlot();

        // Observe changes to any children except inputs
        // to allow wrapping `<input>` with `<div>` etc.
        getFlattenedElements(this.$.slot)
          .filter((el) => !this.__isInput(el))
          .forEach((el) => {
            this.__childrenObserver.observe(el, { childList: true });
          });
      });

      this._tooltipController = new TooltipController(this);
      this.addController(this._tooltipController);
      this._tooltipController.setShouldShow((target) => {
        const inputs = target.inputs || [];
        return !inputs.some((el) => el.opened);
      });
    }

    /** @protected */
    focus() {
      if (this.inputs && this.inputs[0]) {
        this.inputs[0].focus();
      }
    }

    /**
     * Override method inherited from `FocusMixin` to validate on blur.
     * @param {boolean} focused
     * @protected
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused) {
        this._requestValidation();
      }
    }

    /**
     * Override method inherited from `FocusMixin` to not remove focused
     * state when focus moves to another input in the custom field.
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     */
    _shouldRemoveFocus(event) {
      const { relatedTarget } = event;
      return !this.inputs || !this.inputs.some((el) => relatedTarget === (el.focusElement || el));
    }

    /**
     * Returns true if the current inputs values satisfy all constraints (if any).
     *
     * @return {boolean}
     */
    checkValidity() {
      const hasInvalidFields =
        this.inputs && this.inputs.some((input) => !(input.validate || input.checkValidity).call(input));

      if (hasInvalidFields || (this.required && !(this.value && this.value.trim()))) {
        // Either 1. one of the input fields is invalid or
        // 2. the custom field itself is required but doesn't have a value
        return false;
      }
      return true;
    }

    /**
     * Override an observer from `FieldMixin`
     * to validate when required is removed.
     *
     * @protected
     * @override
     */
    _requiredChanged(required) {
      super._requiredChanged(required);

      if (required === false) {
        this._requestValidation();
      }
    }

    /**
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onKeyDown(e) {
      if (e.key === 'Tab') {
        const inputs = this.inputs || [];
        if (
          (inputs.indexOf(e.target) < inputs.length - 1 && !e.shiftKey) ||
          (inputs.indexOf(e.target) > 0 && e.shiftKey)
        ) {
          this.dispatchEvent(new CustomEvent('internal-tab'));
        } else {
          // FIXME(yuriy): remove this workaround when value should not be updated before focusout
          this.__setValue();
        }
      }
    }

    /** @protected */
    _onInputChange(event) {
      // Stop native change events
      event.stopPropagation();

      this.__setValue();
      this._requestValidation();
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          cancelable: false,
          detail: {
            value: this.value,
          },
        }),
      );
    }

    /** @private */
    __setValue() {
      this.__settingValue = true;
      const formatFn = this.formatValue || defaultFormatValue;
      this.value = formatFn.apply(this, [this.inputs.map((input) => input.value)]);
      this.__settingValue = false;
    }

    /** @private */
    __isInput(node) {
      const isSlottedInput = node.getAttribute('slot') === 'input' || node.getAttribute('slot') === 'textarea';
      return !isSlottedInput && (node.validate || node.checkValidity);
    }

    /** @private */
    __getInputsFromSlot() {
      return getFlattenedElements(this.$.slot).filter((node) => this.__isInput(node));
    }

    /** @private */
    __setInputsFromSlot() {
      this._setInputs(this.__getInputsFromSlot());
    }

    /** @private */
    __inputsChanged(inputs, oldInputs) {
      if (inputs.length === 0) {
        if (oldInputs && oldInputs.length > 0) {
          this.__setValue();
        }
        return;
      }

      // When inputs are first initialized, apply value set with property.
      if (this.value && this.value !== '\t' && (!oldInputs || oldInputs.length === 0)) {
        this.__applyInputsValue(this.value);
      } else {
        this.__setValue();
      }
    }

    /** @private */
    __toggleHasValue(value) {
      this.toggleAttribute('has-value', value !== null && value.trim() !== '');
    }

    /** @private */
    __valueChanged(value, oldValue) {
      this.__toggleHasValue(value);

      if (this.__settingValue || !this.inputs) {
        return;
      }

      this.__applyInputsValue(value || '\t');

      if (oldValue !== undefined) {
        this._requestValidation();
      }
    }

    /** @private */
    __applyInputsValue(value) {
      const parseFn = this.parseValue || defaultParseValue;
      const valuesArray = parseFn.apply(this, [value]);

      if (!valuesArray || valuesArray.length === 0) {
        console.warn('Value parser has not provided values array');
        return;
      }

      this.inputs.forEach((input, idx) => {
        input.value = valuesArray[idx];
      });
    }
  };
