/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
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

  /** @private */
  __isItemSelected(item, _selectedItem, itemIdPath) {
    if (item instanceof ComboBoxPlaceholder) {
      return false;
    }

    if (this.comboBox.readonly) {
      return false;
    }

    const host = this.comboBox.getRootNode().host;
    return host._findIndex(item, host.selectedItems, itemIdPath) > -1;
  }

  /** @private */
  __updateElement(el, index) {
    super.__updateElement(el, index);

    el.toggleAttribute('readonly', this.comboBox.readonly);
  }
}

customElements.define(MultiSelectComboBoxScroller.is, MultiSelectComboBoxScroller);
