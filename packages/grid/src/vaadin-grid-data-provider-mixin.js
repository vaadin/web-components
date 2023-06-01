/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { getBodyRowCells, updateCellsPart, updateState } from './vaadin-grid-helpers.js';

/**
 * @private
 */
export const ItemCache = class ItemCache {
  /**
   * @param {!HTMLElement} grid
   * @param {!ItemCache | undefined} parentCache
   * @param {!GridItem | undefined} parentItem
   */
  constructor(grid, parentCache, parentItem) {
    /** @type {!HTMLElement} */
    this.grid = grid;
    /** @type {!ItemCache | undefined} */
    this.parentCache = parentCache;
    /** @type {!GridItem | undefined} */
    this.parentItem = parentItem;
    /** @type {object} */
    this.itemCaches = {};
    /** @type {object} */
    this.items = {};
    /** @type {number} */
    this.effectiveSize = 0;
    /** @type {number} */
    this.size = 0;
    /** @type {object} */
    this.pendingRequests = {};
  }

  /**
   * @return {boolean}
   */
  isLoading() {
    return Boolean(
      Object.keys(this.pendingRequests).length ||
        Object.keys(this.itemCaches).filter((index) => {
          return this.itemCaches[index].isLoading();
        })[0],
    );
  }

  /**
   * @param {number} index
   * @return {!GridItem | undefined}
   */
  getItemForIndex(index) {
    const { cache, scaledIndex } = this.getCacheAndIndex(index);
    return cache.items[scaledIndex];
  }

  updateSize() {
    this.effectiveSize =
      !this.parentItem || this.grid._isExpanded(this.parentItem)
        ? this.size +
          Object.keys(this.itemCaches).reduce((prev, curr) => {
            const subCache = this.itemCaches[curr];
            subCache.updateSize();
            return prev + subCache.effectiveSize;
          }, 0)
        : 0;
  }

  /**
   * @param {number} scaledIndex
   */
  ensureSubCacheForScaledIndex(scaledIndex) {
    if (!this.itemCaches[scaledIndex]) {
      const subCache = new ItemCache(this.grid, this, this.items[scaledIndex]);
      this.itemCaches[scaledIndex] = subCache;
      this.grid._loadPage(0, subCache);
    }
  }

  /**
   * @param {number} index
   * @return {{cache: !ItemCache, scaledIndex: number}}
   */
  getCacheAndIndex(index) {
    let thisLevelIndex = index;
    for (const [index, subCache] of Object.entries(this.itemCaches)) {
      const numberIndex = Number(index);
      if (thisLevelIndex <= numberIndex) {
        return { cache: this, scaledIndex: thisLevelIndex };
      } else if (thisLevelIndex <= numberIndex + subCache.effectiveSize) {
        return subCache.getCacheAndIndex(thisLevelIndex - numberIndex - 1);
      }
      thisLevelIndex -= subCache.effectiveSize;
    }
    return { cache: this, scaledIndex: thisLevelIndex };
  }

  /**
   * Gets the scaled index as flattened index on this cache level.
   * In practice, this means that the effective size of any expanded
   * subcaches preceding the index are added to the value.
   * @param {number} scaledIndex
   * @return {number} The flat index on this cache level.
   */
  getFlatIndex(scaledIndex) {
    const clampedIndex = Math.max(0, Math.min(this.size - 1, scaledIndex));

    return Object.entries(this.itemCaches).reduce((prev, [index, subCache]) => {
      return clampedIndex > Number(index) ? prev + subCache.effectiveSize : prev;
    }, clampedIndex);
  }
};

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
         * @type {!ItemCache}
         * @protected
         */
        _cache: {
          type: Object,
          value() {
            const cache = new ItemCache(this);
            return cache;
          },
        },

        /**
         * @protected
         */
        _hasData: {
          type: Boolean,
          value: false,
        },

        /**
         * Path to an item sub-property that indicates whether the item has child items.
         * @attr {string} item-has-children-path
         */
        itemHasChildrenPath: {
          type: String,
          value: 'children',
          observer: '__itemHasChildrenPathChanged',
        },

        /**
         * Path to an item sub-property that identifies the item.
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          value: null,
        },

        /**
         * An array that contains the expanded items.
         * @type {!Array<!GridItem>}
         */
        expandedItems: {
          type: Object,
          notify: true,
          value: () => [],
        },

        /**
         * @private
         */
        __expandedKeys: {
          type: Object,
          computed: '__computeExpandedKeys(itemIdPath, expandedItems.*)',
        },
      };
    }

    static get observers() {
      return ['_sizeChanged(size)', '_expandedItemsChanged(expandedItems.*)'];
    }

    /** @private */
    _sizeChanged(size) {
      const delta = size - this._cache.size;
      this._cache.size += delta;
      this._cache.effectiveSize += delta;
      this._effectiveSize = this._cache.effectiveSize;
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
      if (index >= this._effectiveSize) {
        return;
      }

      el.index = index;
      const { cache, scaledIndex } = this._cache.getCacheAndIndex(index);
      const item = cache.items[scaledIndex];
      if (item) {
        this.__updateLoading(el, false);
        this._updateItem(el, item);
        if (this._isExpanded(item)) {
          cache.ensureSubCacheForScaledIndex(scaledIndex);
        }
      } else {
        this.__updateLoading(el, true);
        this._loadPage(this._getPageForIndex(scaledIndex), cache);
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
    }

    /**
     * Returns a value that identifies the item. Uses `itemIdPath` if available.
     * Can be customized by overriding.
     * @param {!GridItem} item
     * @return {!GridItem | !unknown}
     */
    getItemId(item) {
      return this.itemIdPath ? this.get(this.itemIdPath, item) : item;
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isExpanded(item) {
      return this.__expandedKeys.has(this.getItemId(item));
    }

    /** @private */
    _expandedItemsChanged() {
      this._cache.updateSize();
      this._effectiveSize = this._cache.effectiveSize;
      this.__updateVisibleRows();
    }

    /** @private */
    __computeExpandedKeys(itemIdPath, expandedItems) {
      const expanded = expandedItems.base || [];
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
    _getIndexLevel(index) {
      let { cache } = this._cache.getCacheAndIndex(index);
      let level = 0;
      while (cache.parentCache) {
        cache = cache.parentCache;
        level += 1;
      }
      return level;
    }

    /**
     * @param {number} page
     * @param {ItemCache} cache
     * @protected
     */
    _loadPage(page, cache) {
      // Make sure same page isn't requested multiple times.
      if (!cache.pendingRequests[page] && this.dataProvider) {
        this._setLoading(true);
        cache.pendingRequests[page] = true;
        const params = {
          page,
          pageSize: this.pageSize,
          sortOrders: this._mapSorters(),
          filters: this._mapFilters(),
          parentItem: cache.parentItem,
        };

        this.dataProvider(params, (items, size) => {
          if (size !== undefined) {
            cache.size = size;
          } else if (params.parentItem) {
            cache.size = items.length;
          }

          // Populate the cache with new items
          items.forEach((item, itemsIndex) => {
            const itemIndex = page * this.pageSize + itemsIndex;
            cache.items[itemIndex] = item;
          });

          // With the new items added, update the cache size and the grid's effective size
          this._cache.updateSize();
          this._effectiveSize = this._cache.effectiveSize;

          // After updating the cache, check if some of the expanded items should have sub-caches loaded
          this._getVisibleRows().forEach((row) => {
            const { cache, scaledIndex } = this._cache.getCacheAndIndex(row.index);
            const item = cache.items[scaledIndex];
            if (item && this._isExpanded(item)) {
              cache.ensureSubCacheForScaledIndex(scaledIndex);
            }
          });

          this._hasData = true;

          // Remove the pending request
          delete cache.pendingRequests[page];

          // Schedule a debouncer to update the visible rows
          this._debouncerApplyCachedData = Debouncer.debounce(this._debouncerApplyCachedData, timeOut.after(0), () => {
            this._setLoading(false);

            this._getVisibleRows().forEach((row) => {
              const cachedItem = this._cache.getItemForIndex(row.index);
              if (cachedItem) {
                this._getItem(row.index, row);
              }
            });

            this.__scrollToPendingIndexes();
          });

          // If the grid is not loading anything, flush the debouncer immediately
          if (!this._cache.isLoading()) {
            this._debouncerApplyCachedData.flush();
          }

          // Notify that new data has been received
          this._onDataProviderPageLoaded();
        });
      }
    }

    /** @protected */
    _onDataProviderPageLoaded() {}

    /**
     * @param {number} index
     * @return {number}
     * @private
     */
    _getPageForIndex(index) {
      return Math.floor(index / this.pageSize);
    }

    /**
     * Clears the cached pages and reloads data from dataprovider when needed.
     */
    clearCache() {
      this._cache = new ItemCache(this);
      this._cache.size = this.size || 0;
      this._cache.updateSize();
      this._hasData = false;
      this.__updateVisibleRows();

      if (!this._effectiveSize) {
        this._loadPage(0, this._cache);
      }
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      if (oldPageSize !== undefined && pageSize !== oldPageSize) {
        this.clearCache();
      }
    }

    /** @protected */
    _checkSize() {
      if (this.size === undefined && this._effectiveSize === 0) {
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
        this._loadPage(0, this._cache);
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
      while (targetIndex !== (targetIndex = this.__getGlobalFlatIndex(indexes))) {
        this._scrollToFlatIndex(targetIndex);
      }

      if (this._cache.isLoading() || !this.clientHeight) {
        this.__pendingScrollToIndexes = indexes;
      }
    }

    /**
     * Recursively returns the globally flat index of the item the given indexes point to.
     * Each index in the array points to a sub-item of the previous index.
     * Using `Infinity` as an index will point to the last item on the level.
     *
     * @param {!Array<number>} indexes
     * @param {!ItemCache} cache
     * @param {number} flatIndex
     * @return {number}
     * @private
     */
    __getGlobalFlatIndex([levelIndex, ...subIndexes], cache = this._cache, flatIndex = 0) {
      if (levelIndex === Infinity) {
        // Treat Infinity as the last index on the level
        levelIndex = cache.size - 1;
      }
      const flatIndexOnLevel = cache.getFlatIndex(levelIndex);
      const subCache = cache.itemCaches[levelIndex];
      if (subCache && subCache.effectiveSize && subIndexes.length) {
        return this.__getGlobalFlatIndex(subIndexes, subCache, flatIndex + flatIndexOnLevel + 1);
      }
      return flatIndex + flatIndexOnLevel;
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
