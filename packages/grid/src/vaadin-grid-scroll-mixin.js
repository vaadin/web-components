/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { animationFrame, microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { getNormalizedScrollLeft } from '@vaadin/component-base/src/dir-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

const timeouts = {
  SCROLLING: 500,
  UPDATE_CONTENT_VISIBILITY: 100,
};

/**
 * @polymerMixin
 */
export const ScrollMixin = (superClass) =>
  class ScrollMixin extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * Makes the content on the grid columns render lazily when
         * the column cells are scrolled into view.
         *
         * If true, the grid will be able to optimize cell rendering
         * significantly when there are multiple columns in the grid.
         *
         * NOTE: make sure that each cell on a single row has the same
         * intrinsic height as all other cells on that row.
         * Otherwise, you may experience jumpiness when scrolling the grid
         * horizontally when lazily rendered cells with different
         * heights are scrolled into view.
         *
         * NOTE: columns with auto-width will only take the header content into account
         * when calculating the width for columns that are initially outside the viewport.
         *
         * @attr {boolean} lazy-columns
         * @type {boolean}
         */
        lazyColumns: {
          type: Boolean,
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

        /** @private */
        _rowWithFocusedElement: Element,
      };
    }

    static get observers() {
      return ['__lazyColumnsChanged(_columnTree, lazyColumns)'];
    }

    /** @private */
    get _scrollLeft() {
      return this.$.table.scrollLeft;
    }

    /** @private */
    get _scrollTop() {
      return this.$.table.scrollTop;
    }

    /**
     * Override (from iron-scroll-target-behavior) to avoid document scroll
     * @private
     */
    set _scrollTop(top) {
      this.$.table.scrollTop = top;
    }

    /** @protected */
    ready() {
      super.ready();

      this.scrollTarget = this.$.table;

      this.$.items.addEventListener('focusin', (e) => {
        const itemsIndex = e.composedPath().indexOf(this.$.items);
        this._rowWithFocusedElement = e.composedPath()[itemsIndex - 1];
      });
      this.$.items.addEventListener('focusout', () => {
        this._rowWithFocusedElement = undefined;
      });

      this.$.table.addEventListener('scroll', () => this._afterScroll());
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this._updateOverflow();
      this.__updateHorizontalScrollPosition();
    }

    /**
     * Scroll to a flat index in the grid. The method doesn't take into account
     * the hierarchy of the items.
     *
     * @param {number} index Row index to scroll to
     * @protected
     */
    _scrollToFlatIndex(index) {
      index = Math.min(this._effectiveSize - 1, Math.max(0, index));
      this.__virtualizer.scrollToIndex(index);
      this.__scrollIntoViewport(index);
    }

    /**
     * Makes sure the row with the given index (if found in the DOM) is fully
     * inside the visible viewport, taking header/footer into account.
     * @private
     */
    __scrollIntoViewport(index) {
      const rowElement = [...this.$.items.children].find((child) => child.index === index);
      if (rowElement) {
        const dstRect = rowElement.getBoundingClientRect();
        const footerTop = this.$.footer.getBoundingClientRect().top;
        const headerBottom = this.$.header.getBoundingClientRect().bottom;
        if (dstRect.bottom > footerTop) {
          this.$.table.scrollTop += dstRect.bottom - footerTop;
        } else if (dstRect.top < headerBottom) {
          this.$.table.scrollTop -= headerBottom - dstRect.top;
        }
      }
    }

    /** @private */
    _scheduleScrolling() {
      if (!this._scrollingFrame) {
        // Defer setting state attributes to avoid Edge hiccups
        this._scrollingFrame = requestAnimationFrame(() => this.$.scroller.toggleAttribute('scrolling', true));
      }
      this._debounceScrolling = Debouncer.debounce(this._debounceScrolling, timeOut.after(timeouts.SCROLLING), () => {
        cancelAnimationFrame(this._scrollingFrame);
        delete this._scrollingFrame;
        this.$.scroller.toggleAttribute('scrolling', false);
      });
    }

    /** @private */
    _afterScroll() {
      this.__updateHorizontalScrollPosition();

      if (!this.hasAttribute('reordering')) {
        this._scheduleScrolling();
      }
      if (!this.hasAttribute('navigating')) {
        this._hideTooltip(true);
      }

      this._updateOverflow();

      // If horizontal scroll position changed and lazy column rendering is enabled,
      // update the visible columns.
      if (this.lazyColumns && this.__cachedScrollLeft !== this._scrollLeft) {
        this.__cachedScrollLeft = this._scrollLeft;
        this._debounceColumnContentVisibility = Debouncer.debounce(
          this._debounceColumnContentVisibility,
          // TODO: Condsider using a timeout. Using animationFrame could be a bit laggy on a mobile device AND DESKTOP SAFARI!
          animationFrame,
          () => this.__updateColumnsBodyContentHidden(),
        );
      }
    }

    /** @private */
    __updateColumnsBodyContentHidden() {
      if (!this._columnTree) {
        return;
      }

      const columnsInOrder = this._getColumnsInOrder();

      // Return if sizer cells are not yet assigned to columns
      if (!columnsInOrder[0] || !columnsInOrder[0]._sizerCell) {
        return;
      }

      let bodyContentHiddenChanged = false;

      // Remove the column cells from the DOM if the column is outside the viewport.
      // Add the column cells to the DOM if the column is inside the viewport.
      //
      // Update the _bodyContentHidden property of the column to reflect the current
      // visibility state and make it run renderers for the cells if necessary.
      columnsInOrder.forEach((column) => {
        const bodyContentHidden = this.lazyColumns && !this.__isColumnInViewport(column);

        if (column._bodyContentHidden !== bodyContentHidden) {
          bodyContentHiddenChanged = true;
          column._cells.forEach((cell) => {
            if (cell !== column._sizerCell) {
              if (bodyContentHidden) {
                cell.remove();
              } else if (cell.__parentRow) {
                // TODO: Insert to the correct position
                cell.__parentRow.appendChild(cell);
              }
            }
          });
        }

        column._bodyContentHidden = bodyContentHidden;
      });

      if (bodyContentHiddenChanged) {
        // Frozen columns may have changed their visibility
        this._frozenCellsChanged();
      }

      if (this.lazyColumns) {
        // Calculate the offset to apply to the body cells
        const firstVisibleColumn = columnsInOrder.find((column) => !column.frozen && !column._bodyContentHidden);

        const lastFrozenColumn = [...columnsInOrder].reverse().find((column) => column.frozen);
        const lastFrozenColumnEnd = lastFrozenColumn
          ? lastFrozenColumn._sizerCell.offsetLeft + lastFrozenColumn._sizerCell.offsetWidth
          : 0;
        this.__lazyColumnsStart = firstVisibleColumn._sizerCell.offsetLeft - lastFrozenColumnEnd;
        // TODO: Test
        this.$.items.style.setProperty('--_grid-lazy-columns-start', `${this.__lazyColumnsStart}px`);
      }
    }

    /**
     * Returns true if the given column is horizontally inside the viewport.
     * @private
     */
    __isColumnInViewport(column) {
      if (column.frozen || column.frozenToEnd) {
        // Consider frozen columns to always be inside the viewport
        return true;
      }

      // Check if the column's sizer cell is inside the viewport
      // TODO: Test 1px offset (keyboard navigation)
      return (
        column._sizerCell.offsetLeft + column._sizerCell.offsetWidth > this._scrollLeft - 1 &&
        column._sizerCell.offsetLeft < this._scrollLeft + this.clientWidth + 1
      );
    }

    /** @private */
    __lazyColumnsChanged(_columnTree, lazyColumns) {
      this.$.scroller.toggleAttribute('lazy-columns', !!lazyColumns);

      this.__updateColumnsBodyContentHidden();
    }

    /** @private */
    _updateOverflow() {
      this._debounceOverflow = Debouncer.debounce(this._debounceOverflow, animationFrame, () => {
        this.__doUpdateOverflow();
      });
    }

    /** @private */
    __doUpdateOverflow() {
      // Set overflow styling attributes
      let overflow = '';
      const table = this.$.table;
      if (table.scrollTop < table.scrollHeight - table.clientHeight) {
        overflow += ' bottom';
      }

      if (table.scrollTop > 0) {
        overflow += ' top';
      }

      const scrollLeft = getNormalizedScrollLeft(table, this.getAttribute('dir'));
      if (scrollLeft > 0) {
        overflow += ' start';
      }

      if (scrollLeft < table.scrollWidth - table.clientWidth) {
        overflow += ' end';
      }

      if (this.__isRTL) {
        overflow = overflow.replace(/start|end/giu, (matched) => {
          return matched === 'start' ? 'end' : 'start';
        });
      }

      // TODO: Remove "right" and "left" values in the next major.
      if (table.scrollLeft < table.scrollWidth - table.clientWidth) {
        overflow += ' right';
      }

      if (table.scrollLeft > 0) {
        overflow += ' left';
      }

      const value = overflow.trim();
      if (value.length > 0 && this.getAttribute('overflow') !== value) {
        this.setAttribute('overflow', value);
      } else if (value.length === 0 && this.hasAttribute('overflow')) {
        this.removeAttribute('overflow');
      }
    }

    /** @protected */
    _frozenCellsChanged() {
      this._debouncerCacheElements = Debouncer.debounce(this._debouncerCacheElements, microTask, () => {
        Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((cell) => {
          cell.style.transform = '';
        });
        this._frozenCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen]'));
        this._frozenToEndCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen-to-end]'));
        this.__updateHorizontalScrollPosition();
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

        if ((col.frozen || col.frozenToEnd) && col._bodyContentHidden) {
          this.__updateColumnsBodyContentHidden();
        }
      }

      if (lastFrozen !== undefined) {
        columnsRow[lastFrozen]._lastFrozen = true;
      }

      if (firstFrozenToEnd !== undefined) {
        columnsRow[firstFrozenToEnd]._firstFrozenToEnd = true;
      }
    }

    /** @private */
    __updateHorizontalScrollPosition() {
      if (!this._columnTree) {
        return;
      }
      const scrollWidth = this.$.table.scrollWidth;
      const clientWidth = this.$.table.clientWidth;
      const scrollLeft = Math.max(0, this.$.table.scrollLeft);
      const normalizedScrollLeft = getNormalizedScrollLeft(this.$.table, this.getAttribute('dir'));

      // Position header, footer and items container
      const transform = `translate(${-scrollLeft}px, 0)`;
      this.$.header.style.transform = transform;
      this.$.footer.style.transform = transform;
      this.$.items.style.transform = transform;

      // Position frozen cells
      const x = this.__isRTL ? normalizedScrollLeft + clientWidth - scrollWidth : scrollLeft;
      const transformFrozen = `translate(${x}px, 0)`;
      this._frozenCells.forEach((cell) => {
        cell.style.transform = transformFrozen;
      });

      // Position cells frozen to end
      const remaining = this.__isRTL ? normalizedScrollLeft : scrollLeft + clientWidth - scrollWidth;
      const transformFrozenToEnd = `translate(${remaining}px, 0)`;

      let transformFrozenToEndBody = transformFrozenToEnd;

      if (this.lazyColumns) {
        // Lazy columns is used, calculate the offset to apply to the frozen to end cells
        const columnsInOrder = this._getColumnsInOrder();

        const lastVisibleColumn = [...columnsInOrder]
          .reverse()
          .find((column) => !column.frozenToEnd && !column._bodyContentHidden);
        const lastVisibleColumnEnd = lastVisibleColumn._sizerCell.offsetLeft + lastVisibleColumn._sizerCell.offsetWidth;

        const firstFrozenToEndColumn = columnsInOrder.find((column) => column.frozenToEnd);
        const firstFrozenToEndColumnStart = firstFrozenToEndColumn ? firstFrozenToEndColumn._sizerCell.offsetLeft : 0;

        const translateX = remaining + (firstFrozenToEndColumnStart - lastVisibleColumnEnd) + this.__lazyColumnsStart;
        transformFrozenToEndBody = `translate(${translateX}px, 0)`;
      }

      this._frozenToEndCells.forEach((cell) => {
        if (this.$.items.contains(cell)) {
          cell.style.transform = transformFrozenToEndBody;
        } else {
          cell.style.transform = transformFrozenToEnd;
        }
      });

      // Only update the --_grid-horizontal-scroll-position custom property when navigating
      // on row focus mode to avoid performance issues.
      if (this.hasAttribute('navigating') && this.__rowFocusMode) {
        this.$.table.style.setProperty('--_grid-horizontal-scroll-position', `${-x}px`);
      }
    }
  };
