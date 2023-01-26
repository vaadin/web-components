/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
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

    if (this.owner.readonly) {
      return false;
    }

    return this.owner._findIndex(item, this.owner.selectedItems, itemIdPath) > -1;
  }

  /** @private */
  __updateElement(el, index) {
    super.__updateElement(el, index);

    el.toggleAttribute('readonly', this.owner.readonly);
  }
}

customElements.define(MultiSelectComboBoxScroller.is, MultiSelectComboBoxScroller);
