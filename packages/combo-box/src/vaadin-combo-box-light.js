/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-combo-box-dropdown.js';
import { dashToCamelCase } from '@polymer/polymer/lib/utils/case-map.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxDataProviderMixin } from './vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from './vaadin-combo-box-mixin.js';

/**
 * `<vaadin-combo-box-light>` is a customizable version of the `<vaadin-combo-box>` providing
 * only the dropdown functionality and leaving the input field definition to the user.
 *
 * The element has the same API as `<vaadin-combo-box>`.
 *
 * To create a custom input field, you need to add a child element which has a two-way
 * data-bindable property representing the input value. The property name is expected
 * to be `value` by default. For example, you can use `<vaadin-text-field>` element:
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <vaadin-text-field></vaadin-text-field>
 * </vaadin-combo-box-light>
 * ```
 *
 * If you are using custom input field that has other property for value,
 * set `class="input"` to enable corresponding logic, and use `attr-for-value`
 * attribute to specify which property to use:
 *
 * ```html
 * <vaadin-combo-box-light attr-for-value="input-value">
 *   <custom-input class="input"></custom-input>
 * </vaadin-combo-box-light>
 * ```
 *
 * You can also pass custom toggle and clear buttons with corresponding classes:
 *
 * ```html
 * <vaadin-combo-box-light>
 *   <custom-input class="input" attr-for-value="input-value">
 *     <button slot="suffix" class="clear-button">Clear</button>
 *     <button slot="suffix" class="toggle-button">Toggle</button>
 *   </custom-input>
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
        restore-focus-on-close="[[__restoreFocusOnClose]]"
        restore-focus-node="[[inputElement]]"
        renderer="[[renderer]]"
        _focused-index="[[_focusedIndex]]"
        _item-id-path="[[itemIdPath]]"
        _item-label-path="[[itemLabelPath]]"
        loading="[[loading]]"
        theme="[[_theme]]"
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

  /** @protected */
  ready() {
    super.ready();
    this._toggleElement = this.querySelector('.toggle-button');
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._setInputElement(this.querySelector('vaadin-text-field,.input'));
    this._revertInputValue();
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    if (this.inputElement.validate) {
      return this.inputElement.validate();
    }
    return super.checkValidity();
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
      (event.type === 'input' && !event.isTrusted) || // Fake input event dispatched by clear button
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
