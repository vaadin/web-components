/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ComboBoxLight } from '@vaadin/vaadin-combo-box/src/vaadin-combo-box-light.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @extends ComboBoxLight
 * @private
 */
class TimePickerComboBox extends ComboBoxLight {
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

      <vaadin-combo-box-dropdown
        id="dropdown"
        opened="[[opened]]"
        position-target="[[positionTarget]]"
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
      positionTarget: {
        type: Object
      }
    };
  }

  /**
   * Reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('[part="clear-button"]');
  }

  /** @protected */
  ready() {
    super.ready();

    this.allowCustomValue = true;

    // See https://github.com/vaadin/vaadin-time-picker/issues/145
    this.setAttribute('dir', 'ltr');
  }
}

customElements.define(TimePickerComboBox.is, TimePickerComboBox);
