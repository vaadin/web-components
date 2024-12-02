/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridSelectionColumnBaseMixin } from './vaadin-grid-selection-column-base-mixin.js';

/**
 * @polymerMixin
 * @mixes GridSelectionColumnBaseMixin
 */
export const GridSelectionColumnMixin = (superClass) =>
  class extends GridSelectionColumnBaseMixin(superClass) {
    static get properties() {
      return {
        /**
         * The previous state of activeItem. When activeItem turns to `null`,
         * previousActiveItem will have an Object with just unselected activeItem
         * @private
         */
        __previousActiveItem: Object,

        /**
         * When true, a range of rows can be selected with Shift + Click.
         *
         * NOTE: Only supported when using the array data provider. For other cases,
         * range selection must be implemented manually.
         */
        rangeSelect: {
          type: Boolean,
          value: false,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__onSelectAllChanged(selectAll)'];
    }

    constructor() {
      super();

      this.__boundUpdateSelectAllVisibility = this.__updateSelectAllVisibility.bind(this);
      this.__boundOnSelectedItemsChanged = this.__onSelectedItemsChanged.bind(this);
    }

    /** @protected */
    disconnectedCallback() {
      this._grid.removeEventListener('data-provider-changed', this.__boundUpdateSelectAllVisibility);
      this._grid.removeEventListener('is-item-selectable-changed', this.__boundUpdateSelectAllVisibility);
      this._grid.removeEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
      this._grid.removeEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);

      super.disconnectedCallback();
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      if (this._grid) {
        this._grid.addEventListener('data-provider-changed', this.__boundUpdateSelectAllVisibility);
        this._grid.addEventListener('is-item-selectable-changed', this.__boundUpdateSelectAllVisibility);
        this._grid.addEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
        this._grid.addEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);
        this.__updateSelectAllVisibility();
      }
    }

    /** @private */
    __onSelectAllChanged(selectAll) {
      if (selectAll === undefined || !this._grid) {
        return;
      }

      if (!this.__selectAllInitialized) {
        // The initial value for selectAll property was applied, avoid clearing pre-selected items
        this.__selectAllInitialized = true;
        return;
      }

      if (this._selectAllChangeLock) {
        return;
      }

      if (selectAll && this.__hasArrayDataProvider()) {
        this.__withFilteredItemsArray((items) => {
          this._grid.selectedItems = items;
        });
      } else {
        this._grid.selectedItems = [];
      }
    }

    /**
     * Override a method from `GridSelectionColumnBaseMixin` to handle the user
     * selecting all items.
     *
     * @protected
     * @override
     */
    _selectAll() {
      this.selectAll = true;
    }

    /**
     * Override a method from `GridSelectionColumnBaseMixin` to handle the user
     * deselecting all items.
     *
     * @protected
     * @override
     */
    _deselectAll() {
      this.selectAll = false;
    }

    /**
     * Override a method from `GridSelectionColumnBaseMixin` to handle the user
     * selecting an item.
     *
     * @param {Object} item the item to select
     * @protected
     * @override
     */
    _selectItem(item) {
      if (this._grid.__isItemSelectable(item)) {
        this._grid.selectItem(item);
        this._grid.dispatchEvent(
          new CustomEvent('item-selected', {
            detail: {
              item,
              shiftKey: this._shiftKeyDown,
            },
          }),
        );

        if (this.rangeSelect && this.__hasArrayDataProvider) {
          this.__rangeStartItem ??= item;
          if (this._shiftKeyDown) {
            this.__selectRange(this.__rangeStartItem, item);
          }
          this.__rangeStartItem = item;
        }
      }
    }

    /**
     * Override a method from `GridSelectionColumnBaseMixin` to handle the user
     * deselecting an item.
     *
     * @param {Object} item the item to deselect
     * @protected
     * @override
     */
    _deselectItem(item) {
      if (this._grid.__isItemSelectable(item)) {
        this._grid.deselectItem(item);
        this._grid.dispatchEvent(
          new CustomEvent('item-deselected', {
            detail: {
              item,
              shiftKey: this._shiftKeyDown,
            },
          }),
        );

        if (this.rangeSelect && this.__hasArrayDataProvider) {
          this.__rangeStartItem ??= item;
          if (this._shiftKeyDown) {
            this.__deselectRange(this.__rangeStartItem, item);
          }
          this.__rangeStartItem = item;
        }
      }
    }

    __selectRange(startItem, endItem) {
      this.__fetchSelectionRange([startItem, endItem], (items) => {
        this._grid.__selectItems(items);
      });
    }

    __deselectRange(startItem, endItem) {
      this.__fetchSelectionRange([startItem, endItem], (items) => {
        this._grid.__deselectItems(items);
      });
    }

    /** @private */
    __hasArrayDataProvider() {
      return Array.isArray(this._grid.items) && !!this._grid.dataProvider;
    }

    /** @private */
    __onSelectedItemsChanged() {
      this._selectAllChangeLock = true;
      if (this.__hasArrayDataProvider()) {
        this.__withFilteredItemsArray((items) => {
          if (!this._grid.selectedItems.length) {
            this.selectAll = false;
            this._indeterminate = false;
          } else if (items.every((item) => this._grid._isSelected(item))) {
            this.selectAll = true;
            this._indeterminate = false;
          } else {
            this.selectAll = false;
            this._indeterminate = true;
          }
        });
      }
      this._selectAllChangeLock = false;
    }

    /** @private */
    __updateSelectAllVisibility() {
      // Hide select all checkbox when we can not easily determine the select all checkbox state:
      // - When using a custom data provider
      // - When using conditional selection, where users may not select all items
      this._selectAllHidden = !Array.isArray(this._grid.items) || !!this._grid.isItemSelectable;
    }

    /**
     * Assuming the grid uses an items array data provider, fetches all the filtered items
     * from the data provider and invokes the callback with the resulting array.
     *
     * @private
     */
    __withFilteredItemsArray(callback) {
      const params = {
        page: 0,
        pageSize: Infinity,
        sortOrders: this._grid._mapSorters(),
        filters: this._grid._mapFilters(),
      };
      this._grid.dataProvider(params, (items) => callback(items));
    }

    /** @private */
    __fetchSelectionRange([startItem, endItem], callback) {
      this.__withFilteredItemsArray((items) => {
        const range = new Set();
        items.forEach((item) => {
          if (!this._grid.__isItemSelectable(item)) {
            return;
          }
          if (this._grid._itemsEqual(item, startItem)) {
            range.add(startItem);
          } else if (this._grid._itemsEqual(item, endItem)) {
            range.add(endItem);
          } else if (range.has(startItem) && !range.has(endItem)) {
            range.add(item);
          } else if (!range.has(startItem) && range.has(endItem)) {
            range.add(item);
          }
        });
        callback([...range]);
      });
    }
  };
