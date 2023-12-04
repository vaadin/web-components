/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

let defaultMultiSortPriority = 'prepend';

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
         * Controls how columns are added to the sort order when using multi-sort.
         * The sort order is visually indicated by numbers in grid sorters placed in column headers.
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
          value: () => defaultMultiSortPriority,
        },

        /**
         * When `true`, Shift-clicking an unsorted column's sorter adds it to the multi-sort.
         * Shift + Space does the same action via keyboard. This property has precedence over the
         * `multiSort` property. If `multiSortOnShiftClick` is true, the multiSort property is effectively ignored.
         *
         * @attr {boolean} multi-sort-on-shift-click
         * @type {boolean}
         */
        multiSortOnShiftClick: {
          type: Boolean,
          value: false,
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

    /**
     * Sets the default multi-sort priority to use for all grid instances.
     * This method should be called before creating any grid instances.
     * Changing this setting does not affect the default for existing grids.
     *
     * @param {string} priority
     */
    static setDefaultMultiSortPriority(priority) {
      defaultMultiSortPriority = ['append', 'prepend'].includes(priority) ? priority : 'prepend';
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('sorter-changed', this._onSorterChanged);
    }

    /** @private */
    _onSorterChanged(e) {
      e.stopPropagation();

      const sorter = e.target;
      sorter._grid = this;
      this.__updateSorter(sorter, e.detail.shiftClick, e.detail.fromSorterClick);
      this.__applySorters();
    }

    /** @private */
    __removeSorters(sortersToRemove) {
      if (sortersToRemove.length === 0) {
        return;
      }

      this._sorters = this._sorters.filter((sorter) => !sortersToRemove.find(sorter));
      this.__applySorters();
    }

    /** @private */
    __updateSortOrders() {
      this._activeSorters.forEach((sorter, index) => {
        sorter._order = this._activeSorters.length > 1 ? index : null;
      });
    }

    /** @private */
    __updateSorter(sorter, shiftClick, fromSorterClick) {
      const restSorters = this._sorters.filter((s) => s !== sorter);
      if (
        (this.multiSort && (!this.multiSortOnShiftClick || !fromSorterClick)) ||
        (this.multiSortOnShiftClick && shiftClick)
      ) {
        if (this.multiSortPriority === 'append') {
          // Append the sorter to the end of the sorters array.
          this._sorters = [...restSorters, sorter];
        } else {
          // Prepend the sorter to the beginning of the sorters array.
          this._sorters = [sorter, ...restSorters];
        }
      } else {
        // Reset the direction of the rest sorters.
        restSorters.forEach((restSorter) => {
          restSorter.direction = null;
        });

        if (!this._sorters.includes(sorter)) {
          // Append the sorter to the end of the sorters array.
          this._sorters = [...restSorters, sorter];
        }
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
        this.__debounceClearCache();
      }

      this.__updateSortOrders();
      this._a11yUpdateSorters();

      this._previousSorters = this._mapSorters();
    }

    /** @private */
    get _activeSorters() {
      return this._sorters.filter((sorter) => sorter.direction && sorter._isConnected);
    }

    /**
     * @return {!Array<!GridSorterDefinition>}
     * @protected
     */
    _mapSorters() {
      return this._activeSorters.map((sorter) => {
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
