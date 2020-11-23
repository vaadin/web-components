/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Base } from '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerMixin
 */
export const ArrayDataProviderMixin = (superClass) =>
  class ArrayDataProviderMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing the items which will be stamped to the column template
         * instances.
         *
         * @type {Array<!GridItem> | undefined}
         */
        items: Array
      };
    }

    static get observers() {
      return ['_itemsChanged(items, items.*, isAttached)'];
    }

    /** @private */
    _itemsChanged(items, splices, isAttached) {
      if (!isAttached) {
        return;
      }
      if (!Array.isArray(items)) {
        if (items === undefined || items === null) {
          this.size = 0;
        }
        if (this.dataProvider === this._arrayDataProvider) {
          this.dataProvider = undefined;
        }
        return;
      }

      this.size = items.length;
      this.dataProvider = this.dataProvider || this._arrayDataProvider;
      this.clearCache();
      this._ensureFirstPageLoaded();
    }

    /**
     * @param {GridDataProviderParams} opts
     * @param {GridDataProviderCallback} cb
     * @protected
     */
    _arrayDataProvider(opts, cb) {
      let items = (Array.isArray(this.items) ? this.items : []).slice(0);

      if (this._filters && this._checkPaths(this._filters, 'filtering', items)) {
        items = this._filter(items);
      }

      this.size = items.length;

      if (opts.sortOrders.length && this._checkPaths(this._sorters, 'sorting', items)) {
        items = items.sort(this._multiSort.bind(this));
      }

      const start = opts.page * opts.pageSize;
      const end = start + opts.pageSize;
      const slice = items.slice(start, end);
      cb(slice, items.length);
    }

    /**
     * Check array of filters/sorters for paths validity, console.warn invalid items
     * @param {!Array<!GridFilter | !GridSorter>} arrayToCheck The array of filters/sorters to check
     * @param {string} action The name of action to include in warning (filtering, sorting)
     * @param {!Array<!GridItem>} items
     * @protected
     */
    _checkPaths(arrayToCheck, action, items) {
      if (!items.length) {
        return false;
      }

      let result = true;

      for (let i in arrayToCheck) {
        const path = arrayToCheck[i].path;

        // skip simple paths
        if (!path || path.indexOf('.') === -1) {
          continue;
        }

        const parentProperty = path.replace(/\.[^.]*$/, ''); // a.b.c -> a.b
        if (Base.get(parentProperty, items[0]) === undefined) {
          console.warn(`Path "${path}" used for ${action} does not exist in all of the items, ${action} is disabled.`);
          result = false;
        }
      }

      return result;
    }

    /**
     * @param {unknown} a
     * @param {unknown} b
     * @return {number}
     * @protected
     */
    _multiSort(a, b) {
      return this._sorters
        .map((sort) => {
          if (sort.direction === 'asc') {
            return this._compare(Base.get(sort.path, a), Base.get(sort.path, b));
          } else if (sort.direction === 'desc') {
            return this._compare(Base.get(sort.path, b), Base.get(sort.path, a));
          }
          return 0;
        })
        .reduce((p, n) => {
          return p ? p : n;
        }, 0);
    }

    /**
     * @param {unknown} value
     * @return {string}
     * @protected
     */
    _normalizeEmptyValue(value) {
      if ([undefined, null].indexOf(value) >= 0) {
        return '';
      } else if (isNaN(value)) {
        return value.toString();
      } else {
        return value;
      }
    }

    /**
     * @param {unknown} a
     * @param {unknown} b
     * @return {number}
     * @protected
     */
    _compare(a, b) {
      a = this._normalizeEmptyValue(a);
      b = this._normalizeEmptyValue(b);

      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }

    /**
     * @param {!Array<!GridItem>} items
     * @return {!Array<!GridItem>}
     * @protected
     */
    _filter(items) {
      return items.filter((item) => {
        return (
          this._filters.filter((filter) => {
            const value = this._normalizeEmptyValue(Base.get(filter.path, item));
            const filterValueLowercase = this._normalizeEmptyValue(filter.value).toString().toLowerCase();
            return value.toString().toLowerCase().indexOf(filterValueLowercase) === -1;
          }).length === 0
        );
      });
    }
  };
