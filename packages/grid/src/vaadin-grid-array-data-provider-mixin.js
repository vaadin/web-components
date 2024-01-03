/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { createArrayDataProvider } from './array-data-provider.js';

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
        items: {
          type: Array,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*)'];
    }

    /** @private */
    __setArrayDataProvider(items) {
      const arrayDataProvider = createArrayDataProvider(this.items, {});
      arrayDataProvider.__items = items;
      this._arrayDataProvider = arrayDataProvider;
      this.size = items.length;
      this.dataProvider = arrayDataProvider;
    }

    /**
     * @override
     * @protected
     */
    _onDataProviderPageReceived() {
      super._onDataProviderPageReceived();

      if (this._arrayDataProvider) {
        this.size = this._flatSize;
      }
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
          this._arrayDataProvider = undefined;
          this.items = undefined;
        } else if (!items) {
          // The items array was unset
          this._arrayDataProvider = undefined;
          this.dataProvider = undefined;
          this.size = 0;
          this.clearCache();
        } else if (this._arrayDataProvider.__items === items) {
          // The items array was modified
          this.clearCache();
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
