/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementHidden } from '@vaadin/a11y-base';
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
         * @type {!ColumnRendering}
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
          // Make sure the row with the focused element is fully inside the visible viewport
          // Don't change scroll position if the user is interacting with the mouse
          if (!this._isMousedown) {
            this.__scrollIntoViewport(row.index);
          }

          if (!this.$.table.contains(e.relatedTarget)) {
            // Virtualizer can't catch the event because if orginates from the light DOM.
            // Dispatch a virtualizer-element-focused event for virtualizer to catch.
            this.$.table.dispatchEvent(new CustomEvent('virtualizer-element-focused', { detail: { element: row } }));
          }
        }
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

      // For Firefox, manually restore last scroll position when grid becomes
      // visible again. This solves an issue where switching visibility of two
      // grids causes Firefox trying to synchronize the scroll positions between
      // the two grid's table elements.
      // See https://github.com/vaadin/web-components/issues/5796
      if (this._firefox) {
        const isVisible = !isElementHidden(this);
        if (isVisible && this.__previousVisible === false) {
          this._scrollTop = this.__memorizedScrollTop || 0;
        }
        this.__previousVisible = isVisible;
      }
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

      // Memorize last scroll position in Firefox
      if (this._firefox) {
        const isVisible = !isElementHidden(this);
        if (isVisible && this.__previousVisible !== false) {
          this.__memorizedScrollTop = this._scrollTop;
        }
      }
    }

    /** @private */
    __updateColumnsBodyContentHidden() {
      if (!this._columnTree || !this._areSizerCellsAssigned()) {
        return;
      }

      const columnsInOrder = this._getColumnsInOrder();
      let bodyContentHiddenChanged = false;

      // Remove the column cells from the DOM if the column is outside the viewport.
      // Add the column cells to the DOM if the column is inside the viewport.
      //
      // Update the _bodyContentHidden property of the column to reflect the current
      // visibility state and make it run renderers for the cells if necessary.
      columnsInOrder.forEach((column) => {
        const bodyContentHidden = this._lazyColumns && !this.__isColumnInViewport(column);

        if (column._bodyContentHidden !== bodyContentHidden) {
          bodyContentHiddenChanged = true;
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

      if (bodyContentHiddenChanged) {
        // Frozen columns may have changed their visibility
        this._frozenCellsChanged();
      }

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
      if (columnRendering === 'eager') {
        this.$.scroller.removeAttribute('column-rendering');
      } else {
        this.$.scroller.setAttribute('column-rendering', columnRendering);
      }

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

      if (this._lazyColumns && this._areSizerCellsAssigned()) {
        // Lazy column rendering is used, calculate the offset to apply to the frozen to end cells
        const columnsInOrder = this._getColumnsInOrder();

        const lastVisibleColumn = [...columnsInOrder]
          .reverse()
          .find((column) => !column.frozenToEnd && !column._bodyContentHidden);
        const lastVisibleColumnEnd = this.__getColumnEnd(lastVisibleColumn);

        const firstFrozenToEndColumn = columnsInOrder.find((column) => column.frozenToEnd);
        const firstFrozenToEndColumnStart = this.__getColumnStart(firstFrozenToEndColumn);

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

    /** @private */
    _areSizerCellsAssigned() {
      return this._getColumnsInOrder().every((column) => column._sizerCell);
    }
  };
