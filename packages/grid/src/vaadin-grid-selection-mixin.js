/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
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
        },

        /**
         * Set of selected item ids
         * @private
         */
        __selectedKeys: {
          type: Object,
          value: () => new Set(),
        },
      };
    }

    static get observers() {
      return [
        '_updateSelectionForItemIdPathChange(itemIdPath)',
        '_updateSelectionForSelectedItemsChange(selectedItems.*)',
      ];
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

    /**
     * Toggles the selected state of the given item.
     *
     * @method toggle
     * @param {!GridItem} item The item object
     * @protected
     */
    _toggleItem(item) {
      if (!this._isSelected(item)) {
        this.selectItem(item);
      } else {
        this.deselectItem(item);
      }
    }

    /** @private */
    _updateSelectionForItemIdPathChange() {
      this.__cacheSelectedKeys();
    }

    /** @private */
    _updateSelectionForSelectedItemsChange() {
      this.__cacheSelectedKeys();
      this.requestContentUpdate();
    }

    /** @private */
    __cacheSelectedKeys() {
      const selectedItems = this.selectedItems || [];
      this.__selectedKeys = new Set();
      selectedItems.forEach((item) => {
        this.__selectedKeys.add(this.getItemId(item));
      });
    }

    /**
     * Fired when the `selectedItems` property changes.
     *
     * @event selected-items-changed
     */
  };
