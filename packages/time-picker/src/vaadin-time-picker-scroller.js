/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ComboBoxScroller } from '@vaadin/combo-box/src/vaadin-combo-box-scroller.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @extends ComboBoxScroller
 * @private
 */
class TimePickerScroller extends ComboBoxScroller {
  static get is() {
    return 'vaadin-time-picker-scroller';
  }
}

customElements.define(TimePickerScroller.is, TimePickerScroller);
