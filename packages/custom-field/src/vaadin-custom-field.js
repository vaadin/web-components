/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

class CustomField extends FieldMixin(FocusMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-custom-field';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
        }

        :host::before {
          content: '\\2003';
          width: 0;
          display: inline-block;
          /* Size and position this element on the same vertical position as the input-field element
           to make vertical align for the host element work as expected */
        }

        :host([hidden]) {
          display: none !important;
        }

        .vaadin-custom-field-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .inputs-wrapper {
          flex: none;
        }
      </style>

      <div class="vaadin-custom-field-container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div class="inputs-wrapper" on-change="__onInputChange">
          <slot id="slot"></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * The name of the control, which is submitted with the form data.
       */
      name: String,

      /**
       * The value of the field. When wrapping several inputs, it will contain `\t`
       * (Tab character) as a delimiter indicating parts intended to be used as the
       * corresponding inputs values. Use the [`i18n`](#/elements/vaadin-custom-field#property-i18n)
       * property to customize this behavior.
       */
      value: {
        type: String,
        observer: '__valueChanged',
        notify: true
      },

      /**
       * Array of available input nodes
       * @type {!Array<!HTMLElement> | undefined}
       */
      inputs: {
        type: Array,
        readOnly: true
      },

      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure:
       *
       * ```
       * {
       *   // A function to format given `Array` as
       *   // component value. Array is list of all internal values
       *   // in the order of their presence in the DOM
       *   // This function is called each time the internal input
       *   // value is changed.
       *   formatValue: inputValues => {
       *     // returns a representation of the given array of values
       *     // in the form of string with delimiter characters
       *   },
       *
       *   // A function to parse the given value to an `Array` in the format
       *   // of the list of all internal values
       *   // in the order of their presence in the DOM
       *   // This function is called when value of the
       *   // custom field is set.
       *   parseValue: value => {
       *     // returns the array of values from parsed value string.
       *   }
       * }
       * ```
       *
       * @type {!CustomFieldI18n}
       */
      i18n: {
        type: Object,
        value: () => {
          return {
            parseValue: function (value) {
              return value.split('\t');
            },
            formatValue: function (inputValues) {
              return inputValues.join('\t');
            }
          };
        }
      }
    };
  }

  /**
   * Attribute used by `FieldAriaMixin` to set accessible name.
   * @protected
   */
  get _ariaAttr() {
    return 'aria-labelledby';
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (this.__observer) {
      this.__observer.connect();
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.__observer) {
      this.__observer.disconnect();
    }
  }

  /** @protected */
  ready() {
    super.ready();

    // See https://github.com/vaadin/vaadin-web-components/issues/94
    this.setAttribute('role', 'group');

    this.ariaTarget = this;

    this.__setInputsFromSlot();
    this.__observer = new FlattenedNodesObserver(this.$.slot, () => {
      this.__setInputsFromSlot();
    });

    this.__fixChromeFocus();
  }

  /** @protected */
  focus() {
    this.inputs && this.inputs[0] && this.inputs[0].focus();
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
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
    return !this.inputs.some((el) => relatedTarget === (el.focusElement || el));
  }

  /**
   * Returns true if the current inputs values satisfy all constraints (if any).
   *
   * @return {boolean}
   */
  checkValidity() {
    const invalidFields = this.inputs.filter((input) => !(input.validate || input.checkValidity).call(input));

    if (invalidFields.length || (this.required && !this.value.trim())) {
      // Either 1. one of the input fields is invalid or
      // 2. the custom field itself is required but doesn't have a value
      return false;
    }
    return true;
  }

  /** @private */
  __fixChromeFocus() {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.addEventListener('keydown', (e) => {
      if (e.keyCode === 9) {
        // FIXME(yuriy): remove this workaround once this issue is fixed:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1014868&can=2&num=100&q=slot%20shift%20tab
        if (e.target.parentElement.localName === 'slot' && !e.defaultPrevented && isChrome) {
          const slot = e.target.parentElement;
          slot.setAttribute('tabindex', -1);
          setTimeout(() => slot.removeAttribute('tabindex'));
        }
        if (
          (this.inputs.indexOf(e.target) < this.inputs.length - 1 && !e.shiftKey) ||
          (this.inputs.indexOf(e.target) > 0 && e.shiftKey)
        ) {
          this.dispatchEvent(new CustomEvent('internal-tab'));
        } else {
          // FIXME(yuriy): remove this workaround when value should not be updated before focusout
          this.__setValue();
        }
      }
    });
  }

  /** @private */
  __onInputChange(event) {
    // Stop native change events
    event.stopPropagation();

    this.__setValue();
    this.validate();
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: {
          value: this.value
        }
      })
    );
  }

  /** @private */
  __setValue() {
    this.__settingValue = true;
    this.value = this.i18n.formatValue.apply(this, [this.inputs.map((input) => input.value)]);
    this.__settingValue = false;
  }

  /**
   * Like querySelectorAll('*') but also gets all elements through any nested slots recursively
   * @private
   */
  __queryAllAssignedElements(elem) {
    const result = [];
    let elements;
    if (elem.tagName === 'SLOT') {
      elements = elem.assignedElements({ flatten: true });
    } else {
      result.push(elem);
      elements = Array.from(elem.children);
    }
    elements.forEach((elem) => result.push(...this.__queryAllAssignedElements(elem)));
    return result;
  }

  /** @private */
  __isInput(node) {
    const isSlottedInput = node.getAttribute('slot') === 'input' || node.getAttribute('slot') === 'textarea';
    return !isSlottedInput && (node.validate || node.checkValidity);
  }

  /** @private */
  __getInputsFromSlot() {
    return this.__queryAllAssignedElements(this.$.slot).filter((node) => this.__isInput(node));
  }

  /** @private */
  __setInputsFromSlot() {
    this._setInputs(this.__getInputsFromSlot());
    this.__setValue();
  }

  /** @private */
  __toggleHasValue(value) {
    this.toggleAttribute('has-value', value !== null && value.trim() !== '');
  }

  /** @private */
  __valueChanged(value, oldValue) {
    if (this.__settingValue || !this.inputs) {
      return;
    }

    this.__toggleHasValue(value);

    const valuesArray = this.i18n.parseValue(value);
    if (!valuesArray || valuesArray.length == 0) {
      console.warn('Value parser has not provided values array');
      return;
    }

    this.inputs.forEach((input, id) => (input.value = valuesArray[id]));
    if (oldValue !== undefined) {
      this.validate();
    }
  }
}

export { CustomField };
