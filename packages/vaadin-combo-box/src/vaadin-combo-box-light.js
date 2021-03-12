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
import './vaadin-combo-box-dropdown-wrapper.js';

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
class ComboBoxLightElement extends ThemableMixin(ComboBoxDataProviderMixin(ComboBoxMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-combo-box-dropdown-wrapper
        id="overlay"
        opened="[[opened]]"
        position-target="[[inputElement]]"
        renderer="[[renderer]]"
        _focused-index="[[_focusedIndex]]"
        _item-id-path="[[itemIdPath]]"
        _item-label-path="[[itemLabelPath]]"
        loading="[[loading]]"
        theme="[[theme]]"
      ></vaadin-combo-box-dropdown-wrapper>
    `;
  }

  static get is() {
    return 'vaadin-combo-box-light';
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
      },

      /**
       * @type {!Element | undefined}
       */
      inputElement: {
        type: Element,
        readOnly: true
      }
    };
  }

  constructor() {
    super();
    this._boundInputValueChanged = this._inputValueChanged.bind(this);
    this.__boundInputValueCommitted = this.__inputValueCommitted.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();
    this._toggleElement = this.querySelector('.toggle-button');
    this._clearElement = this.querySelector('.clear-button');

    if (this._clearElement) {
      this._clearElement.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent native focus changes
        // _focusableElement is needed for paper-input
        (this.inputElement._focusableElement || this.inputElement).focus();
      });
    }
  }

  /**
   * @return {boolean}
   */
  get focused() {
    return this.getRootNode().activeElement === this.inputElement;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    const cssSelector = 'vaadin-text-field,iron-input,paper-input,.paper-input-input,.input';
    this._setInputElement(this.querySelector(cssSelector));
    this._revertInputValue();
    this.inputElement.addEventListener('input', this._boundInputValueChanged);
    this.inputElement.addEventListener('change', this.__boundInputValueCommitted);
    this._preventInputBlur();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.inputElement.removeEventListener('input', this._boundInputValueChanged);
    this.inputElement.removeEventListener('change', this.__boundInputValueCommitted);
    this._restoreInputBlur();
  }

  /** @private */
  __inputValueCommitted(e) {
    // Detect if the input was cleared (by clicking the clear button on a vaadin-text-field)
    // and propagate the value change to combo box value immediately.
    if (e.__fromClearButton) {
      this._clear();
    }
  }

  /**
   * @return {string}
   * @protected
   */
  get _propertyForValue() {
    return dashToCamelCase(this.attrForValue);
  }

  /**
   * @return {string}
   * @protected
   */
  get _inputElementValue() {
    return this.inputElement && this.inputElement[this._propertyForValue];
  }

  /**
   * @param {string} value
   * @protected
   */
  set _inputElementValue(value) {
    if (this.inputElement) {
      this.inputElement[this._propertyForValue] = value;
    }
  }
}

customElements.define(ComboBoxLightElement.is, ComboBoxLightElement);

export { ComboBoxLightElement };
