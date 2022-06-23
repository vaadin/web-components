/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
 */
export const ComboBoxDataProviderMixin = (superClass) =>
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
          observer: '_pageSizeChanged',
        },

        /**
         * Total number of items.
         * @type {number | undefined}
         */
        size: {
          type: Number,
          observer: '_sizeChanged',
        },

        /**
         * Function that provides items lazily. Receives arguments `params`, `callback`
         *
         * `params.page` Requested page index
         *
         * `params.pageSize` Current page size
         *
         * `params.filter` Currently applied filter
         *
         * `callback(items, size)` Callback function with arguments:
         *   - `items` Current page of items
         *   - `size` Total number of items.
         * @type {ComboBoxDataProvider | undefined}
         */
        dataProvider: {
          type: Object,
          observer: '_dataProviderChanged',
        },

        /** @private */
        _pendingRequests: {
          value: () => {
            return {};
          },
        },

        /** @private */
        __placeHolder: {
          value: new ComboBoxPlaceholder(),
        },

        /** @private */
        __previousDataProviderFilter: {
          type: String,
        },
      };
    }

    static get observers() {
      return [
        '_dataProviderFilterChanged(filter)',
        '_warnDataProviderValue(dataProvider, value)',
        '_ensureFirstPage(opened)',
      ];
    }

    /** @protected */
    ready() {
      super.ready();
      this.$.dropdown.addEventListener('index-requested', (e) => {
        const index = e.detail.index;
        const currentScrollerPos = e.detail.currentScrollerPos;
        const allowedIndexRange = Math.floor(this.pageSize * 1.5);

        // Ignores the indexes, which are being re-sent during scrolling reset,
        // if the corresponding page is around the current scroller position.
        // Otherwise, there might be a last pages duplicates, which cause the
        // loading indicator hanging and blank items
        if (this._shouldSkipIndex(index, allowedIndexRange, currentScrollerPos)) {
          return;
        }

        if (index !== undefined) {
          const page = this._getPageForIndex(index);
          if (this._shouldLoadPage(page)) {
            this._loadPage(page);
          }
        }
      });
    }

    /** @private */
    _dataProviderFilterChanged(filter) {
      if (this.__previousDataProviderFilter === undefined && filter === '') {
        this.__previousDataProviderFilter = filter;
        return;
      }

      if (this.__previousDataProviderFilter !== filter) {
        this.__previousDataProviderFilter = filter;

        this._pendingRequests = {};
        // Immediately mark as loading if this refresh leads to re-fetching pages
        // This prevents some issues with the properties below triggering
        // observers that also rely on the loading state
        this.loading = this._shouldFetchData();
        // Reset size and internal loading state
        this.size = undefined;

        this.clearCache();
      }
    }

    /** @private */
    _shouldFetchData() {
      if (!this.dataProvider) {
        return false;
      }

      return this.opened || (this.filter && this.filter.length);
    }

    /** @private */
    _ensureFirstPage(opened) {
      if (opened && this._shouldLoadPage(0)) {
        this._loadPage(0);
      }
    }

    /** @private */
    _shouldSkipIndex(index, allowedIndexRange, currentScrollerPos) {
      return (
        currentScrollerPos !== 0 &&
        index >= currentScrollerPos - allowedIndexRange &&
        index <= currentScrollerPos + allowedIndexRange
      );
    }

    /** @private */
    _shouldLoadPage(page) {
      if (!this.filteredItems || this._forceNextRequest) {
        this._forceNextRequest = false;
        return true;
      }

      const loadedItem = this.filteredItems[page * this.pageSize];
      if (loadedItem !== undefined) {
        return loadedItem instanceof ComboBoxPlaceholder;
      }
      return this.size === undefined;
    }

    /** @private */
    _loadPage(page) {
      // Make sure same page isn't requested multiple times.
      if (!this._pendingRequests[page] && this.dataProvider) {
        this.loading = true;

        const params = {
          page,
          pageSize: this.pageSize,
          filter: this.filter,
        };

        const callback = (items, size) => {
          if (this._pendingRequests[page] === callback) {
            const filteredItems = this.filteredItems ? [...this.filteredItems] : [];
            filteredItems.splice(params.page * params.pageSize, items.length, ...items);
            this.filteredItems = filteredItems;

            // Update selectedItem from filteredItems if value is set
            if (this._isValidValue(this.value) && this._getItemValue(this.selectedItem) !== this.value) {
              this._selectItemForValue(this.value);
            }
            if (!this.opened && !this.hasAttribute('focused')) {
              this._commitValue();
            }
            this.size = size;

            delete this._pendingRequests[page];

            if (Object.keys(this._pendingRequests).length === 0) {
              this.loading = false;
            }
          }
        };

        if (!this._pendingRequests[page]) {
          // Don't request page if it's already being requested
          this._pendingRequests[page] = callback;
          this.dataProvider(params, callback);
        }
      }
    }

    /** @private */
    _getPageForIndex(index) {
      return Math.floor(index / this.pageSize);
    }

    /**
     * Clears the cached pages and reloads data from dataprovider when needed.
     */
    clearCache() {
      if (!this.dataProvider) {
        return;
      }

      this._pendingRequests = {};
      const filteredItems = [];
      for (let i = 0; i < (this.size || 0); i++) {
        filteredItems.push(this.__placeHolder);
      }
      this.filteredItems = filteredItems;

      if (this._shouldFetchData()) {
        this._forceNextRequest = false;
        this._loadPage(0);
      } else {
        this._forceNextRequest = true;
      }
    }

    /** @private */
    _sizeChanged(size = 0) {
      const filteredItems = (this.filteredItems || []).slice(0, size);
      for (let i = 0; i < size; i++) {
        filteredItems[i] = filteredItems[i] !== undefined ? filteredItems[i] : this.__placeHolder;
      }
      this.filteredItems = filteredItems;

      // Cleans up the redundant pending requests for pages > size
      // Refers to https://github.com/vaadin/vaadin-flow-components/issues/229
      this._flushPendingRequests(size);
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      if (Math.floor(pageSize) !== pageSize || pageSize < 1) {
        this.pageSize = oldPageSize;
        throw new Error('`pageSize` value must be an integer > 0');
      }
      this.clearCache();
    }

    /** @private */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      this._ensureItemsOrDataProvider(() => {
        this.dataProvider = oldDataProvider;
      });

      this.clearCache();
    }

    /** @private */
    _ensureItemsOrDataProvider(restoreOldValueCallback) {
      if (this.items !== undefined && this.dataProvider !== undefined) {
        restoreOldValueCallback();
        throw new Error('Using `items` and `dataProvider` together is not supported');
      } else if (this.dataProvider && !this.filteredItems) {
        this.filteredItems = [];
      }
    }

    /** @private */
    _warnDataProviderValue(dataProvider, value) {
      if (dataProvider && value !== '' && (this.selectedItem === undefined || this.selectedItem === null)) {
        const valueIndex = this._indexOfValue(value, this.filteredItems);
        if (valueIndex < 0 || !this._getItemLabel(this.filteredItems[valueIndex])) {
          console.warn(
            'Warning: unable to determine the label for the provided `value`. ' +
              'Nothing to display in the text field. This usually happens when ' +
              'setting an initial `value` before any items are returned from ' +
              'the `dataProvider` callback. Consider setting `selectedItem` ' +
              'instead of `value`',
          );
        }
      }
    }

    /**
     * This method cleans up the page callbacks which refers to the
     * non-existing pages, i.e. which item indexes are greater than the
     * changed size.
     * This case is basically happens when:
     * 1. Users scroll fast to the bottom and combo box generates the
     * redundant page request/callback
     * 2. Server side uses undefined size lazy loading and suddenly reaches
     * the exact size which is on the range edge
     * (for default page size = 50, it will be 100, 200, 300, ...).
     * @param size the new size of items
     * @private
     */
    _flushPendingRequests(size) {
      if (this._pendingRequests) {
        const lastPage = Math.ceil(size / this.pageSize);
        const pendingRequestsKeys = Object.keys(this._pendingRequests);
        for (let reqIdx = 0; reqIdx < pendingRequestsKeys.length; reqIdx++) {
          const page = parseInt(pendingRequestsKeys[reqIdx]);
          if (page >= lastPage) {
            this._pendingRequests[page]([], size);
          }
        }
      }
    }
  };
