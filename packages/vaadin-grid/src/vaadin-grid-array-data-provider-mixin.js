/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { createArrayDataProvider } from './arrayDataProvider.js';

/**
 * @polymerMixin
 */
export const ArrayDataProviderMixin = (superClass) =>
  class ArrayDataProviderMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing the items which will be passed to renderer functions.
         *
         * @type {Array<!GridItem> | undefined}
         */
        items: Array
      };
    }

    static get observers() {
      return ['__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)'];
    }

    /** @private */
    __setArrayDataProvider(items) {
      const arrayDataProvider = createArrayDataProvider(this.items, {});
      arrayDataProvider.__items = items;
      this.setProperties({
        _arrayDataProvider: arrayDataProvider,
        size: items.length,
        dataProvider: arrayDataProvider
      });
    }

    /** @private */
    __unsetArrayDataProvider() {
      this.setProperties({
        _arrayDataProvider: undefined,
        items: undefined // TODO: selection column just checks for grid.items in some logic. Add a test which adds items and then a custom dp.
      });
    }

    /** @private */
    __dataProviderOrItemsChanged(dataProvider, items, isAttached) {
      if (!isAttached) {
        return;
      }

      if (this._arrayDataProvider) {
        // Has an items array data provider beforehand

        if (dataProvider !== this._arrayDataProvider) {
          // A custom data provider was set externally
          this.__unsetArrayDataProvider();
        } else if (!items) {
          // The items array was unset
          this.__unsetArrayDataProvider();
          this.dataProvider = undefined;
          this.size = 0;
          this.clearCache();
        } else if (this._arrayDataProvider.__items === items) {
          // The items array was modified
          this.clearCache();
          this.size = this._effectiveSize;
        } else {
          // The items array was replaced
          this.__setArrayDataProvider(items);
        }
      } else if (items) {
        // There was no array data provider before items was set
        this.__setArrayDataProvider(items);
      }
    }
  };
