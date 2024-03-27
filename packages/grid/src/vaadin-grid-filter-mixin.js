/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/**
 * @polymerMixin
 */
export const FilterMixin = (superClass) =>
  class FilterMixin extends superClass {
    static get properties() {
      return {
        /** @private */
        _filters: {
          type: Array,
          value: () => [],
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('filter-changed', this._filterChanged.bind(this));
    }

    /** @private */
    _filterChanged(e) {
      e.stopPropagation();

      this.__addFilter(e.target);
      this.__applyFilters();
    }

    /** @private */
    __removeFilters(filtersToRemove) {
      if (filtersToRemove.length === 0) {
        return;
      }

      this._filters = this._filters.filter((filter) => filtersToRemove.indexOf(filter) < 0);
      this.__applyFilters();
    }

    /** @private */
    __addFilter(filter) {
      const filterIndex = this._filters.indexOf(filter);

      if (filterIndex === -1) {
        this._filters.push(filter);
      }
    }

    /** @private */
    __applyFilters() {
      if (this.dataProvider && this.isAttached) {
        this.clearCache();
      }
    }

    /**
     * @return {!Array<!GridFilterDefinition>}
     * @protected
     */
    _mapFilters() {
      return this._filters.map((filter) => {
        return {
          path: filter.path,
          value: filter.value,
        };
      });
    }
  };
