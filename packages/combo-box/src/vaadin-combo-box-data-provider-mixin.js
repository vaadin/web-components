/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DataProviderController } from '@vaadin/component-base/src/data-provider-controller/data-provider-controller.js';
import { get } from '@vaadin/component-base/src/path-utils.js';
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
          sync: true,
        },

        /**
         * Total number of items.
         * @type {number | undefined}
         */
        size: {
          type: Number,
          observer: '_sizeChanged',
          sync: true,
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
          sync: true,
        },

        /** @private */
        _hasData: {
          type: Boolean,
          value: false,
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

    constructor() {
      super();

      /** @type {DataProviderController} */
      this._dataProviderController = new DataProviderController(this, {
        size: this.size,
        pageSize: this.pageSize,
        getItemId: (item) => get(this.itemIdPath, item),
        placeholder: new ComboBoxPlaceholder(),
        isPlaceholder: (item) => item instanceof ComboBoxPlaceholder,
        dataProvider: this.dataProvider,
        dataProviderParams: () => ({ filter: this.filter }),
      });
    }

    /** @protected */
    ready() {
      super.ready();

      this._dataProviderController.addEventListener('page-requested', this._onDataProviderPageRequested.bind(this));
      this._dataProviderController.addEventListener('page-loaded', this._onDataProviderPageLoaded.bind(this));

      this._scroller.addEventListener('index-requested', (e) => {
        if (!this._shouldFetchData()) {
          return;
        }

        const index = e.detail.index;
        if (index !== undefined) {
          this._dataProviderController.ensureFlatIndexLoaded(index);
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

        this._keepOverlayOpened = true;
        this.size = undefined;
        this.clearCache();
        this._keepOverlayOpened = false;
      }
    }

    /** @protected */
    _shouldFetchData() {
      if (!this.dataProvider) {
        return false;
      }

      return this.opened || (this.filter && this.filter.length);
    }

    /** @private */
    _ensureFirstPage(opened) {
      if (!this._shouldFetchData()) {
        return;
      }

      if (opened && !this._hasData) {
        this._dataProviderController.loadFirstPage();
      }
    }

    /** @private */
    _onDataProviderPageRequested() {
      this.loading = true;
    }

    /** @private */
    _onDataProviderPageLoaded() {
      this._hasData = true;

      this.requestContentUpdate();

      if (!this.opened && !this._isInputFocused()) {
        this._commitValue();
      }
    }

    /**
     * Clears the cached pages and reloads data from dataprovider when needed.
     */
    clearCache() {
      if (!this.dataProvider) {
        return;
      }

      this._dataProviderController.clearCache();

      this._hasData = false;

      this.requestContentUpdate();

      if (this._shouldFetchData()) {
        this._dataProviderController.loadFirstPage();
      }
    }

    /** @private */
    _sizeChanged(size = 0) {
      const { rootCache } = this._dataProviderController;
      // When the size update originates from the developer,
      // sync the new size with the controller and trigger
      // a content update to re-render the scroller.
      if (rootCache.size !== size) {
        rootCache.size = size;
        this.requestContentUpdate();
      }
    }

    /**
     * @private
     * @override
     */
    _filteredItemsChanged(items) {
      if (!this.dataProvider) {
        return super._filteredItemsChanged(items);
      }

      const { rootCache } = this._dataProviderController;
      // When the items update originates from the developer,
      // sync the new items with the controller and trigger
      // a content update to re-render the scroller.
      if (rootCache.items !== items) {
        rootCache.items = items;
        this.requestContentUpdate();
      }
    }

    /** @override */
    requestContentUpdate() {
      if (this.dataProvider) {
        const { rootCache } = this._dataProviderController;

        // Sync the controller's size with the component.
        // They can be out of sync after, for example,
        // the controller received new data.
        if ((this.size || 0) !== rootCache.size) {
          this.size = rootCache.size;
        }

        // Sync the controller's items with the component.
        // They can be out of sync after, for example,
        // the controller received new data.
        if (this.filteredItems !== rootCache.items) {
          this.filteredItems = rootCache.items;
        }

        // Sync the controller's loading state with the component.
        this.loading = this._dataProviderController.isLoading();

        // Set a copy of the controller's items as the dropdown items
        // to trigger an update of the focused index in _setDropdownItems.
        this._setDropdownItems([...this.filteredItems]);
      }

      super.requestContentUpdate();
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      if (Math.floor(pageSize) !== pageSize || pageSize < 1) {
        this.pageSize = oldPageSize;
        throw new Error('`pageSize` value must be an integer > 0');
      }

      this._dataProviderController.setPageSize(pageSize);
      this.clearCache();
    }

    /** @private */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      this._ensureItemsOrDataProvider(() => {
        this.dataProvider = oldDataProvider;
      });

      this._dataProviderController.setDataProvider(dataProvider);
      this.clearCache();
    }

    /** @private */
    _ensureItemsOrDataProvider(restoreOldValueCallback) {
      if (this.items !== undefined && this.dataProvider !== undefined) {
        restoreOldValueCallback();
        throw new Error('Using `items` and `dataProvider` together is not supported');
      }
    }

    /** @private */
    _warnDataProviderValue(dataProvider, value) {
      if (dataProvider && value !== '' && (this.selectedItem === undefined || this.selectedItem === null)) {
        const valueIndex = this.__getItemIndexByValue(this.filteredItems, value);
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
  };
