/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementHidden } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * A mixin providing grid column auto-width functionality.
 *
 * @polymerMixin
 */
export const ColumnAutoWidthMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /** @private */
        __pendingRecalculateColumnWidths: {
          type: Boolean,
          value: true,
        },
      };
    }

    /** @private */
    __getIntrinsicWidth(col) {
      if (!this.__intrinsicWidthCache.has(col)) {
        this.__calculateAndCacheIntrinsicWidths([col]);
      }
      return this.__intrinsicWidthCache.get(col);
    }

    /** @private */
    __getDistributedWidth(col, innerColumn) {
      if (col == null || col === this) {
        return 0;
      }

      const columnWidth = Math.max(
        this.__getIntrinsicWidth(col),
        this.__getDistributedWidth((col.assignedSlot || col).parentElement, col),
      );

      // We're processing a regular grid-column and not a grid-column-group
      if (!innerColumn) {
        return columnWidth;
      }

      // At the end, the width of each vaadin-grid-column-group is determined by the sum of the width of its children.
      // Here we determine how much space the vaadin-grid-column-group actually needs to render properly and then we distribute that space
      // to its children, so when we actually do the summation it will be rendered properly.
      // Check out vaadin-grid-column-group:_updateFlexAndWidth
      const columnGroup = col;
      const columnGroupWidth = columnWidth;
      const sumOfWidthOfAllChildColumns = columnGroup._visibleChildColumns
        .map((col) => this.__getIntrinsicWidth(col))
        .reduce((sum, curr) => sum + curr, 0);

      const extraNecessarySpaceForGridColumnGroup = Math.max(0, columnGroupWidth - sumOfWidthOfAllChildColumns);

      // The distribution of the extra necessary space is done according to the intrinsic width of each child column.
      // Lets say we need 100 pixels of extra space for the grid-column-group to render properly
      // it has two grid-column children, |100px|300px| in total 400px
      // the first column gets 25px of the additional space (100/400)*100 = 25
      // the second column gets the 75px of the additional space (300/400)*100 = 75
      const proportionOfExtraSpace = this.__getIntrinsicWidth(innerColumn) / sumOfWidthOfAllChildColumns;
      const shareOfInnerColumnFromNecessaryExtraSpace = proportionOfExtraSpace * extraNecessarySpaceForGridColumnGroup;

      return this.__getIntrinsicWidth(innerColumn) + shareOfInnerColumnFromNecessaryExtraSpace;
    }

    /**
     * @param {!Array<!GridColumn>} cols the columns to auto size based on their content width
     * @private
     */
    _recalculateColumnWidths(cols) {
      // Flush to make sure DOM is up-to-date when measuring the column widths
      this.__virtualizer.flush();
      [...this.$.header.children, ...this.$.footer.children].forEach((row) => {
        if (row.__debounceUpdateHeaderFooterRowVisibility) {
          row.__debounceUpdateHeaderFooterRowVisibility.flush();
        }
      });

      // Flush to account for any changes to the visibility of the columns
      if (this._debouncerHiddenChanged) {
        this._debouncerHiddenChanged.flush();
      }

      this.__intrinsicWidthCache = new Map();
      // Cache the viewport rows to avoid unnecessary reflows while measuring the column widths
      const fvi = this._firstVisibleIndex;
      const lvi = this._lastVisibleIndex;
      this.__viewportRowsCache = this._getRenderedRows().filter((row) => row.index >= fvi && row.index <= lvi);

      // Pre-cache the intrinsic width of each column
      this.__calculateAndCacheIntrinsicWidths(cols);

      cols.forEach((col) => {
        col.width = `${this.__getDistributedWidth(col)}px`;
      });
    }

    /**
     * Toggles the cell content for the given column to use or not use auto width.
     *
     * While content for all the column cells uses auto width (instead of the default 100%),
     * their offsetWidth can be used to calculate the collective intrinsic width of the column.
     *
     * @private
     */
    __setVisibleCellContentAutoWidth(col, autoWidth) {
      col._allCells
        .filter((cell) => {
          if (this.$.items.contains(cell)) {
            return this.__viewportRowsCache.includes(cell.parentElement);
          }
          return true;
        })
        .forEach((cell) => {
          cell.__measuringAutoWidth = autoWidth;

          if (cell.__measuringAutoWidth) {
            // Store the original inline width of the cell to restore it later
            cell.__originalWidth = cell.style.width;
            // Prepare the cell for having its intrinsic width measured
            cell.style.width = 'auto';
            cell.style.position = 'absolute';
          } else {
            // Restore the original width
            cell.style.width = cell.__originalWidth;
            delete cell.__originalWidth;
            cell.style.position = '';
          }
        });

      if (autoWidth) {
        this.$.scroller.setAttribute('measuring-auto-width', '');
      } else {
        this.$.scroller.removeAttribute('measuring-auto-width');
      }
    }

    /**
     * Returns the maximum intrinsic width of the cell content in the given column.
     * Only cells which are marked for measuring auto width are considered.
     *
     * @private
     */
    __getAutoWidthCellsMaxWidth(col) {
      // Note: _allCells only contains cells which are currently rendered in DOM
      return col._allCells.reduce((width, cell) => {
        // Add 1px buffer to the offset width to avoid too narrow columns (sub-pixel rendering)
        return cell.__measuringAutoWidth ? Math.max(width, cell.offsetWidth + 1) : width;
      }, 0);
    }

    /**
     * Calculates and caches the intrinsic width of each given column.
     *
     * @private
     */
    __calculateAndCacheIntrinsicWidths(cols) {
      // Make all the columns use auto width at once before measuring to
      // avoid reflows in between the measurements
      cols.forEach((col) => this.__setVisibleCellContentAutoWidth(col, true));
      // Measure and cache
      cols.forEach((col) => {
        const width = this.__getAutoWidthCellsMaxWidth(col);
        this.__intrinsicWidthCache.set(col, width);
      });
      // Reset the columns to use 100% width
      cols.forEach((col) => this.__setVisibleCellContentAutoWidth(col, false));
    }

    /**
     * Updates the `width` of all columns which have `autoWidth` set to `true`.
     */
    recalculateColumnWidths() {
      if (!this._columnTree) {
        return; // No columns
      }
      if (isElementHidden(this) || this._dataProviderController.isLoading()) {
        this.__pendingRecalculateColumnWidths = true;
        return;
      }
      const cols = this._getColumns().filter((col) => !col.hidden && col.autoWidth);

      const undefinedCols = cols.filter((col) => !customElements.get(col.localName));
      if (undefinedCols.length) {
        // Some of the columns are not defined yet, wait for them to be defined before measuring
        Promise.all(undefinedCols.map((col) => customElements.whenDefined(col.localName))).then(() => {
          this._recalculateColumnWidths(cols);
        });
      } else {
        this._recalculateColumnWidths(cols);
      }
    }

    /** @private */
    __tryToRecalculateColumnWidthsIfPending() {
      if (!this.__pendingRecalculateColumnWidths || isElementHidden(this) || this._dataProviderController.isLoading()) {
        return;
      }

      // Delay recalculation if any rows are missing an index.
      // This can happen during the grid's initialization if the recalculation is triggered
      // as a result of the data provider responding synchronously to a page request created
      // in the middle of the virtualizer update loop. In this case, rows after the one that
      // triggered the page request may not have an index property yet. The lack of index
      // prevents _onDataProviderPageReceived from requesting children for these rows,
      // resulting in loading state being set to false and the recalculation beginning
      // before all the data is loaded. Note, rows without index get updated in later iterations
      // of the virtualizer update loop, ensuring the grid eventually reaches a stable state.
      const hasRowsWithUndefinedIndex = [...this.$.items.children].some((row) => row.index === undefined);
      if (hasRowsWithUndefinedIndex) {
        return;
      }

      const hasRowsWithClientHeight = [...this.$.items.children].some((row) => row.clientHeight > 0);
      if (hasRowsWithClientHeight) {
        this.__pendingRecalculateColumnWidths = false;
        this.recalculateColumnWidths();
      }
    }
  };
