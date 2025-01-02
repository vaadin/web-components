/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DataProviderController } from '@vaadin/component-base/src/data-provider-controller/data-provider-controller.js';
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
        __dataProviderInitialized: {
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

      /**
       * @type {DataProviderController}
       * @private
       */
      this.__dataProviderController = new DataProviderController(this, {
        placeholder: new ComboBoxPlaceholder(),
        isPlaceholder: (item) => item instanceof ComboBoxPlaceholder,
        dataProviderParams: () => ({ filter: this.filter }),
      });

      this.__dataProviderController.addEventListener('page-requested', this.__onDataProviderPageRequested.bind(this));
      this.__dataProviderController.addEventListener('page-loaded', this.__onDataProviderPageLoaded.bind(this));
    }

    /** @protected */
    ready() {
      super.ready();
      this._scroller.addEventListener('index-requested', (e) => {
        if (!this._shouldFetchData()) {
          return;
        }

        const index = e.detail.index;
        if (index !== undefined) {
          this.__dataProviderController.ensureFlatIndexLoaded(index);
        }
      });

      this.__dataProviderInitialized = true;

      if (this.dataProvider) {
        this.__synchronizeControllerState();
      }
    }

    /** @private */
    _dataProviderFilterChanged(filter) {
      if (this.__previousDataProviderFilter === undefined && filter === '') {
        this.__previousDataProviderFilter = filter;
        return;
      }

      if (this.__previousDataProviderFilter !== filter) {
        this.__previousDataProviderFilter = filter;

        this.__keepOverlayOpened = true;
        this.size = undefined;
        this.clearCache();
        this.__keepOverlayOpened = false;
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
      if (!this._shouldFetchData() || !opened) {
        return;
      }

      if (this._forceNextRequest || this.size === undefined) {
        this._forceNextRequest = false;
        this.__dataProviderController.loadFirstPage();
      } else if (this.size > 0) {
        this.__dataProviderController.ensureFlatIndexLoaded(0);
      }
    }

    /** @private */
    __onDataProviderPageRequested() {
      this.loading = true;
    }

    /** @private */
    __onDataProviderPageLoaded() {
      // The controller adds new items to the cache through mutation,
      // so we need to create a new array to trigger filteredItems observers.
      const { rootCache } = this.__dataProviderController;
      rootCache.items = [...rootCache.items];

      this.__synchronizeControllerState();

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

      this.__dataProviderController.clearCache();

      this.__synchronizeControllerState();

      if (this._shouldFetchData()) {
        this._forceNextRequest = false;
        this.__dataProviderController.loadFirstPage();
      } else {
        this._forceNextRequest = true;
      }
    }

    /**
     * When the size change originates externally, synchronizes the new size with
     * the controller and request a content update to re-render the scroller.
     *
     * @private
     */
    _sizeChanged(size) {
      const { rootCache } = this.__dataProviderController;
      if (rootCache.size !== size) {
        rootCache.size = size;
        // The controller adds new placeholders to the cache through mutation,
        // so we need to create a new array to trigger filteredItems observers.
        rootCache.items = [...rootCache.items];
        this.__synchronizeControllerState();
      }
    }

    /**
     * When the items change originates externally, synchronizes the new items with
     * the controller and requests a content update to re-render the scroller.
     *
     * @private
     * @override
     */
    _filteredItemsChanged(items) {
      super._filteredItemsChanged(items);

      if (this.dataProvider && items) {
        const { rootCache } = this.__dataProviderController;
        if (rootCache.items !== items) {
          rootCache.items = items;
          this.__synchronizeControllerState();
        }
      }
    }

    /**
     * Synchronizes the controller's state with the component, which can be
     * out of sync after the controller receives new data from the data provider
     * or if the state in the controller is directly manipulated.
     *
     * @private
     */
    __synchronizeControllerState() {
      // When the data provider isn't initialized, it means the content update was requested
      // by an observer before the `ready()` callback. In such cases, some properties
      // in the data provider controller might still be uninitialized, so it's not safe
      // to use them to update the component's properties yet. Another content update
      // will be requested in the `ready()` callback.
      if (this.__dataProviderInitialized && this.dataProvider) {
        const { rootCache } = this.__dataProviderController;
        this.size = rootCache.size;
        this.filteredItems = rootCache.items;
        this.loading = this.__dataProviderController.isLoading();
      }
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      if (Math.floor(pageSize) !== pageSize || pageSize < 1) {
        this.pageSize = oldPageSize;
        throw new Error('`pageSize` value must be an integer > 0');
      }

      this.__dataProviderController.setPageSize(pageSize);
      this.clearCache();
    }

    /** @private */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      this._ensureItemsOrDataProvider(() => {
        this.dataProvider = oldDataProvider;
      });

      this.__dataProviderController.setDataProvider(dataProvider);
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
