/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('aria-multiselectable', 'true');
  }

  /**
   * @protected
   * @override
   */
  _isItemSelected(item, _selectedItem, itemIdPath) {
    if (item instanceof ComboBoxPlaceholder) {
      return false;
    }

    if (this.comboBox.readonly) {
      return false;
    }

    return this.comboBox._findIndex(item, this.comboBox.selectedItems, itemIdPath) > -1;
  }

  /** @private */
  __updateElement(el, index) {
    super.__updateElement(el, index);

    el.toggleAttribute('readonly', this.comboBox.readonly);
  }
}

customElements.define(MultiSelectComboBoxScroller.is, MultiSelectComboBoxScroller);
