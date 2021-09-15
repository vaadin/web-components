/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
