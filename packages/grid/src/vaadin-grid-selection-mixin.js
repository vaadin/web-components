/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const SelectionMixin = (superClass) =>
  class SelectionMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array that contains the selected items.
         * @type {!Array<!GridItem>}
         */
        selectedItems: {
          type: Object,
          notify: true,
          value: () => [],
          sync: true,
        },

        /**
         * A function to check whether a specific item in the grid may be
         * selected or deselected by the user. Used by the selection column to
         * conditionally enable to disable checkboxes for individual items. This
         * function does not prevent programmatic selection/deselection of
         * items. Changing the function does not modify the currently selected
         * items.
         *
         * Configuring this function hides the select all checkbox of the grid
         * selection column, which means users can not select or deselect all
         * items anymore, nor do they get feedback on whether all items are
         * selected or not.
         *
         * Receives an item instance and should return a boolean indicating
         * whether users may change the selection state of that item.
         *
         * @type {(item: !GridItem) => boolean}
         */
        isItemSelectable: {
          type: Function,
        },

        /**
         * Set of selected item ids
         * @private
         */
        __selectedKeys: {
          type: Object,
          computed: '__computeSelectedKeys(itemIdPath, selectedItems)',
        },
      };
    }

    static get observers() {
      return ['__selectedItemsChanged(itemIdPath, selectedItems, isItemSelectable)'];
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isSelected(item) {
      return this.__selectedKeys.has(this.getItemId(item));
    }

    /**
     * Determines whether the selection state of an item may be changed by the
     * user.
     *
     * @private
     */
    __isItemSelectable(item) {
      // Item is selectable by default if isItemSelectable is not configured
      if (!this.isItemSelectable || !item) {
        return true;
      }

      // Otherwise, check isItemSelectable function
      return this.isItemSelectable(item);
    }

    /**
     * Selects the given item.
     *
     * @method selectItem
     * @param {!GridItem} item The item object
     */
    selectItem(item) {
      if (!this._isSelected(item)) {
        this.selectedItems = [...this.selectedItems, item];
      }
    }

    /**
     * Deselects the given item if it is already selected.
     *
     * @method deselect
     * @param {!GridItem} item The item object
     */
    deselectItem(item) {
      if (this._isSelected(item)) {
        this.selectedItems = this.selectedItems.filter((i) => !this._itemsEqual(i, item));
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('isItemSelectable')) {
        /** @internal to not document it in CEM */
        this.dispatchEvent(new CustomEvent('is-item-selectable-changed'));
      }
    }

    /** @private */
    __selectedItemsChanged() {
      this._getRenderedRows().forEach((row) => {
        if (
          row.hasAttribute('selected') !== this._isSelected(row._item) ||
          row.hasAttribute('nonselectable') !== !this.__isItemSelectable(row._item)
        ) {
          this.__updateRow(row);
        }
      });
    }

    /** @private */
    __computeSelectedKeys(_itemIdPath, selectedItems) {
      const selected = selectedItems || [];
      const selectedKeys = new Set();
      selected.forEach((item) => {
        selectedKeys.add(this.getItemId(item));
      });

      return selectedKeys;
    }
  };
