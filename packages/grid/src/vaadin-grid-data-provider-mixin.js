/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { DataProviderController } from '@vaadin/component-base/src/data-provider-controller/data-provider-controller.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { get } from '@vaadin/component-base/src/path-utils.js';
import { getBodyRowCells, updateCellsPart, updateState } from './vaadin-grid-helpers.js';

/**
 * @polymerMixin
 */
export const DataProviderMixin = (superClass) =>
  class DataProviderMixin extends superClass {
    static get properties() {
      return {
        /**
         * The number of root-level items in the grid.
         * @attr {number} size
         * @type {number}
         */
        size: {
          type: Number,
          notify: true,
          sync: true,
        },

        /**
         * @type {number}
         * @protected
         */
        _flatSize: {
          type: Number,
          sync: true,
        },

        /**
         * Number of items fetched at a time from the dataprovider.
         * @attr {number} page-size
         * @type {number}
         */
        pageSize: {
          type: Number,
          value: 50,
          observer: '_pageSizeChanged',
          sync: true,
        },

        /**
         * Function that provides items lazily. Receives arguments `params`, `callback`
         *
         * `params.page` Requested page index
         *
         * `params.pageSize` Current page size
         *
         * `params.filters` Currently applied filters
         *
         * `params.sortOrders` Currently applied sorting orders
         *
         * `params.parentItem` When tree is used, and sublevel items
         * are requested, reference to parent item of the requested sublevel.
         * Otherwise `undefined`.
         *
         * `callback(items, size)` Callback function with arguments:
         *   - `items` Current page of items
         *   - `size` Total number of items. When tree sublevel items
         *     are requested, total number of items in the requested sublevel.
         *     Optional when tree is not used, required for tree.
         *
         * @type {GridDataProvider | null | undefined}
         */
        dataProvider: {
          type: Object,
          notify: true,
          observer: '_dataProviderChanged',
          sync: true,
        },

        /**
         * `true` while data is being requested from the data provider.
         */
        loading: {
          type: Boolean,
          notify: true,
          readOnly: true,
          reflectToAttribute: true,
        },

        /**
         * @protected
         */
        _hasData: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * Path to an item sub-property that indicates whether the item has child items.
         * @attr {string} item-has-children-path
         */
        itemHasChildrenPath: {
          type: String,
          value: 'children',
          observer: '__itemHasChildrenPathChanged',
          sync: true,
        },

        /**
         * Path to an item sub-property that identifies the item.
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          value: null,
          sync: true,
        },

        /**
         * An array that contains the expanded items.
         * @type {!Array<!GridItem>}
         */
        expandedItems: {
          type: Object,
          notify: true,
          value: () => [],
          sync: true,
        },

        /**
         * @private
         */
        __expandedKeys: {
          type: Object,
          computed: '__computeExpandedKeys(itemIdPath, expandedItems)',
        },
      };
    }

    static get observers() {
      return ['_sizeChanged(size)', '_expandedItemsChanged(expandedItems)'];
    }

    constructor() {
      super();

      /** @type {DataProviderController} */
      this._dataProviderController = new DataProviderController(this, {
        size: this.size || 0,
        pageSize: this.pageSize,
        getItemId: this.getItemId.bind(this),
        isExpanded: this._isExpanded.bind(this),
        dataProvider: this.dataProvider ? this.dataProvider.bind(this) : null,
        dataProviderParams: () => {
          return {
            sortOrders: this._mapSorters(),
            filters: this._mapFilters(),
          };
        },
      });

      this._dataProviderController.addEventListener('page-requested', this._onDataProviderPageRequested.bind(this));
      this._dataProviderController.addEventListener('page-received', this._onDataProviderPageReceived.bind(this));
      this._dataProviderController.addEventListener('page-loaded', this._onDataProviderPageLoaded.bind(this));
    }

    /**
     * @protected
     * @deprecated since 24.3 and will be removed in Vaadin 25.
     */
    get _cache() {
      console.warn('<vaadin-grid> The `_cache` property is deprecated and will be removed in Vaadin 25.');
      return this._dataProviderController.rootCache;
    }

    /**
     * @protected
     * @deprecated since 24.3 and will be removed in Vaadin 25.
     */
    get _effectiveSize() {
      console.warn('<vaadin-grid> The `_effectiveSize` property is deprecated and will be removed in Vaadin 25.');
      return this._flatSize;
    }

    /** @private */
    _sizeChanged(size) {
      this._dataProviderController.rootCache.size = size;
      this._dataProviderController.recalculateFlatSize();
      this._flatSize = this._dataProviderController.flatSize;
    }

    /** @private */
    __itemHasChildrenPathChanged(value, oldValue) {
      if (!oldValue && value === 'children') {
        // Avoid an unnecessary content update on init.
        return;
      }
      this.requestContentUpdate();
    }

    /**
     * @param {number} index
     * @param {HTMLElement} el
     * @protected
     */
    _getItem(index, el) {
      el.index = index;

      const { item } = this._dataProviderController.getFlatIndexContext(index);
      if (item) {
        this.__updateLoading(el, false);
        this._updateItem(el, item);
        if (this._isExpanded(item)) {
          this._dataProviderController.ensureFlatIndexHierarchy(index);
        }
      } else {
        this.__updateLoading(el, true);
        this._dataProviderController.ensureFlatIndexLoaded(index);
      }
    }

    /**
     * @param {!HTMLElement} row
     * @param {boolean} loading
     * @private
     */
    __updateLoading(row, loading) {
      const cells = getBodyRowCells(row);

      // Row state attribute
      updateState(row, 'loading', loading);

      // Cells part attribute
      updateCellsPart(cells, 'loading-row-cell', loading);

      if (loading) {
        // Run style generators for the loading row to have custom names cleared
        this._generateCellClassNames(row);
        this._generateCellPartNames(row);
      }
    }

    /**
     * Returns a value that identifies the item. Uses `itemIdPath` if available.
     * Can be customized by overriding.
     * @param {!GridItem} item
     * @return {!GridItem | !unknown}
     */
    getItemId(item) {
      return this.itemIdPath ? get(this.itemIdPath, item) : item;
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isExpanded(item) {
      return this.__expandedKeys && this.__expandedKeys.has(this.getItemId(item));
    }

    /** @private */
    _expandedItemsChanged() {
      this._dataProviderController.recalculateFlatSize();
      this._flatSize = this._dataProviderController.flatSize;
      this.__updateVisibleRows();
    }

    /** @private */
    __computeExpandedKeys(_itemIdPath, expandedItems) {
      const expanded = expandedItems || [];
      const expandedKeys = new Set();
      expanded.forEach((item) => {
        expandedKeys.add(this.getItemId(item));
      });

      return expandedKeys;
    }

    /**
     * Expands the given item tree.
     * @param {!GridItem} item
     */
    expandItem(item) {
      if (!this._isExpanded(item)) {
        this.expandedItems = [...this.expandedItems, item];
      }
    }

    /**
     * Collapses the given item tree.
     * @param {!GridItem} item
     */
    collapseItem(item) {
      if (this._isExpanded(item)) {
        this.expandedItems = this.expandedItems.filter((i) => !this._itemsEqual(i, item));
      }
    }

    /**
     * @param {number} index
     * @return {number}
     * @protected
     */
    _getIndexLevel(index = 0) {
      const { level } = this._dataProviderController.getFlatIndexContext(index);
      return level;
    }

    /**
     * @param {number} page
     * @param {ItemCache} cache
     * @protected
     * @deprecated since 24.3 and will be removed in Vaadin 25.
     */
    _loadPage(page, cache) {
      console.warn('<vaadin-grid> The `_loadPage` method is deprecated and will be removed in Vaadin 25.');
      this._dataProviderController.__loadCachePage(cache, page);
    }

    /** @protected */
    _onDataProviderPageRequested() {
      this._setLoading(true);
    }

    /** @protected */
    _onDataProviderPageReceived() {
      // If the page response affected the flat size
      if (this._flatSize !== this._dataProviderController.flatSize) {
        // Schedule an update of all rendered rows by _debouncerApplyCachedData,
        // to ensure that all pages associated with the rendered rows are loaded.
        this._shouldUpdateAllRenderedRowsAfterPageLoad = true;

        // TODO: Updating the flat size property can still result in a synchonous virtualizer update
        // if the size change requires the virtualizer to increase the amount of physical elements
        // to display new items e.g. the viewport fits 10 items and the size changes from 1 to 10.
        // This is something to be optimized in the future.
        this._flatSize = this._dataProviderController.flatSize;
      }

      // After updating the cache, check if some of the expanded items should have sub-caches loaded
      this._getRenderedRows().forEach((row) => {
        this._dataProviderController.ensureFlatIndexHierarchy(row.index);
      });

      this._hasData = true;
    }

    /** @protected */
    _onDataProviderPageLoaded() {
      // Schedule a debouncer to update the visible rows
      this._debouncerApplyCachedData = Debouncer.debounce(this._debouncerApplyCachedData, timeOut.after(0), () => {
        this._setLoading(false);

        const shouldUpdateAllRenderedRowsAfterPageLoad = this._shouldUpdateAllRenderedRowsAfterPageLoad;
        this._shouldUpdateAllRenderedRowsAfterPageLoad = false;

        this._getRenderedRows().forEach((row) => {
          const { item } = this._dataProviderController.getFlatIndexContext(row.index);
          if (item || shouldUpdateAllRenderedRowsAfterPageLoad) {
            this._getItem(row.index, row);
          }
        });

        this.__scrollToPendingIndexes();
        this.__dispatchPendingBodyCellFocus();
      });

      // If the grid is not loading anything, flush the debouncer immediately
      if (!this._dataProviderController.isLoading()) {
        this._debouncerApplyCachedData.flush();
      }
    }

    /** @private */
    __debounceClearCache() {
      this.__clearCacheDebouncer = Debouncer.debounce(this.__clearCacheDebouncer, microTask, () => this.clearCache());
    }

    /**
     * Clears the cached pages and reloads data from dataprovider when needed.
     */
    clearCache() {
      this._dataProviderController.clearCache();
      this._dataProviderController.rootCache.size = this.size || 0;
      this._dataProviderController.recalculateFlatSize();
      this._hasData = false;
      this.__updateVisibleRows();

      if (!this.__virtualizer || !this.__virtualizer.size) {
        this._dataProviderController.loadFirstPage();
      }
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      this._dataProviderController.setPageSize(pageSize);

      if (oldPageSize !== undefined && pageSize !== oldPageSize) {
        this.clearCache();
      }
    }

    /** @protected */
    _checkSize() {
      if (this.size === undefined && this._flatSize === 0) {
        console.warn(
          'The <vaadin-grid> needs the total number of items in' +
            ' order to display rows, which you can specify either by setting' +
            ' the `size` property, or by providing it to the second argument' +
            ' of the `dataProvider` function `callback` call.',
        );
      }
    }

    /** @private */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      this._dataProviderController.setDataProvider(dataProvider ? dataProvider.bind(this) : null);

      if (oldDataProvider !== undefined) {
        this.clearCache();
      }

      this._ensureFirstPageLoaded();

      this._debouncerCheckSize = Debouncer.debounce(
        this._debouncerCheckSize,
        timeOut.after(2000),
        this._checkSize.bind(this),
      );
    }

    /** @protected */
    _ensureFirstPageLoaded() {
      if (!this._hasData) {
        // Load data before adding rows to make sure they have content when
        // rendered for the first time.
        this._dataProviderController.loadFirstPage();
      }
    }

    /**
     * @param {!GridItem} item1
     * @param {!GridItem} item2
     * @return {boolean}
     * @protected
     */
    _itemsEqual(item1, item2) {
      return this.getItemId(item1) === this.getItemId(item2);
    }

    /**
     * @param {!GridItem} item
     * @param {!Array<!GridItem>} array
     * @return {number}
     * @protected
     */
    _getItemIndexInArray(item, array) {
      let result = -1;
      array.forEach((i, idx) => {
        if (this._itemsEqual(i, item)) {
          result = idx;
        }
      });
      return result;
    }

    /**
     * Scroll to a specific row index in the virtual list. Note that the row index is
     * not always the same for any particular item. For example, sorting or filtering
     * items can affect the row index related to an item.
     *
     * The `indexes` parameter can be either a single number or multiple numbers.
     * The grid will first try to scroll to the item at the first index on the top level.
     * In case the item at the first index is expanded, the grid will then try scroll to the
     * item at the second index within the children of the expanded first item, and so on.
     * Each given index points to a child of the item at the previous index.
     *
     * Using `Infinity` as an index will point to the last item on the level.
     *
     * @param indexes {...number} Row indexes to scroll to
     */
    scrollToIndex(...indexes) {
      // Synchronous data provider may cause changes to the cache on scroll without
      // ending up in a loading state. Try scrolling to the index until the target
      // index stabilizes.
      let targetIndex;
      while (targetIndex !== (targetIndex = this._dataProviderController.getFlatIndexByPath(indexes))) {
        this._scrollToFlatIndex(targetIndex);
      }

      if (this._dataProviderController.isLoading() || !this.clientHeight) {
        this.__pendingScrollToIndexes = indexes;
      }
    }

    /** @private */
    __scrollToPendingIndexes() {
      if (this.__pendingScrollToIndexes && this.$.items.children.length) {
        const indexes = this.__pendingScrollToIndexes;
        delete this.__pendingScrollToIndexes;
        this.scrollToIndex(...indexes);
      }
    }

    /**
     * Fired when the `expandedItems` property changes.
     *
     * @event expanded-items-changed
     */

    /**
     * Fired when the `loading` property changes.
     *
     * @event loading-changed
     */
  };
