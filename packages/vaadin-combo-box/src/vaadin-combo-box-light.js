/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';
import './vaadin-combo-box-dropdown.js';

/**
 * `<vaadin-combo-box-light>` is a customizable version of the `<vaadin-combo-box>` providing
 * only the dropdown functionality and leaving the input field definition to the user.
 *
 * The element has the same API as `<vaadin-combo-box>`.
 *
 * To create a custom input field, you need to add a child element which has a two-way
 * data-bindable property representing the input value. The property name is expected
 * to be `value` by default. See the example below for a simplest possible example
 * using a `<vaadin-text-field>` element.
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <vaadin-text-field>
 *   </vaadin-text-field>
 * </vaadin-combo-box-light>
 * ```
 *
 * If you are using other custom input fields like `<iron-input>`, you
 * need to define the name of the bindable property with the `attrForValue` attribute.
 *
 * ```html
 * <vaadin-combo-box-light attr-for-value="bind-value">
 *   <iron-input>
 *     <input>
 *   </iron-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * In the next example you can see how to create a custom input field based
 * on a `<paper-input>` decorated with a custom `<iron-icon>` and
 * two `<paper-button>`s to act as the clear and toggle controls.
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <paper-input label="Elements" class="input">
 *     <iron-icon icon="toll" slot="prefix"></iron-icon>
 *     <paper-button slot="suffix" class="clear-button">Clear</paper-button>
 *     <paper-button slot="suffix" class="toggle-button">Toggle</paper-button>
 *   </paper-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} custom-value-set - Fired when the user sets a custom value.
 * @fires {CustomEvent} filter-changed - Fired when the `filter` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} selected-item-changed - Fired when the `selectedItem` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 * @mixes ThemableMixin
 */
class ComboBoxLight extends ComboBoxDataProviderMixin(ComboBoxMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-combo-box-light';
  }

  static get template() {
    return html`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-combo-box-dropdown
        id="dropdown"
        opened="[[opened]]"
        position-target="[[inputElement]]"
        renderer="[[renderer]]"
        _focused-index="[[_focusedIndex]]"
        _item-id-path="[[itemIdPath]]"
        _item-label-path="[[itemLabelPath]]"
        loading="[[loading]]"
        theme="[[theme]]"
      ></vaadin-combo-box-dropdown>
    `;
  }

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
        value: 'value'
      }
    };
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('.clear-button');
  }

  /** @protected */
  ready() {
    super.ready();

    this._toggleElement = this.querySelector('.toggle-button');

    if (this.clearElement) {
      this.clearElement.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent native focus changes
        // _focusableElement is needed for paper-input
        (this.inputElement._focusableElement || this.inputElement).focus();
      });
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    const cssSelector = 'vaadin-text-field,iron-input,paper-input,.paper-input-input,.input';
    this._setInputElement(this.querySelector(cssSelector));
    this._revertInputValue();
    this._preventInputBlur();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    this._restoreInputBlur();
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    if (this.inputElement.validate) {
      return this.inputElement.validate();
    } else {
      return super.checkValidity();
    }
  }

  /**
   * @return {string}
   * @protected
   */
  get _propertyForValue() {
    return dashToCamelCase(this.attrForValue);
  }

  /** @protected */
  _isClearButton(event) {
    return (
      super._isClearButton(event) ||
      event.__fromClearButton ||
      (event.detail && event.detail.sourceEvent && event.detail.sourceEvent.__fromClearButton) ||
      event.composedPath()[0].getAttribute('part') === 'clear-button'
    );
  }

  /**
   * @param {!Event} event
   * @protected
   */
  _onChange(event) {
    super._onChange(event);

    if (this._isClearButton(event)) {
      this._clear();
    }
  }
}

customElements.define(ComboBoxLight.is, ComboBoxLight);

export { ComboBoxLight };
