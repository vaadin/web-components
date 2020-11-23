/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

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
        })[0]
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
    const keys = Object.keys(this.itemCaches);
    for (let i = 0; i < keys.length; i++) {
      const expandedIndex = Number(keys[i]);
      const subCache = this.itemCaches[expandedIndex];
      if (thisLevelIndex <= expandedIndex) {
        return { cache: this, scaledIndex: thisLevelIndex };
      } else if (thisLevelIndex <= expandedIndex + subCache.effectiveSize) {
        return subCache.getCacheAndIndex(thisLevelIndex - expandedIndex - 1);
      }
      thisLevelIndex -= subCache.effectiveSize;
    }
    return { cache: this, scaledIndex: thisLevelIndex };
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
         * Number of items fetched at a time from the dataprovider.
         * @attr {number} page-size
         * @type {number}
         */
        pageSize: {
          type: Number,
          value: 50,
          observer: '_pageSizeChanged'
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
          observer: '_dataProviderChanged'
        },

        /**
         * `true` while data is being requested from the data provider.
         */
        loading: {
          type: Boolean,
          notify: true,
          readOnly: true,
          reflectToAttribute: true
        },

        /**
         * @type {!ItemCache}
         * @protected
         */
        _cache: {
          type: Object,
          value: function () {
            const cache = new ItemCache(this);
            return cache;
          }
        },

        /**
         * Path to an item sub-property that identifies the item.
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          value: null
        },

        /**
         * An array that contains the expanded items.
         * @type {!Array<!GridItem>}
         */
        expandedItems: {
          type: Object,
          notify: true,
          value: () => []
        }
      };
    }

    static get observers() {
      return ['_sizeChanged(size)', '_itemIdPathChanged(itemIdPath)', '_expandedItemsChanged(expandedItems.*)'];
    }

    /** @private */
    _sizeChanged(size) {
      const delta = size - this._cache.size;
      this._cache.size += delta;
      this._cache.effectiveSize += delta;
      this._effectiveSize = this._cache.effectiveSize;
      this._increasePoolIfNeeded(0);
      this._debounceIncreasePool && this._debounceIncreasePool.flush();
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
        this._toggleAttribute('loading', false, el);
        this._updateItem(el, item);
        if (this._isExpanded(item)) {
          cache.ensureSubCacheForScaledIndex(scaledIndex);
        }
      } else {
        this._toggleAttribute('loading', true, el);
        this._loadPage(this._getPageForIndex(scaledIndex), cache);
      }
    }

    /** @private */
    _expandedInstanceChangedCallback(inst, value) {
      if (inst.item === undefined) {
        return;
      }
      if (value) {
        this.expandItem(inst.item);
      } else {
        this.collapseItem(inst.item);
      }
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
      this.__cacheExpandedKeys();
      this._cache.updateSize();
      this._effectiveSize = this._cache.effectiveSize;
      this._assignModels();
    }

    /** @private */
    _itemIdPathChanged() {
      this.__cacheExpandedKeys();
    }

    /** @private */
    __cacheExpandedKeys() {
      if (this.expandedItems) {
        this.__expandedKeys = new Set();
        this.expandedItems.forEach((item) => {
          this.__expandedKeys.add(this.getItemId(item));
        });
      }
    }

    /**
     * Expands the given item tree.
     * @param {!GridItem} item
     */
    expandItem(item) {
      if (!this._isExpanded(item)) {
        this.push('expandedItems', item);
      }
    }

    /**
     * Collapses the given item tree.
     * @param {!GridItem} item
     */
    collapseItem(item) {
      if (this._isExpanded(item)) {
        this.splice('expandedItems', this._getItemIndexInArray(item, this.expandedItems), 1);
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
        level++;
      }
      return level;
    }

    /**
     * @return {boolean}
     * @protected
     */
    _canPopulate() {
      return Boolean(this._hasData && this._columnTree);
    }

    /**
     * @param {number} page
     * @param {ItemCache} cache
     * @protected
     */
    _loadPage(page, cache) {
      // make sure same page isn't requested multiple times.
      if (!cache.pendingRequests[page] && this.dataProvider) {
        this._setLoading(true);
        cache.pendingRequests[page] = true;
        const params = {
          page,
          pageSize: this.pageSize,
          sortOrders: this._mapSorters(),
          filters: this._mapFilters(),
          parentItem: cache.parentItem
        };

        this.dataProvider(params, (items, size) => {
          if (size !== undefined) {
            cache.size = size;
          } else {
            if (params.parentItem) {
              cache.size = items.length;
            }
          }

          const currentItems = Array.from(this.$.items.children).map((row) => row._item);

          // Populate the cache with new items
          items.forEach((item, itemsIndex) => {
            const itemIndex = page * this.pageSize + itemsIndex;
            cache.items[itemIndex] = item;
            if (this._isExpanded(item) && currentItems.indexOf(item) > -1) {
              // Force synchronous data request for expanded item sub-cache
              cache.ensureSubCacheForScaledIndex(itemIndex);
            }
          });

          this._hasData = true;

          delete cache.pendingRequests[page];

          this._debouncerApplyCachedData = Debouncer.debounce(this._debouncerApplyCachedData, timeOut.after(0), () => {
            this._setLoading(false);
            this._cache.updateSize();
            this._effectiveSize = this._cache.effectiveSize;

            Array.from(this.$.items.children)
              .filter((row) => !row.hidden)
              .forEach((row) => {
                const cachedItem = this._cache.getItemForIndex(row.index);
                if (cachedItem) {
                  this._getItem(row.index, row);
                }
              });

            this._increasePoolIfNeeded(0);
            this.__scrollToPendingIndex();
          });

          if (!this._cache.isLoading()) {
            this._debouncerApplyCachedData.flush();
          }

          this.__itemsReceived();
        });
      }
    }

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
      Array.from(this.$.items.children).forEach((row) => {
        Array.from(row.children).forEach((cell) => {
          // Force data system to pick up subproperty changes
          cell._instance && cell._instance._setPendingProperty('item', {}, false);
        });
      });
      this._cache.size = this.size || 0;
      this._cache.updateSize();
      this._hasData = false;
      this._assignModels();

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
          'The <vaadin-grid> needs the total number of items' +
            ' in order to display rows. Set the total number of items' +
            ' to the `size` property, or provide the total number of items' +
            ' in the second argument of the `dataProvider`’s `callback` call.'
        );
      }
    }

    /** @private */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      if (oldDataProvider !== undefined) {
        this.clearCache();
      }

      if (dataProvider && this.items && this.items.length) {
        // Fixes possibly invalid cached lastVisibleIndex value in <iron-list>
        this._scrollToIndex(this._firstVisibleIndex);
      }

      this._ensureFirstPageLoaded();

      this._debouncerCheckSize = Debouncer.debounce(
        this._debouncerCheckSize,
        timeOut.after(2000),
        this._checkSize.bind(this)
      );

      this._scrollHandler();
    }

    /** @protected */
    _ensureFirstPageLoaded() {
      if (!this._hasData) {
        // load data before adding rows to make sure they have content when
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

    scrollToIndex(index) {
      super.scrollToIndex(index);
      if (!isNaN(index) && (this._cache.isLoading() || !this.clientHeight)) {
        this.__pendingScrollToIndex = index;
      }
    }

    __scrollToPendingIndex() {
      if (this.__pendingScrollToIndex && this.$.items.children.length) {
        const index = this.__pendingScrollToIndex;
        delete this.__pendingScrollToIndex;
        this.scrollToIndex(index);
      }
    }
  };
