/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';

const timeouts = {
  SCROLLING: 500,
  UPDATE_CONTENT_VISIBILITY: 100,
};

export const ScrollMixin = (superClass) =>
  class ScrollMixin extends superClass {
    static get properties() {
      return {
        /**
         * Allows you to choose between modes for rendering columns in the grid:
         *
         * "eager" (default): All columns are rendered upfront, regardless of their visibility within the viewport.
         * This mode should generally be preferred, as it avoids the limitations imposed by the "lazy" mode.
         * Use this mode unless the grid has a large number of columns and performance outweighs the limitations
         * in priority.
         *
         * "lazy": Optimizes the rendering of cells when there are multiple columns in the grid by virtualizing
         * horizontal scrolling. In this mode, body cells are rendered only when their corresponding columns are
         * inside the visible viewport.
         *
         * Using "lazy" rendering should be used only if you're dealing with a large number of columns and performance
         * is your highest priority. For most use cases, the default "eager" mode is recommended due to the
         * limitations imposed by the "lazy" mode.
         *
         * When using the "lazy" mode, keep the following limitations in mind:
         *
         * - Row Height: When only a number of columns are visible at once, the height of a row can only be that of
         * the highest cell currently visible on that row. Make sure each cell on a single row has the same height
         * as all other cells on that row. If row cells have different heights, users may experience jumpiness when
         * scrolling the grid horizontally as lazily rendered cells with different heights are scrolled into view.
         *
         * - Auto-width Columns: For the columns that are initially outside the visible viewport but still use auto-width,
         * only the header content is taken into account when calculating the column width because the body cells
         * of the columns outside the viewport are not initially rendered.
         *
         * - Screen Reader Compatibility: Screen readers may not be able to associate the focused cells with the correct
         * headers when only a subset of the body cells on a row is rendered.
         *
         * - Keyboard Navigation: Tabbing through focusable elements inside the grid body may not work as expected because
         * some of the columns that would include focusable elements in the body cells may be outside the visible viewport
         * and thus not rendered.
         *
         * @attr {eager|lazy} column-rendering
         */
        columnRendering: {
          type: String,
          value: 'eager',
          sync: true,
        },

        /**
         * Cached array of frozen cells
         * @private
         */
        _frozenCells: {
          type: Array,
          value: () => [],
        },

        /**
         * Cached array of cells frozen to end
         * @private
         */
        _frozenToEndCells: {
          type: Array,
          value: () => [],
        },
      };
    }

    static get observers() {
      return ['__columnRenderingChanged(_columnTree, columnRendering)'];
    }

    /** @private */
    get _scrollLeft() {
      return this.$.table.scrollLeft;
    }

    /** @protected */
    get _lazyColumns() {
      return this.columnRendering === 'lazy';
    }

    /** @protected */
    ready() {
      super.ready();

      this.scrollTarget = this.$.table;

      this.$.items.addEventListener('focusin', (e) => {
        const composedPath = e.composedPath();
        const row = composedPath[composedPath.indexOf(this.$.items) - 1];

        if (row) {
          // Don't change scroll position if the user is interacting with the mouse.
          if (!this._isMousedown) {
            // Make sure the focused element (row, cell, or focusable element inside a cell)
            // is inside the viewport. If the whole row fits into the viewport, then scroll
            // the row into view. This ensures that labels, helper texts and other related
            // elements of focusable elements within cells also become visible. When the row
            // is larger than the viewport, scroll the focus event target into the viewport.
            // This works better when focusing elements within cells, which could otherwise
            // still be outside the viewport when scrolling to the top or bottom of the row.
            const tableHeight = this.$.table.clientHeight;
            const headerHeight = this.$.header.clientHeight;
            const footerHeight = this.$.footer.clientHeight;
            const viewportHeight = tableHeight - headerHeight - footerHeight;
            const isRowLargerThanViewport = row.clientHeight > viewportHeight;
            const scrollTarget = isRowLargerThanViewport ? e.target : row;

            this.__scrollIntoViewport(scrollTarget);
          }
        }
      });

      this.$.table.addEventListener('scroll', () => this._afterScroll());

      this.__overflowController = new OverflowController(this, this.$.table);
      this.addController(this.__overflowController);
    }

    /**
     * Scroll to a flat index in the grid. The method doesn't take into account
     * the hierarchy of the items.
     *
     * @param {number} index Row index to scroll to
     * @protected
     */
    _scrollToFlatIndex(index) {
      index = Math.min(this._flatSize - 1, Math.max(0, index));
      this.__virtualizer.scrollToIndex(index);
      const rowElement = [...this.$.items.children].find((child) => child.index === index);
      this.__scrollIntoViewport(rowElement);
    }

    /**
     * Scrolls horizontally so that the column becomes visible in the viewport.
     *
     * The column can be specified either by its index (among visible columns
     * in visual order) or by the column element itself.
     *
     * @param {GridColumn | number} indexOrColumn - Column element or column index
     */
    scrollToColumn(indexOrColumn) {
      // Defer if grid not ready
      if (!this._columnTree) {
        this.__pendingScrollToColumn = indexOrColumn;
        return;
      }

      // Get visible leaf columns in visual order (respects reordering, excludes hidden)
      const visibleColumns = this._getColumnsInOrder();

      let column;
      if (typeof indexOrColumn === 'number') {
        column = visibleColumns[indexOrColumn];
        if (!column) {
          console.warn(`Column index ${indexOrColumn} is out of bounds`);
          return;
        }
      } else {
        column = indexOrColumn;
        if (!visibleColumns.includes(column)) {
          console.warn('Column is not a visible column of this grid');
          return;
        }
      }

      // Frozen columns are always visible, no scroll needed
      if (column.frozen || column.frozenToEnd) {
        return;
      }

      this._scrollHorizontallyToCell(column._headerCell);
      // Synchronously update cells when using lazy column rendering
      this.__updateColumnsBodyContentHidden();
    }

    /** @private */
    __scrollToPendingColumn() {
      if (this.__pendingScrollToColumn !== undefined) {
        const indexOrColumn = this.__pendingScrollToColumn;
        delete this.__pendingScrollToColumn;
        this.scrollToColumn(indexOrColumn);
      }
    }

    /**
     * Makes sure the given element is fully inside the visible viewport,
     * taking header/footer into account.
     * @private
     */
    __scrollIntoViewport(element) {
      if (!element) {
        return;
      }

      const elementRect = element.getBoundingClientRect();
      const elementComputedStyle = getComputedStyle(element);
      const elementTop = elementRect.top + parseInt(elementComputedStyle.scrollMarginTop || 0);
      const elementBottom = elementRect.bottom + parseInt(elementComputedStyle.scrollMarginBottom || 0);

      const footerTop = this.$.footer.getBoundingClientRect().top;
      const headerBottom = this.$.header.getBoundingClientRect().bottom;
      if (elementBottom > footerTop) {
        this.$.table.scrollTop += elementBottom - footerTop;
      } else if (elementTop < headerBottom) {
        this.$.table.scrollTop -= headerBottom - elementTop;
      }
    }

    /** @private */
    _scheduleScrolling() {
      this.$.scroller.toggleAttribute('scrolling', true);
      this._debounceScrolling = Debouncer.debounce(this._debounceScrolling, timeOut.after(timeouts.SCROLLING), () => {
        this.$.scroller.toggleAttribute('scrolling', false);
      });
    }

    /** @private */
    _afterScroll() {
      if (!this.hasAttribute('reordering')) {
        this._scheduleScrolling();
      }
      if (!this.hasAttribute('navigating')) {
        this._hideTooltip(true);
      }

      this._debounceColumnContentVisibility = Debouncer.debounce(
        this._debounceColumnContentVisibility,
        timeOut.after(timeouts.UPDATE_CONTENT_VISIBILITY),
        () => {
          // If horizontal scroll position changed and lazy column rendering is enabled,
          // update the visible columns.
          if (this._lazyColumns && this.__cachedScrollLeft !== this._scrollLeft) {
            this.__cachedScrollLeft = this._scrollLeft;
            this.__updateColumnsBodyContentHidden();
          }
        },
      );
    }

    /** @private */
    __updateColumnsBodyContentHidden() {
      if (!this._columnTree || !this._areSizerCellsAssigned()) {
        return;
      }

      this.__scrollToPendingColumn();

      const columnsInOrder = this._getColumnsInOrder();

      // Remove the column cells from the DOM if the column is outside the viewport.
      // Add the column cells to the DOM if the column is inside the viewport.
      //
      // Update the _bodyContentHidden property of the column to reflect the current
      // visibility state and make it run renderers for the cells if necessary.
      columnsInOrder.forEach((column) => {
        const bodyContentHidden = this._lazyColumns && !this.__isColumnInViewport(column);

        if (column._bodyContentHidden !== bodyContentHidden) {
          column._cells.forEach((cell) => {
            if (cell !== column._sizerCell) {
              if (bodyContentHidden) {
                cell.remove();
              } else if (cell.__parentRow) {
                // Add the cell to the correct DOM position in the row
                const followingColumnCell = [...cell.__parentRow.children].find(
                  (child) => columnsInOrder.indexOf(child._column) > columnsInOrder.indexOf(column),
                );
                cell.__parentRow.insertBefore(cell, followingColumnCell);
              }
            }
          });
        }

        column._bodyContentHidden = bodyContentHidden;
      });

      if (this._lazyColumns) {
        // Calculate the offset to apply to the body cells
        const lastFrozenColumn = [...columnsInOrder].reverse().find((column) => column.frozen);
        const lastFrozenColumnEnd = this.__getColumnEnd(lastFrozenColumn);
        const firstVisibleColumn = columnsInOrder.find((column) => !column.frozen && !column._bodyContentHidden);
        this.__lazyColumnsStart = this.__getColumnStart(firstVisibleColumn) - lastFrozenColumnEnd;
        this.$.items.style.setProperty('--_grid-lazy-columns-start', `${this.__lazyColumnsStart}px`);

        // Make sure the body has a focusable element in lazy columns mode
        this._resetKeyboardNavigation();
      }
    }

    /** @private */
    __getColumnEnd(column) {
      if (!column) {
        return this.__isRTL ? this.$.table.clientWidth : 0;
      }
      return column._sizerCell.offsetLeft + (this.__isRTL ? 0 : column._sizerCell.offsetWidth);
    }

    /** @private */
    __getColumnStart(column) {
      if (!column) {
        return this.__isRTL ? this.$.table.clientWidth : 0;
      }
      return column._sizerCell.offsetLeft + (this.__isRTL ? column._sizerCell.offsetWidth : 0);
    }

    /**
     * Returns true if the given column is horizontally inside the viewport.
     * @private
     */
    __isColumnInViewport(column) {
      if (column.frozen || column.frozenToEnd) {
        // Assume frozen columns to always be inside the viewport
        return true;
      }

      // Check if the column's sizer cell is inside the viewport
      return this.__isHorizontallyInViewport(column._sizerCell);
    }

    /** @private */
    __isHorizontallyInViewport(element) {
      return (
        element.offsetLeft + element.offsetWidth >= this._scrollLeft &&
        element.offsetLeft <= this._scrollLeft + this.clientWidth
      );
    }

    /** @private */
    __columnRenderingChanged(_columnTree, columnRendering) {
      setOrRemoveAttribute(this.$.scroller, 'column-rendering', columnRendering !== 'eager' && columnRendering);

      this.__updateColumnsBodyContentHidden();
    }

    /** @protected */
    _frozenCellsChanged() {
      this._debouncerCacheElements = Debouncer.debounce(this._debouncerCacheElements, microTask, () => {
        Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((cell) => {
          cell.style.transform = '';
          cell.style.removeProperty('--_grid-frozen-cell-offset');
          cell.style.removeProperty('--_grid-frozen-to-end-cell-offset');
        });
        this._frozenCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen]'));
        this._frozenToEndCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen-to-end]'));
        this.__updateFrozenCellOffsets();
      });
      this._debounceUpdateFrozenColumn();
    }

    /** @protected */
    _debounceUpdateFrozenColumn() {
      this.__debounceUpdateFrozenColumn = Debouncer.debounce(this.__debounceUpdateFrozenColumn, microTask, () =>
        this._updateFrozenColumn(),
      );
    }

    /** @private */
    _updateFrozenColumn() {
      if (!this._columnTree) {
        return;
      }

      const columnsRow = this._columnTree[this._columnTree.length - 1].slice(0);
      columnsRow.sort((a, b) => {
        return a._order - b._order;
      });

      let lastFrozen;
      let firstFrozenToEnd;

      // Use for loop to only iterate columns once
      for (let i = 0; i < columnsRow.length; i++) {
        const col = columnsRow[i];

        col._lastFrozen = false;
        col._firstFrozenToEnd = false;

        if (firstFrozenToEnd === undefined && col.frozenToEnd && !col.hidden) {
          firstFrozenToEnd = i;
        }

        if (col.frozen && !col.hidden) {
          lastFrozen = i;
        }
      }

      if (lastFrozen !== undefined) {
        columnsRow[lastFrozen]._lastFrozen = true;
      }

      if (firstFrozenToEnd !== undefined) {
        columnsRow[firstFrozenToEnd]._firstFrozenToEnd = true;
      }

      this.__updateColumnsBodyContentHidden();
    }

    /** @private */
    __updateFrozenCellOffsets() {
      if (!this._columnTree) {
        return;
      }

      this.$.table.querySelectorAll("[part~='row']:not(#sizer)").forEach((row) => {
        const cells = [...row.children].filter((cell) => cell._column);

        let frozenOffset = 0;
        cells
          .filter((cell) => cell._column.frozen)
          .forEach((cell) => {
            cell.style.setProperty('--_grid-frozen-cell-offset', `${frozenOffset}px`);
            frozenOffset += cell.getBoundingClientRect().width;
          });

        let frozenToEndOffset = 0;
        cells
          .filter((cell) => cell._column.frozenToEnd)
          .reverse()
          .forEach((cell) => {
            cell.style.setProperty('--_grid-frozen-to-end-cell-offset', `${frozenToEndOffset}px`);
            frozenToEndOffset += cell.getBoundingClientRect().width;
          });
      });
    }

    /** @private */
    _areSizerCellsAssigned() {
      return this._getColumnsInOrder().every((column) => column._sizerCell);
    }
  };
