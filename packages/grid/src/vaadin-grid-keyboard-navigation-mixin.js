/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { get } from '@vaadin/component-base/src/path-utils.js';

function isRow(element) {
  return element instanceof HTMLTableRowElement;
}

function isCell(element) {
  return element instanceof HTMLTableCellElement;
}

function isDetailsCell(element) {
  return element.matches('[part~="details-cell"]');
}

/**
 * @polymerMixin
 */
export const KeyboardNavigationMixin = (superClass) =>
  class KeyboardNavigationMixin extends superClass {
    static get properties() {
      return {
        /** @private */
        _headerFocusable: {
          type: Object,
          observer: '_focusableChanged',
          sync: true,
        },

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _itemsFocusable: {
          type: Object,
          observer: '_focusableChanged',
          sync: true,
        },

        /** @private */
        _footerFocusable: {
          type: Object,
          observer: '_focusableChanged',
          sync: true,
        },

        /** @private */
        _navigatingIsHidden: Boolean,

        /**
         * @type {number}
         * @protected
         */
        _focusedItemIndex: {
          type: Number,
          value: 0,
        },

        /** @private */
        _focusedColumnOrder: Number,

        /** @private */
        _focusedCell: {
          type: Object,
          observer: '_focusedCellChanged',
          sync: true,
        },

        /**
         * Indicates whether the grid is currently in interaction mode.
         * In interaction mode the user is currently interacting with a control,
         * such as an input or a select, within a cell.
         * In interaction mode keyboard navigation between cells is disabled.
         * Interaction mode also prevents the focus target cell of that section of
         * the grid from receiving focus, allowing the user to switch focus to
         * controls in adjacent cells, rather than focussing the outer cell
         * itself.
         * @type {boolean}
         * @private
         */
        interacting: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          readOnly: true,
          observer: '_interactingChanged',
        },
      };
    }

    /** @private */
    get __rowFocusMode() {
      return [this._headerFocusable, this._itemsFocusable, this._footerFocusable].some(isRow);
    }

    set __rowFocusMode(value) {
      ['_itemsFocusable', '_footerFocusable', '_headerFocusable'].forEach((prop) => {
        const focusable = this[prop];
        if (value) {
          const parent = focusable && focusable.parentElement;
          if (isCell(focusable)) {
            // Cell itself focusable (default)
            this[prop] = parent;
          } else if (isCell(parent)) {
            // Focus button mode is enabled for the column,
            // button element inside the cell is focusable.
            this[prop] = parent.parentElement;
          }
        } else if (!value && isRow(focusable)) {
          const cell = focusable.firstElementChild;
          this[prop] = cell._focusButton || cell;
        }
      });
    }

    /** @private */
    get _visibleItemsCount() {
      return this._lastVisibleIndex - this._firstVisibleIndex - 1;
    }

    /** @protected */
    ready() {
      super.ready();

      if (this._ios || this._android) {
        // Disable keyboard navigation on mobile devices
        return;
      }

      this.addEventListener('keydown', this._onKeyDown);
      this.addEventListener('keyup', this._onKeyUp);

      this.addEventListener('focusin', this._onFocusIn);
      this.addEventListener('focusout', this._onFocusOut);

      // When focus goes from cell to another cell, focusin/focusout events do
      // not escape the grid's shadowRoot, thus listening inside the shadowRoot.
      this.$.table.addEventListener('focusin', this._onContentFocusIn.bind(this));

      this.addEventListener('mousedown', () => {
        this.toggleAttribute('navigating', false);
        this._isMousedown = true;

        // Reset stored order when moving focus with mouse.
        this._focusedColumnOrder = undefined;
      });
      this.addEventListener('mouseup', () => {
        this._isMousedown = false;
      });
    }

    /** @private */
    _focusableChanged(focusable, oldFocusable) {
      if (oldFocusable) {
        oldFocusable.setAttribute('tabindex', '-1');
      }
      if (focusable) {
        this._updateGridSectionFocusTarget(focusable);
      }
    }

    /** @private */
    _focusedCellChanged(focusedCell, oldFocusedCell) {
      if (oldFocusedCell) {
        removeValueFromAttribute(oldFocusedCell, 'part', 'focused-cell');
      }

      if (focusedCell) {
        addValueToAttribute(focusedCell, 'part', 'focused-cell');
      }
    }

    /** @private */
    _interactingChanged() {
      // Update focus targets when entering / exiting interaction mode
      this._updateGridSectionFocusTarget(this._headerFocusable);
      this._updateGridSectionFocusTarget(this._itemsFocusable);
      this._updateGridSectionFocusTarget(this._footerFocusable);
    }

    /**
     * Since the focused cell/row state is stored as an element reference, the reference may get
     * out of sync when the virtual indexes for elements update due to effective size change.
     * This function updates the reference to the correct element after a possible index change.
     * @private
     */
    __updateItemsFocusable() {
      if (!this._itemsFocusable) {
        return;
      }

      const wasFocused = this.shadowRoot.activeElement === this._itemsFocusable;

      this._getRenderedRows().forEach((row) => {
        if (row.index === this._focusedItemIndex) {
          if (this.__rowFocusMode) {
            // Row focus mode
            this._itemsFocusable = row;
          } else {
            // Cell focus mode
            let parent = this._itemsFocusable.parentElement;
            let cell = this._itemsFocusable;

            if (parent) {
              // Focus button mode is enabled for the column,
              // button element inside the cell is focusable.
              if (isCell(parent)) {
                cell = parent;
                parent = parent.parentElement;
              }

              const cellIndex = [...parent.children].indexOf(cell);
              this._itemsFocusable = this.__getFocusable(row, row.children[cellIndex]);
            }
          }
        }
      });

      if (wasFocused) {
        this._itemsFocusable.focus();
      }
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    _onKeyDown(e) {
      const key = e.key;

      let keyGroup;
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'PageUp':
        case 'PageDown':
        case 'Home':
        case 'End':
          keyGroup = 'Navigation';
          break;
        case 'Enter':
        case 'Escape':
        case 'F2':
          keyGroup = 'Interaction';
          break;
        case 'Tab':
          keyGroup = 'Tab';
          break;
        case ' ':
          keyGroup = 'Space';
          break;
        default:
          break;
      }

      this._detectInteracting(e);
      if (this.interacting && keyGroup !== 'Interaction') {
        // When in the interacting mode, only the "Interaction" keys are handled.
        keyGroup = undefined;
      }

      if (keyGroup) {
        this[`_on${keyGroup}KeyDown`](e, key);
      }
    }

    /** @private */
    __ensureFlatIndexInViewport(index) {
      const targetRowInDom = [...this.$.items.children].find((child) => child.index === index);
      if (!targetRowInDom) {
        this._scrollToFlatIndex(index);
      } else {
        this.__scrollIntoViewport(index);
      }
    }

    /** @private */
    __isRowExpandable(row) {
      if (this.itemHasChildrenPath) {
        const item = row._item;
        return !!(item && get(this.itemHasChildrenPath, item) && !this._isExpanded(item));
      }
    }

    /** @private */
    __isRowCollapsible(row) {
      return this._isExpanded(row._item);
    }

    /** @private */
    _onNavigationKeyDown(e, key) {
      e.preventDefault();

      const isRTL = this.__isRTL;
      const activeRow = e.composedPath().find(isRow);
      const activeCell = e.composedPath().find(isCell);

      // Handle keyboard interaction as defined in:
      // https://w3c.github.io/aria-practices/#keyboard-interaction-24

      let dx = 0,
        dy = 0;
      switch (key) {
        case 'ArrowRight':
          dx = isRTL ? -1 : 1;
          break;
        case 'ArrowLeft':
          dx = isRTL ? 1 : -1;
          break;
        case 'Home':
          if (this.__rowFocusMode) {
            // "If focus is on a row, moves focus to the first row. If focus is in the first row, focus does not move."
            dy = -Infinity;
          } else if (e.ctrlKey) {
            // "If focus is on a cell, moves focus to the first cell in the column. If focus is in the first row, focus does not move."
            dy = -Infinity;
          } else {
            // "If focus is on a cell, moves focus to the first cell in the row. If focus is in the first cell of the row, focus does not move."
            dx = -Infinity;
          }
          break;
        case 'End':
          if (this.__rowFocusMode) {
            // "If focus is on a row, moves focus to the last row. If focus is in the last row, focus does not move."
            dy = Infinity;
          } else if (e.ctrlKey) {
            // "If focus is on a cell, moves focus to the last cell in the column. If focus is in the last row, focus does not move."
            dy = Infinity;
          } else {
            // "If focus is on a cell, moves focus to the last cell in the row. If focus is in the last cell of the row, focus does not move."
            dx = Infinity;
          }
          break;
        case 'ArrowDown':
          dy = 1;
          break;
        case 'ArrowUp':
          dy = -1;
          break;
        case 'PageDown':
          // Check if the active group is body
          if (this.$.items.contains(activeRow)) {
            const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);
            // Scroll the current row to the top...
            this._scrollToFlatIndex(currentRowIndex);
          }
          // ...only then measure the visible items count
          dy = this._visibleItemsCount;
          break;
        case 'PageUp':
          dy = -this._visibleItemsCount;
          break;
        default:
          break;
      }

      if ((this.__rowFocusMode && !activeRow) || (!this.__rowFocusMode && !activeCell)) {
        // When using a screen reader, it's possible that neither a cell nor a row is focused.
        return;
      }

      const forwardsKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
      const backwardsKey = isRTL ? 'ArrowRight' : 'ArrowLeft';
      if (key === forwardsKey) {
        // "Right Arrow:"
        if (this.__rowFocusMode) {
          // In row focus mode
          if (this.__isRowExpandable(activeRow)) {
            // "If focus is on a collapsed row, expands the row."
            this.expandItem(activeRow._item);
            return;
          }
          // "If focus is on an expanded row or is on a row that does not have child rows,
          // moves focus to the first cell in the row."
          this.__rowFocusMode = false;
          this._onCellNavigation(activeRow.firstElementChild, 0, 0);
          return;
        }
      } else if (key === backwardsKey) {
        // "Left Arrow:"
        if (this.__rowFocusMode) {
          // In row focus mode
          if (this.__isRowCollapsible(activeRow)) {
            // "If focus is on an expanded row, collapses the row."
            this.collapseItem(activeRow._item);
            return;
          }
        } else {
          // In cell focus mode
          const activeRowCells = [...activeRow.children].sort((a, b) => a._order - b._order);
          if (activeCell === activeRowCells[0] || isDetailsCell(activeCell)) {
            // "If focus is on the first cell in a row and row focus is supported, moves focus to the row."
            this.__rowFocusMode = true;
            this._onRowNavigation(activeRow, 0);
            return;
          }
        }
      }

      // Navigate
      if (this.__rowFocusMode) {
        // Navigate the rows
        this._onRowNavigation(activeRow, dy);
      } else {
        // Navigate the cells
        this._onCellNavigation(activeCell, dx, dy);
      }
    }

    /**
     * Focuses the target row after navigating by the given dy offset.
     * If the row is not in the viewport, it is first scrolled to.
     * @private
     */
    _onRowNavigation(activeRow, dy) {
      const { dstRow } = this.__navigateRows(dy, activeRow);

      if (dstRow) {
        dstRow.focus();
      }
    }

    /** @private */
    __getIndexInGroup(row, bodyFallbackIndex) {
      const rowGroup = row.parentNode;
      // Body rows have index property, otherwise DOM child index of the row is used.
      if (rowGroup === this.$.items) {
        return bodyFallbackIndex !== undefined ? bodyFallbackIndex : row.index;
      }
      return [...rowGroup.children].indexOf(row);
    }

    /**
     * Returns the target row after navigating by the given dy offset.
     * Also returns information whether the details cell should be the target on the target row.
     * If the row is not in the viewport, it is first scrolled to.
     * @private
     */
    __navigateRows(dy, activeRow, activeCell) {
      const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);
      const activeRowGroup = activeRow.parentNode;
      const maxRowIndex = (activeRowGroup === this.$.items ? this._flatSize : activeRowGroup.children.length) - 1;

      // Index of the destination row
      let dstRowIndex = Math.max(0, Math.min(currentRowIndex + dy, maxRowIndex));

      if (activeRowGroup !== this.$.items) {
        // Navigating header/footer rows

        // Header and footer could have hidden rows, e. g., if none of the columns
        // or groups on the given column tree level define template. Skip them
        // in vertical keyboard navigation.
        if (dstRowIndex > currentRowIndex) {
          while (dstRowIndex < maxRowIndex && activeRowGroup.children[dstRowIndex].hidden) {
            dstRowIndex += 1;
          }
        } else if (dstRowIndex < currentRowIndex) {
          while (dstRowIndex > 0 && activeRowGroup.children[dstRowIndex].hidden) {
            dstRowIndex -= 1;
          }
        }

        this.toggleAttribute('navigating', true);

        return { dstRow: activeRowGroup.children[dstRowIndex] };
      }
      // Navigating body rows

      let dstIsRowDetails = false;
      if (activeCell) {
        const isRowDetails = isDetailsCell(activeCell);
        // Row details navigation logic
        if (activeRowGroup === this.$.items) {
          const item = activeRow._item;
          const { item: dstItem } = this._dataProviderController.getFlatIndexContext(dstRowIndex);
          // Should we navigate to row details?
          if (isRowDetails) {
            dstIsRowDetails = dy === 0;
          } else {
            dstIsRowDetails =
              (dy === 1 && this._isDetailsOpened(item)) ||
              (dy === -1 && dstRowIndex !== currentRowIndex && this._isDetailsOpened(dstItem));
          }
          // Should we navigate between details and regular cells of the same row?
          if (dstIsRowDetails !== isRowDetails && ((dy === 1 && dstIsRowDetails) || (dy === -1 && !dstIsRowDetails))) {
            dstRowIndex = currentRowIndex;
          }
        }
      }

      // Ensure correct vertical scroll position, destination row is visible
      this.__ensureFlatIndexInViewport(dstRowIndex);

      // When scrolling with repeated keydown, sometimes FocusEvent listeners
      // are too late to update _focusedItemIndex. Ensure next keydown
      // listener invocation gets updated _focusedItemIndex value.
      this._focusedItemIndex = dstRowIndex;

      // Reapply navigating state in case it was removed due to previous item
      // being focused with the mouse.
      this.toggleAttribute('navigating', true);

      return {
        dstRow: [...activeRowGroup.children].find((el) => !el.hidden && el.index === dstRowIndex),
        dstIsRowDetails,
      };
    }

    /**
     * Focuses the target cell after navigating by the given dx and dy offset.
     * If the cell is not in the viewport, it is first scrolled to.
     * @private
     */
    _onCellNavigation(activeCell, dx, dy) {
      const activeRow = activeCell.parentNode;
      const { dstRow, dstIsRowDetails } = this.__navigateRows(dy, activeRow, activeCell);
      if (!dstRow) {
        return;
      }

      let columnIndex = [...activeRow.children].indexOf(activeCell);
      if (this.$.items.contains(activeCell)) {
        // lazy column rendering may be enabled, so we need use the always visible sizer cells to find the column index
        columnIndex = [...this.$.sizer.children].findIndex((sizerCell) => sizerCell._column === activeCell._column);
      }

      const isCurrentCellRowDetails = isDetailsCell(activeCell);
      const activeRowGroup = activeRow.parentNode;
      const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);

      // _focusedColumnOrder is memoized - this is to ensure predictable
      // navigation when entering and leaving detail and column group cells.
      if (this._focusedColumnOrder === undefined) {
        if (isCurrentCellRowDetails) {
          this._focusedColumnOrder = 0;
        } else {
          this._focusedColumnOrder = this._getColumns(activeRowGroup, currentRowIndex).filter((c) => !c.hidden)[
            columnIndex
          ]._order;
        }
      }

      if (dstIsRowDetails) {
        // Focusing a row details cell on the destination row
        const dstCell = [...dstRow.children].find(isDetailsCell);
        dstCell.focus();
      } else {
        // Focusing a regular cell on the destination row

        // Find orderedColumnIndex - the index of order closest matching the
        // original _focusedColumnOrder in the sorted array of orders
        // of the visible columns on the destination row.
        const dstRowIndex = this.__getIndexInGroup(dstRow, this._focusedItemIndex);
        const dstColumns = this._getColumns(activeRowGroup, dstRowIndex).filter((c) => !c.hidden);
        const dstSortedColumnOrders = dstColumns.map((c) => c._order).sort((b, a) => b - a);
        const maxOrderedColumnIndex = dstSortedColumnOrders.length - 1;
        const orderedColumnIndex = dstSortedColumnOrders.indexOf(
          dstSortedColumnOrders
            .slice(0)
            .sort((b, a) => Math.abs(b - this._focusedColumnOrder) - Math.abs(a - this._focusedColumnOrder))[0],
        );

        // Index of the destination column order
        const dstOrderedColumnIndex =
          dy === 0 && isCurrentCellRowDetails
            ? orderedColumnIndex
            : Math.max(0, Math.min(orderedColumnIndex + dx, maxOrderedColumnIndex));

        if (dstOrderedColumnIndex !== orderedColumnIndex) {
          // Horizontal movement invalidates stored _focusedColumnOrder
          this._focusedColumnOrder = undefined;
        }

        const columnIndexByOrder = dstColumns.reduce((acc, col, i) => {
          acc[col._order] = i;
          return acc;
        }, {});
        const dstColumnIndex = columnIndexByOrder[dstSortedColumnOrders[dstOrderedColumnIndex]];

        let dstCell;
        if (this.$.items.contains(activeCell)) {
          const dstSizerCell = this.$.sizer.children[dstColumnIndex];
          if (this._lazyColumns) {
            // If the column is not in the viewport, scroll it into view.
            if (!this.__isColumnInViewport(dstSizerCell._column)) {
              dstSizerCell.scrollIntoView();
            }
            this.__updateColumnsBodyContentHidden();
            this.__updateHorizontalScrollPosition();
          }

          dstCell = [...dstRow.children].find((cell) => cell._column === dstSizerCell._column);
          // Ensure correct horizontal scroll position once the destination cell is available.
          this._scrollHorizontallyToCell(dstCell);
        } else {
          dstCell = dstRow.children[dstColumnIndex];
          this._scrollHorizontallyToCell(dstCell);
        }

        dstCell.focus();
      }
    }

    /** @private */
    _onInteractionKeyDown(e, key) {
      const localTarget = e.composedPath()[0];
      const localTargetIsTextInput =
        localTarget.localName === 'input' &&
        !/^(button|checkbox|color|file|image|radio|range|reset|submit)$/iu.test(localTarget.type);

      let wantInteracting;
      switch (key) {
        case 'Enter':
          wantInteracting = this.interacting ? !localTargetIsTextInput : true;
          break;
        case 'Escape':
          wantInteracting = false;
          break;
        case 'F2':
          wantInteracting = !this.interacting;
          break;
        default:
          break;
      }

      const { cell } = this._getGridEventLocation(e);

      if (this.interacting !== wantInteracting && cell !== null) {
        if (wantInteracting) {
          const focusTarget =
            cell._content.querySelector('[focus-target]') ||
            // If a child element hasn't been explicitly marked as a focus target,
            // fall back to any focusable element inside the cell.
            [...cell._content.querySelectorAll('*')].find((node) => this._isFocusable(node));
          if (focusTarget) {
            e.preventDefault();
            focusTarget.focus();
            this._setInteracting(true);
            this.toggleAttribute('navigating', false);
          }
        } else {
          e.preventDefault();
          this._focusedColumnOrder = undefined;
          cell.focus();
          this._setInteracting(false);
          this.toggleAttribute('navigating', true);
        }
      }

      if (key === 'Escape') {
        this._hideTooltip(true);
      }
    }

    /** @private */
    _predictFocusStepTarget(srcElement, step) {
      const tabOrder = [
        this.$.table,
        this._headerFocusable,
        this.__emptyState ? this.$.emptystatecell : this._itemsFocusable,
        this._footerFocusable,
        this.$.focusexit,
      ];

      let index = tabOrder.indexOf(srcElement);

      index += step;
      while (index >= 0 && index <= tabOrder.length - 1) {
        let rowElement = tabOrder[index];
        if (rowElement && !this.__rowFocusMode) {
          rowElement = tabOrder[index].parentNode;
        }

        if (!rowElement || rowElement.hidden) {
          index += step;
        } else {
          break;
        }
      }

      let focusStepTarget = tabOrder[index];

      // If the target focusable is tied to a column that is not visible,
      // find the first visible column and update the target in order to
      // prevent scrolling to the start of the row.
      if (focusStepTarget && !this.__isHorizontallyInViewport(focusStepTarget)) {
        const firstVisibleColumn = this._getColumnsInOrder().find((column) => this.__isColumnInViewport(column));
        if (firstVisibleColumn) {
          if (focusStepTarget === this._headerFocusable) {
            focusStepTarget = firstVisibleColumn._headerCell;
          } else if (focusStepTarget === this._itemsFocusable) {
            const rowIndex = focusStepTarget._column._cells.indexOf(focusStepTarget);
            focusStepTarget = firstVisibleColumn._cells[rowIndex];
          } else if (focusStepTarget === this._footerFocusable) {
            focusStepTarget = firstVisibleColumn._footerCell;
          }
        }
      }

      return focusStepTarget;
    }

    /** @private */
    _onTabKeyDown(e) {
      let focusTarget = this._predictFocusStepTarget(e.composedPath()[0], e.shiftKey ? -1 : 1);

      // Can be undefined if grid has tabindex
      if (!focusTarget) {
        return;
      }

      // Prevent focus-trap logic from intercepting the event.
      e.stopPropagation();

      if (focusTarget === this._itemsFocusable) {
        this.__ensureFlatIndexInViewport(this._focusedItemIndex);

        // Ensure the correct element is set as focusable after scrolling.
        // The virtualizer may use a different element to render the item.
        this.__updateItemsFocusable();

        focusTarget = this._itemsFocusable;
      }

      focusTarget.focus();

      // If the next element is the table or focusexit, it indicates the user
      // intends to leave the grid. In this case, we move focus to these elements
      // without preventing the default Tab behavior. The default behavior then
      // starts from these elements and moves focus outside the grid.
      if (focusTarget !== this.$.table && focusTarget !== this.$.focusexit) {
        e.preventDefault();
      }

      this.toggleAttribute('navigating', true);
    }

    /** @private */
    _onSpaceKeyDown(e) {
      e.preventDefault();

      const element = e.composedPath()[0];
      const isElementRow = isRow(element);
      if (isElementRow || !element._content || !element._content.firstElementChild) {
        this.dispatchEvent(
          new CustomEvent(isElementRow ? 'row-activate' : 'cell-activate', {
            detail: {
              model: this.__getRowModel(isElementRow ? element : element.parentElement),
            },
          }),
        );
      }
    }

    /** @private */
    _onKeyUp(e) {
      if (!/^( |SpaceBar)$/u.test(e.key) || this.interacting) {
        return;
      }

      e.preventDefault();

      const cell = e.composedPath()[0];
      if (cell._content && cell._content.firstElementChild) {
        const wasNavigating = this.hasAttribute('navigating');
        cell._content.firstElementChild.dispatchEvent(
          new MouseEvent('click', {
            shiftKey: e.shiftKey,
            bubbles: true,
            composed: true,
            cancelable: true,
          }),
        );
        this.toggleAttribute('navigating', wasNavigating);
      }
    }

    /**
     * @param {!FocusEvent} e
     * @protected
     */
    _onFocusIn(e) {
      if (!this._isMousedown) {
        this.toggleAttribute('navigating', true);
      }

      const rootTarget = e.composedPath()[0];

      if (rootTarget === this.$.table || rootTarget === this.$.focusexit) {
        if (!this._isMousedown) {
          // The focus enters the top (bottom) of the grid, meaning that user has
          // tabbed (shift-tabbed) into the grid. Move the focus to
          // the first (the last) focusable.
          this._predictFocusStepTarget(rootTarget, rootTarget === this.$.table ? 1 : -1).focus();
        }
        this._setInteracting(false);
      } else {
        this._detectInteracting(e);
      }
    }

    /**
     * @param {!FocusEvent} e
     * @protected
     */
    _onFocusOut(e) {
      this.toggleAttribute('navigating', false);
      this._detectInteracting(e);
      this._hideTooltip();
      this._focusedCell = null;
    }

    /** @private */
    _onContentFocusIn(e) {
      const { section, cell, row } = this._getGridEventLocation(e);

      if (!cell && !this.__rowFocusMode) {
        return;
      }

      this._detectInteracting(e);

      if (section && (cell || row)) {
        this._activeRowGroup = section;

        if (section === this.$.header) {
          this._headerFocusable = this.__getFocusable(row, cell);
        } else if (section === this.$.items) {
          this._itemsFocusable = this.__getFocusable(row, cell);
          this._focusedItemIndex = row.index;
        } else if (section === this.$.footer) {
          this._footerFocusable = this.__getFocusable(row, cell);
        }

        if (cell) {
          const context = this.getEventContext(e);
          this.__pendingBodyCellFocus = this.loading && context.section === 'body';
          if (!this.__pendingBodyCellFocus && cell !== this.$.emptystatecell) {
            // Fire a cell-focus event for the cell
            cell.dispatchEvent(new CustomEvent('cell-focus', { bubbles: true, composed: true, detail: { context } }));
          }
          this._focusedCell = cell._focusButton || cell;

          if (isKeyboardActive() && e.target === cell) {
            this._showTooltip(e);
          }
        } else {
          this._focusedCell = null;
        }
      }
    }

    /**
     * @private
     */
    __dispatchPendingBodyCellFocus() {
      // If the body cell focus was pending, dispatch the event once loading is done
      if (this.__pendingBodyCellFocus && this.shadowRoot.activeElement === this._itemsFocusable) {
        this._itemsFocusable.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      }
    }

    /**
     * Get the focusable element depending on the current focus mode.
     * It can be a row, a cell, or a focusable div inside a cell.
     *
     * @param {HTMLElement} row
     * @param {HTMLElement} cell
     * @return {HTMLElement}
     * @private
     */
    __getFocusable(row, cell) {
      return this.__rowFocusMode ? row : cell._focusButton || cell;
    }

    /**
     * Enables interaction mode if a cells descendant receives focus or keyboard
     * input. Disables it if the event is not related to cell content.
     * @param {!KeyboardEvent|!FocusEvent} e
     * @private
     */
    _detectInteracting(e) {
      const isInteracting = e.composedPath().some((el) => el.localName === 'slot' && this.shadowRoot.contains(el));
      this._setInteracting(isInteracting);
      this.__updateHorizontalScrollPosition();
    }

    /**
     * Enables or disables the focus target of the containing section of the
     * grid from receiving focus, based on whether the user is interacting with
     * that section of the grid.
     * @param {HTMLElement} focusTarget
     * @private
     */
    _updateGridSectionFocusTarget(focusTarget) {
      if (!focusTarget) {
        return;
      }

      const section = this._getGridSectionFromFocusTarget(focusTarget);
      const isInteractingWithinActiveSection = this.interacting && section === this._activeRowGroup;

      focusTarget.tabIndex = isInteractingWithinActiveSection ? -1 : 0;
    }

    /** @protected */
    _preventScrollerRotatingCellFocus() {
      if (this._activeRowGroup !== this.$.items) {
        return;
      }

      this.__preventScrollerRotatingCellFocusDebouncer = Debouncer.debounce(
        this.__preventScrollerRotatingCellFocusDebouncer,
        animationFrame,
        () => {
          const isItemsRowGroupActive = this._activeRowGroup === this.$.items;
          const isFocusedItemRendered = this._getRenderedRows().some((row) => row.index === this._focusedItemIndex);
          if (isFocusedItemRendered) {
            // Ensure the correct element is focused, as the virtualizer
            // may use different elements when re-rendering visible items.
            this.__updateItemsFocusable();

            // The focused item is visible, so restore the cell focus outline
            // and navigation mode.
            if (isItemsRowGroupActive && !this.__rowFocusMode) {
              this._focusedCell = this._itemsFocusable;
            }

            if (this._navigatingIsHidden) {
              this.toggleAttribute('navigating', true);
              this._navigatingIsHidden = false;
            }
          } else if (isItemsRowGroupActive) {
            // The focused item was scrolled out of view and focus is still inside body,
            // so remove the cell focus outline and hide navigation mode.
            this._focusedCell = null;

            if (this.hasAttribute('navigating')) {
              this._navigatingIsHidden = true;
              this.toggleAttribute('navigating', false);
            }
          }
        },
      );
    }

    /**
     * @param {HTMLTableSectionElement=} rowGroup
     * @param {number=} rowIndex
     * @return {!Array<!GridColumn>}
     * @protected
     */
    _getColumns(rowGroup, rowIndex) {
      let columnTreeLevel = this._columnTree.length - 1;
      if (rowGroup === this.$.header) {
        columnTreeLevel = rowIndex;
      } else if (rowGroup === this.$.footer) {
        columnTreeLevel = this._columnTree.length - 1 - rowIndex;
      }
      return this._columnTree[columnTreeLevel];
    }

    /** @private */
    __isValidFocusable(element) {
      return this.$.table.contains(element) && element.offsetHeight;
    }

    /** @protected */
    _resetKeyboardNavigation() {
      if (!this.$ && this.performUpdate) {
        this.performUpdate();
      }
      // Header / footer
      ['header', 'footer'].forEach((section) => {
        if (!this.__isValidFocusable(this[`_${section}Focusable`])) {
          const firstVisibleRow = [...this.$[section].children].find((row) => row.offsetHeight);
          const firstVisibleCell = firstVisibleRow ? [...firstVisibleRow.children].find((cell) => !cell.hidden) : null;
          if (firstVisibleRow && firstVisibleCell) {
            this[`_${section}Focusable`] = this.__getFocusable(firstVisibleRow, firstVisibleCell);
          }
        }
      });

      // Body
      if (!this.__isValidFocusable(this._itemsFocusable) && this.$.items.firstElementChild) {
        const firstVisibleRow = this.__getFirstVisibleItem();
        const firstVisibleCell = firstVisibleRow ? [...firstVisibleRow.children].find((cell) => !cell.hidden) : null;

        if (firstVisibleCell && firstVisibleRow) {
          // Reset memoized column
          this._focusedColumnOrder = undefined;
          this._itemsFocusable = this.__getFocusable(firstVisibleRow, firstVisibleCell);
        }
      } else {
        this.__updateItemsFocusable();
      }
    }

    /**
     * @param {!HTMLElement} dstCell
     * @protected
     */
    _scrollHorizontallyToCell(dstCell) {
      if (dstCell.hasAttribute('frozen') || dstCell.hasAttribute('frozen-to-end') || isDetailsCell(dstCell)) {
        // These cells are, by design, always visible, no need to scroll.
        return;
      }

      const dstCellRect = dstCell.getBoundingClientRect();
      const dstRow = dstCell.parentNode;
      const dstCellIndex = Array.from(dstRow.children).indexOf(dstCell);
      const tableRect = this.$.table.getBoundingClientRect();
      let leftBoundary = tableRect.left,
        rightBoundary = tableRect.right;
      for (let i = dstCellIndex - 1; i >= 0; i--) {
        const cell = dstRow.children[i];
        if (cell.hasAttribute('hidden') || isDetailsCell(cell)) {
          continue;
        }
        if (cell.hasAttribute('frozen') || cell.hasAttribute('frozen-to-end')) {
          leftBoundary = cell.getBoundingClientRect().right;
          break;
        }
      }
      for (let i = dstCellIndex + 1; i < dstRow.children.length; i++) {
        const cell = dstRow.children[i];
        if (cell.hasAttribute('hidden') || isDetailsCell(cell)) {
          continue;
        }
        if (cell.hasAttribute('frozen') || cell.hasAttribute('frozen-to-end')) {
          rightBoundary = cell.getBoundingClientRect().left;
          break;
        }
      }

      if (dstCellRect.left < leftBoundary) {
        this.$.table.scrollLeft += Math.round(dstCellRect.left - leftBoundary);
      }
      if (dstCellRect.right > rightBoundary) {
        this.$.table.scrollLeft += Math.round(dstCellRect.right - rightBoundary);
      }
    }

    /**
     * @typedef {Object} GridEventLocation
     * @property {HTMLTableSectionElement | null} section - The table section element that the event occurred in (header, body, or footer), or null if the event did not occur in a section
     * @property {HTMLTableRowElement | null} row - The row element that the event occurred in, or null if the event did not occur in a row
     * @property {HTMLTableCellElement | null} cell - The cell element that the event occurred in, or null if the event did not occur in a cell
     * @private
     */
    /**
     * Takes an event and returns a location object describing in which part of the grid the event occurred.
     * The event may either target table section, a row, a cell or contents of a cell.
     * @param {Event} e
     * @returns {GridEventLocation}
     * @protected
     */
    _getGridEventLocation(e) {
      // Use `composedPath()` stored by vaadin-context-menu gesture
      // to avoid problem when accessing it after a timeout on iOS
      const path = e.__composedPath || e.composedPath();
      const tableIndex = path.indexOf(this.$.table);
      // Assuming ascending path to table is: [...,] th|td, tr, thead|tbody, table [,...]
      const section = tableIndex >= 1 ? path[tableIndex - 1] : null;
      const row = tableIndex >= 2 ? path[tableIndex - 2] : null;
      const cell = tableIndex >= 3 ? path[tableIndex - 3] : null;

      return {
        section,
        row,
        cell,
      };
    }

    /**
     * Helper method that maps a focus target cell to the containing grid section
     * @param {HTMLElement} focusTarget
     * @returns {HTMLTableSectionElement | null}
     * @private
     */
    _getGridSectionFromFocusTarget(focusTarget) {
      if (focusTarget === this._headerFocusable) {
        return this.$.header;
      }
      if (focusTarget === this._itemsFocusable) {
        return this.$.items;
      }
      if (focusTarget === this._footerFocusable) {
        return this.$.footer;
      }
      return null;
    }

    /**
     * Fired when a cell is focused with click or keyboard navigation.
     *
     * Use context property of @see {@link GridCellFocusEvent} to get detail information about the event.
     *
     * @event cell-focus
     */
  };
