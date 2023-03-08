/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-time-picker-item.js';
import './vaadin-time-picker-scroller.js';
import './vaadin-time-picker-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ComboBoxMixin } from '@vaadin/combo-box/src/vaadin-combo-box-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ComboBoxMixin
 * @mixes ThemableMixin
 * @private
 */
class TimePickerComboBox extends ComboBoxMixin(ThemableMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-time-picker-combo-box';
  }

  static get template() {
    return html`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-time-picker-overlay
        id="overlay"
        opened="[[_overlayOpened]]"
        loading$="[[loading]]"
        theme$="[[_theme]]"
        position-target="[[positionTarget]]"
        no-vertical-overlap
        restore-focus-node="[[inputElement]]"
      ></vaadin-time-picker-overlay>
    `;
  }

  static get properties() {
    return {
      positionTarget: {
        type: Object,
      },
    };
  }

  /**
   * Tag name prefix used by scroller and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-time-picker';
  }

  /**
   * Reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('[part="clear-button"]');
  }

  /**
   * @override
   * @protected
   */
  get _inputElementValue() {
    return super._inputElementValue;
  }

  /**
   * The setter is overridden to ensure the `_hasInputValue` property
   * doesn't wrongly indicate true after the input element's value
   * is reverted or cleared programmatically.
   *
   * @override
   * @protected
   */
  set _inputElementValue(value) {
    super._inputElementValue = value;
    this._hasInputValue = value.length > 0;
  }

  /** @protected */
  ready() {
    super.ready();

    this.allowCustomValue = true;
    this._toggleElement = this.querySelector('.toggle-button');

    // See https://github.com/vaadin/vaadin-time-picker/issues/145
    this.setAttribute('dir', 'ltr');
  }
}

customElements.define(TimePickerComboBox.is, TimePickerComboBox);
