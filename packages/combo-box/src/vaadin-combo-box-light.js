/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxDataProviderMixin } from '@vaadin/vaadin-combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import '@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown-wrapper.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';

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

  /**
   * @return {string}
   * @protected
   */
  get _propertyForValue() {
    return dashToCamelCase(this.attrForValue);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    const cssSelector = 'vaadin-text-field,iron-input,paper-input,.paper-input-input,.input';
    this._setInputElement(this.querySelector(cssSelector));
    this._revertInputValue();
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

export { ComboBoxLight };
