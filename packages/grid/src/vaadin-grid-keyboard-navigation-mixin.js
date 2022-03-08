/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
          observer: '_focusableChanged'
        },

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _itemsFocusable: {
          type: Object,
          observer: '_focusableChanged'
        },

        /** @private */
        _footerFocusable: {
          type: Object,
          observer: '_focusableChanged'
        },

        /** @private */
        _navigatingIsHidden: Boolean,

        /**
         * @type {number}
         * @protected
         */
        _focusedItemIndex: {
          type: Number,
          value: 0
        },

        /** @private */
        _focusedColumnOrder: Number,

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
          observer: '_interactingChanged'
        }
      };
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
      // not escape the grid’s shadowRoot, thus listening inside the shadowRoot.
      this.$.table.addEventListener('focusin', this._onContentFocusIn.bind(this));

      this.addEventListener('mousedown', () => {
        this.toggleAttribute('navigating', false);
        this._isMousedown = true;

        // Reset stored order when moving focus with mouse.
        this._focusedColumnOrder = undefined;
      });
      this.addEventListener('mouseup', () => (this._isMousedown = false));
    }

    /** @private */
    get __rowFocusMode() {
      return (
        this.__isRow(this._itemsFocusable) || this.__isRow(this._headerFocusable) || this.__isRow(this._footerFocusable)
      );
    }

    set __rowFocusMode(value) {
      ['_itemsFocusable', '_footerFocusable', '_headerFocusable'].forEach((focusable) => {
        if (value && this.__isCell(this[focusable])) {
          this[focusable] = this[focusable].parentElement;
        } else if (!value && this.__isRow(this[focusable])) {
          this[focusable] = this[focusable].firstElementChild;
        }
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

      this._getVisibleRows().forEach((row) => {
        if (row.index === this._focusedItemIndex) {
          if (this.__rowFocusMode) {
            // Row focus mode
            this._itemsFocusable = row;
          } else if (this._itemsFocusable.parentElement) {
            // Cell focus mode
            const cellIndex = [...this._itemsFocusable.parentElement.children].indexOf(this._itemsFocusable);
            this._itemsFocusable = row.children[cellIndex];
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
        // When in the interacting mode, only the “Interaction” keys are handled.
        keyGroup = undefined;
      }

      if (keyGroup) {
        this[`_on${keyGroup}KeyDown`](e, key);
      }
    }

    /** @private */
    _ensureScrolledToIndex(index) {
      const targetRowInDom = [...this.$.items.children].find((child) => child.index === index);
      if (!targetRowInDom) {
        this.scrollToIndex(index);
      } else {
        this.__scrollIntoViewport(index);
      }
    }

    /** @private */
    __isRowExpandable(row) {
      if (this.itemHasChildrenPath) {
        const item = row._item;
        return item && this.get(this.itemHasChildrenPath, item) && !this._isExpanded(item);
      }
    }

    /** @private */
    __isRowCollapsible(row) {
      return this._isExpanded(row._item);
    }

    /** @private */
    __isDetailsCell(element) {
      return element.matches('[part~="details-cell"]');
    }

    /** @private */
    __isCell(element) {
      return element instanceof HTMLTableCellElement;
    }

    /** @private */
    __isRow(element) {
      return element instanceof HTMLTableRowElement;
    }

    /** @private */
    __getIndexOfChildElement(el) {
      return Array.prototype.indexOf.call(el.parentNode.children, el);
    }

    /** @private */
    _onNavigationKeyDown(e, key) {
      e.preventDefault();

      const visibleItemsCount = this._lastVisibleIndex - this._firstVisibleIndex - 1;

      // Handle keyboard interaction as defined in:
      // https://w3c.github.io/aria-practices/#keyboard-interaction-24

      let dx = 0,
        dy = 0;
      switch (key) {
        case 'ArrowRight':
          dx = this.__isRTL ? -1 : 1;
          break;
        case 'ArrowLeft':
          dx = this.__isRTL ? 1 : -1;
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
          dy = visibleItemsCount;
          break;
        case 'PageUp':
          dy = -visibleItemsCount;
          break;
        default:
          break;
      }

      const activeRow = e.composedPath().find((el) => this.__isRow(el));
      const activeCell = e.composedPath().find((el) => this.__isCell(el));

      if ((this.__rowFocusMode && !activeRow) || (!this.__rowFocusMode && !activeCell)) {
        // When using a screen reader, it's possible that neither a cell nor a row is focused.
        return;
      }

      const forwardsKey = this.__isRTL ? 'ArrowLeft' : 'ArrowRight';
      const backwardsKey = this.__isRTL ? 'ArrowRight' : 'ArrowLeft';
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
          if (activeCell === activeRowCells[0] || this.__isDetailsCell(activeCell)) {
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
     **/
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
      return this.__getIndexOfChildElement(row);
    }

    /**
     * Returns the target row after navigating by the given dy offset.
     * Also returns information whether the details cell should be the target on the target row.
     * If the row is not in the viewport, it is first scrolled to.
     * @private
     **/
    __navigateRows(dy, activeRow, activeCell) {
      const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);
      const activeRowGroup = activeRow.parentNode;
      const maxRowIndex = (activeRowGroup === this.$.items ? this._effectiveSize : activeRowGroup.children.length) - 1;

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
        const isRowDetails = this.__isDetailsCell(activeCell);
        // Row details navigation logic
        if (activeRowGroup === this.$.items) {
          const item = activeRow._item;
          const dstItem = this._cache.getItemForIndex(dstRowIndex);
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
      this._ensureScrolledToIndex(dstRowIndex);

      // When scrolling with repeated keydown, sometimes FocusEvent listeners
      // are too late to update _focusedItemIndex. Ensure next keydown
      // listener invocation gets updated _focusedItemIndex value.
      this._focusedItemIndex = dstRowIndex;

      // This has to be set after scrolling, otherwise it can be removed by
      // `_preventScrollerRotatingCellFocus(row, index)` during scrolling.
      this.toggleAttribute('navigating', true);

      return {
        dstRow: [...activeRowGroup.children].find((el) => !el.hidden && el.index === dstRowIndex),
        dstIsRowDetails
      };
    }

    /**
     * Focuses the target cell after navigating by the given dx and dy offset.
     * If the cell is not in the viewport, it is first scrolled to.
     * @private
     **/
    _onCellNavigation(activeCell, dx, dy) {
      const activeRow = activeCell.parentNode;
      const { dstRow, dstIsRowDetails } = this.__navigateRows(dy, activeRow, activeCell);
      if (!dstRow) {
        return;
      }

      const columnIndex = this.__getIndexOfChildElement(activeCell);
      const isCurrentCellRowDetails = this.__isDetailsCell(activeCell);
      const activeRowGroup = activeRow.parentNode;
      const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);

      // _focusedColumnOrder is memoized — this is to ensure predictable
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
        const dstCell = [...dstRow.children].find((el) => this.__isDetailsCell(el));
        dstCell.focus();
      } else {
        // Focusing a regular cell on the destination row

        // Find orderedColumnIndex — the index of order closest matching the
        // original _focusedColumnOrder in the sorted array of orders
        // of the visible columns on the destination row.
        const dstRowIndex = this.__getIndexInGroup(dstRow, this._focusedItemIndex);
        const dstColumns = this._getColumns(activeRowGroup, dstRowIndex).filter((c) => !c.hidden);
        const dstSortedColumnOrders = dstColumns.map((c) => c._order).sort((b, a) => b - a);
        const maxOrderedColumnIndex = dstSortedColumnOrders.length - 1;
        const orderedColumnIndex = dstSortedColumnOrders.indexOf(
          dstSortedColumnOrders
            .slice(0)
            .sort((b, a) => Math.abs(b - this._focusedColumnOrder) - Math.abs(a - this._focusedColumnOrder))[0]
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
        const dstCell = dstRow.children[dstColumnIndex];

        this._scrollHorizontallyToCell(dstCell);
        dstCell.focus();
      }
    }

    /** @private */
    _onInteractionKeyDown(e, key) {
      const localTarget = e.composedPath()[0];
      const localTargetIsTextInput =
        localTarget.localName === 'input' &&
        !/^(button|checkbox|color|file|image|radio|range|reset|submit)$/i.test(localTarget.type);

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
    }

    /** @private */
    _predictFocusStepTarget(srcElement, step) {
      const tabOrder = [
        this.$.table,
        this._headerFocusable,
        this._itemsFocusable,
        this._footerFocusable,
        this.$.focusexit
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

      return tabOrder[index];
    }

    /** @private */
    _onTabKeyDown(e) {
      const focusTarget = this._predictFocusStepTarget(e.composedPath()[0], e.shiftKey ? -1 : 1);

      // Prevent focus-trap logic from intercepting the event.
      e.stopPropagation();

      if (focusTarget === this.$.table) {
        // The focus is about to exit the grid to the top.
        this.$.table.focus();
      } else if (focusTarget === this.$.focusexit) {
        // The focus is about to exit the grid to the bottom.
        this.$.focusexit.focus();
      } else if (focusTarget === this._itemsFocusable) {
        let itemsFocusTarget = focusTarget;
        const targetRow = this.__isRow(focusTarget) ? focusTarget : focusTarget.parentNode;
        this._ensureScrolledToIndex(this._focusedItemIndex);
        if (targetRow.index !== this._focusedItemIndex && this.__isCell(focusTarget)) {
          // The target row, which is about to be focused next, has been
          // assigned with a new index since last focus, probably because of
          // scrolling. Focus the row for the stored focused item index instead.
          const columnIndex = Array.from(targetRow.children).indexOf(this._itemsFocusable);
          const focusedItemRow = Array.from(this.$.items.children).find(
            (row) => !row.hidden && row.index === this._focusedItemIndex
          );
          if (focusedItemRow) {
            itemsFocusTarget = focusedItemRow.children[columnIndex];
          }
        }
        e.preventDefault();
        itemsFocusTarget.focus();
      } else {
        e.preventDefault();
        focusTarget.focus();
      }

      this.toggleAttribute('navigating', true);
    }

    /** @private */
    _onSpaceKeyDown(e) {
      e.preventDefault();

      const element = e.composedPath()[0];
      const isRow = this.__isRow(element);
      if (isRow || !element._content || !element._content.firstElementChild) {
        this.dispatchEvent(
          new CustomEvent(isRow ? 'row-activate' : 'cell-activate', {
            detail: {
              model: this.__getRowModel(isRow ? element : element.parentElement)
            }
          })
        );
      }
    }

    /** @private */
    _onKeyUp(e) {
      if (!/^( |SpaceBar)$/.test(e.key) || this.interacting) {
        return;
      }

      e.preventDefault();

      const cell = e.composedPath()[0];
      if (cell._content && cell._content.firstElementChild) {
        const wasNavigating = this.hasAttribute('navigating');
        cell._content.firstElementChild.click();
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
        // The focus enters the top (bottom) of the grid, meaning that user has
        // tabbed (shift-tabbed) into the grid. Move the focus to
        // the first (the last) focusable.
        this._predictFocusStepTarget(rootTarget, rootTarget === this.$.table ? 1 : -1).focus();
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
    }

    /** @private */
    _onContentFocusIn(e) {
      const { section, cell, row } = this._getGridEventLocation(e);
      this._detectInteracting(e);

      if (section && (cell || row)) {
        this._activeRowGroup = section;
        if (this.$.header === section) {
          this._headerFocusable = this.__rowFocusMode ? row : cell;
        } else if (this.$.items === section) {
          this._itemsFocusable = this.__rowFocusMode ? row : cell;
        } else if (this.$.footer === section) {
          this._footerFocusable = this.__rowFocusMode ? row : cell;
        }

        if (cell) {
          // Fire a public event for cell.
          const context = this.getEventContext(e);
          cell.dispatchEvent(
            new CustomEvent('cell-focus', { bubbles: true, composed: true, detail: { context: context } })
          );
        }
      }

      this._detectFocusedItemIndex(e);
    }

    /** @private
     * Enables interaction mode if a cells descendant receives focus or keyboard
     * input. Disables it if the event is not related to cell content.
     * @param {!KeyboardEvent|!FocusEvent} e
     */
    _detectInteracting(e) {
      const isInteracting = e.composedPath().some((el) => el.localName === 'vaadin-grid-cell-content');
      this._setInteracting(isInteracting);
    }

    /** @private */
    _detectFocusedItemIndex(e) {
      const { section, row } = this._getGridEventLocation(e);
      if (section === this.$.items) {
        this._focusedItemIndex = row.index;
      }
    }

    /** @private
     * Enables or disables the focus target of the containing section of the
     * grid from receiving focus, based on whether the user is interacting with
     * that section of the grid.
     * @param {HTMLElement} focusTarget
     */
    _updateGridSectionFocusTarget(focusTarget) {
      if (!focusTarget) {
        return;
      }

      const section = this._getGridSectionFromFocusTarget(focusTarget);
      const isInteractingWithinActiveSection = this.interacting && section === this._activeRowGroup;

      focusTarget.tabIndex = isInteractingWithinActiveSection ? -1 : 0;
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @param {number} index
     * @protected
     */
    _preventScrollerRotatingCellFocus(row, index) {
      if (
        row.index === this._focusedItemIndex &&
        this.hasAttribute('navigating') &&
        this._activeRowGroup === this.$.items
      ) {
        // Focused item has went, hide navigation mode
        this._navigatingIsHidden = true;
        this.toggleAttribute('navigating', false);
      }
      if (index === this._focusedItemIndex && this._navigatingIsHidden) {
        // Focused item is back, restore navigation mode
        this._navigatingIsHidden = false;
        this.toggleAttribute('navigating', true);
      }
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
      // Header / footer
      ['header', 'footer'].forEach((section) => {
        if (!this.__isValidFocusable(this[`_${section}Focusable`])) {
          const firstVisibleRow = [...this.$[section].children].find((row) => row.offsetHeight);
          const firstVisibleCell = firstVisibleRow ? [...firstVisibleRow.children].find((cell) => !cell.hidden) : null;
          if (firstVisibleRow && firstVisibleCell) {
            this[`_${section}Focusable`] = this.__rowFocusMode ? firstVisibleRow : firstVisibleCell;
          }
        }
      });

      // Body
      if (!this.__isValidFocusable(this._itemsFocusable) && this.$.items.firstElementChild) {
        const firstVisibleRow = this.__getFirstVisibleItem();
        const firstVisibleCell = firstVisibleRow ? [...firstVisibleRow.children].find((cell) => !cell.hidden) : null;

        if (firstVisibleCell && firstVisibleRow) {
          // Reset memoized column
          delete this._focusedColumnOrder;
          this._itemsFocusable = this.__rowFocusMode ? firstVisibleRow : firstVisibleCell;
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
      if (dstCell.hasAttribute('frozen') || this.__isDetailsCell(dstCell)) {
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
        if (cell.hasAttribute('hidden') || this.__isDetailsCell(cell)) {
          continue;
        }
        if (cell.hasAttribute('frozen')) {
          leftBoundary = cell.getBoundingClientRect().right;
          break;
        }
      }
      for (let i = dstCellIndex + 1; i < dstRow.children.length; i++) {
        const cell = dstRow.children[i];
        if (cell.hasAttribute('hidden') || this.__isDetailsCell(cell)) {
          continue;
        }
        if (cell.hasAttribute('frozen')) {
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
     * @private
     */
    _getGridEventLocation(e) {
      const path = e.composedPath();
      const tableIndex = path.indexOf(this.$.table);
      // Assuming ascending path to table is: [...,] th|td, tr, thead|tbody, table [,...]
      const section = tableIndex >= 1 ? path[tableIndex - 1] : null;
      const row = tableIndex >= 2 ? path[tableIndex - 2] : null;
      const cell = tableIndex >= 3 ? path[tableIndex - 3] : null;

      return {
        section,
        row,
        cell
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
