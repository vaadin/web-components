/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxScroller } from '@vaadin/combo-box/src/vaadin-combo-box-scroller.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @extends ComboBoxScroller
 * @private
 */
class MultiSelectComboBoxScroller extends ComboBoxScroller {
  static get is() {
    return 'vaadin-multi-select-combo-box-scroller';
  }
}

customElements.define(MultiSelectComboBoxScroller.is, MultiSelectComboBoxScroller);
