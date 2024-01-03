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
      };
    }

    static get observers() {
      return ['__onSelectAllChanged(selectAll)'];
    }

    constructor() {
      super();

      this.__boundOnActiveItemChanged = this.__onActiveItemChanged.bind(this);
      this.__boundOnDataProviderChanged = this.__onDataProviderChanged.bind(this);
      this.__boundOnSelectedItemsChanged = this.__onSelectedItemsChanged.bind(this);
    }

    /** @protected */
    disconnectedCallback() {
      this._grid.removeEventListener('active-item-changed', this.__boundOnActiveItemChanged);
      this._grid.removeEventListener('data-provider-changed', this.__boundOnDataProviderChanged);
      this._grid.removeEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
      this._grid.removeEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);

      super.disconnectedCallback();
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      if (this._grid) {
        this._grid.addEventListener('active-item-changed', this.__boundOnActiveItemChanged);
        this._grid.addEventListener('data-provider-changed', this.__boundOnDataProviderChanged);
        this._grid.addEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
        this._grid.addEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);
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
     * Return true if array `a` contains all the items in `b`
     * We need this when sorting or to preserve selection after filtering.
     * @private
     */
    __arrayContains(a, b) {
      return Array.isArray(a) && Array.isArray(b) && b.every((i) => a.includes(i));
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
      this._grid.selectItem(item);
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
      this._grid.deselectItem(item);
    }

    /** @private */
    __onActiveItemChanged(e) {
      const activeItem = e.detail.value;
      if (this.autoSelect) {
        const item = activeItem || this.__previousActiveItem;
        if (item) {
          this._grid._toggleItem(item);
        }
      }
      this.__previousActiveItem = activeItem;
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
          } else if (this.__arrayContains(this._grid.selectedItems, items)) {
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
    __onDataProviderChanged() {
      this._selectAllHidden = !Array.isArray(this._grid.items);
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
        sortOrders: [],
        filters: this._grid._mapFilters(),
      };
      this._grid.dataProvider(params, (items) => callback(items));
    }
  };
