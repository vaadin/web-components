/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const SortMixin = (superClass) =>
  class SortMixin extends superClass {
    static get properties() {
      return {
        /**
         * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
         * @attr {boolean} multi-sort
         * @type {boolean}
         */
        multiSort: {
          type: Boolean,
          value: false,
        },

        /**
         * Use this property to determine the order in which the grid rows are sorted.
         * It's visually indicated by numbers in grid sorters placed in column headers.
         *
         * By default, whenever an unsorted column is sorted, or the sort-direction of a column is
         * changed, that column gets sort priority 1, thus affecting the priority for all the other
         * sorted columns. This is identical to using `multi-sort-priority="prepend"`.
         *
         * Using this property allows to change this behavior so that sorting an unsorted column
         * would add it to the "end" of the sort, and changing column's sort direction would retain
         * it's previous priority. To set this, use `multi-sort-priority="append"`.
         *
         * @attr {string} multi-sort-priority
         */
        multiSortPriority: {
          type: String,
          value: 'prepend',
        },

        /**
         * @type {!Array<!GridSorterDefinition>}
         * @protected
         */
        _sorters: {
          type: Array,
          value: () => [],
        },

        /** @private */
        _previousSorters: {
          type: Array,
          value: () => [],
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('sorter-changed', this._onSorterChanged);
    }

    /** @private */
    _onSorterChanged(e) {
      const sorter = e.target;
      e.stopPropagation();
      sorter._grid = this;
      this.__updateSorter(sorter);
      this.__applySorters();
    }

    /** @private */
    __removeSorters(sortersToRemove) {
      if (sortersToRemove.length === 0) {
        return;
      }

      this._sorters = this._sorters.filter((sorter) => sortersToRemove.indexOf(sorter) < 0);
      if (this.multiSort) {
        this.__updateSortOrders();
      }
      this.__applySorters();
    }

    /** @private */
    __updateSortOrders() {
      this._sorters.forEach((sorter, index) => (sorter._order = this._sorters.length > 1 ? index : null), this);
    }

    /** @private */
    __appendSorter(sorter) {
      if (!sorter.direction) {
        this._removeArrayItem(this._sorters, sorter);
      } else if (!this._sorters.includes(sorter)) {
        this._sorters.push(sorter);
      }

      this.__updateSortOrders();
    }

    /** @private */
    __prependSorter(sorter) {
      this._removeArrayItem(this._sorters, sorter);
      if (sorter.direction) {
        this._sorters.unshift(sorter);
      }
      this.__updateSortOrders();
    }

    /** @private */
    __updateSorter(sorter) {
      if (!sorter.direction && this._sorters.indexOf(sorter) === -1) {
        return;
      }

      sorter._order = null;

      if (this.multiSort) {
        if (this.multiSortPriority === 'append') {
          this.__appendSorter(sorter);
        } else {
          this.__prependSorter(sorter);
        }
      } else if (sorter.direction) {
        const otherSorters = this._sorters.filter((s) => s !== sorter);
        this._sorters = [sorter];
        otherSorters.forEach((sorter) => {
          sorter._order = null;
          sorter.direction = null;
        });
      }
    }

    /** @private */
    __applySorters() {
      if (
        this.dataProvider &&
        // No need to clear cache if sorters didn't change and grid is attached
        this.isAttached &&
        JSON.stringify(this._previousSorters) !== JSON.stringify(this._mapSorters())
      ) {
        this.clearCache();
      }

      this._a11yUpdateSorters();

      this._previousSorters = this._mapSorters();
    }

    /**
     * @return {!Array<!GridSorterDefinition>}
     * @protected
     */
    _mapSorters() {
      return this._sorters.map((sorter) => {
        return {
          path: sorter.path,
          direction: sorter.direction,
        };
      });
    }

    /** @private */
    _removeArrayItem(array, item) {
      const index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  };
