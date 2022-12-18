/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { updateColumnOrders } from './vaadin-grid-helpers.js';

/**
 * @polymerMixin
 */
export const ColumnReorderingMixin = (superClass) =>
  class ColumnReorderingMixin extends superClass {
    static get properties() {
      return {
        /**
         * Set to true to allow column reordering.
         * @attr {boolean} column-reordering-allowed
         * @type {boolean}
         */
        columnReorderingAllowed: {
          type: Boolean,
          value: false,
        },

        /** @private */
        _orderBaseScope: {
          type: Number,
          value: 10000000,
        },
      };
    }

    static get observers() {
      return ['_updateOrders(_columnTree)'];
    }

    /** @protected */
    ready() {
      super.ready();
      addListener(this, 'track', this._onTrackEvent);
      this._reorderGhost = this.shadowRoot.querySelector('[part="reorder-ghost"]');

      this.addEventListener('touchstart', this._onTouchStart.bind(this));
      this.addEventListener('touchmove', this._onTouchMove.bind(this));
      this.addEventListener('touchend', this._onTouchEnd.bind(this));
      this.addEventListener('contextmenu', this._onContextMenu.bind(this));
    }

    /** @private */
    _onContextMenu(e) {
      if (this.hasAttribute('reordering')) {
        e.preventDefault();
      }
    }

    /** @private */
    _onTouchStart(e) {
      // Touch event, delay activation by 100ms
      this._startTouchReorderTimeout = setTimeout(() => {
        this._onTrackStart({
          detail: {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          },
        });
      }, 100);
    }

    /** @private */
    _onTouchMove(e) {
      if (this._draggedColumn) {
        e.preventDefault();
      }
      clearTimeout(this._startTouchReorderTimeout);
    }

    /** @private */
    _onTouchEnd() {
      clearTimeout(this._startTouchReorderTimeout);
      this._onTrackEnd();
    }

    /** @private */
    _onTrackEvent(e) {
      if (e.detail.state === 'start') {
        const path = e.composedPath();
        const headerCell = path[path.indexOf(this.$.header) - 2];
        if (!headerCell || !headerCell._content) {
          // Not a header column
          return;
        }

        if (headerCell._content.contains(this.getRootNode().activeElement)) {
          // Something was focused inside the cell
          return;
        }

        if (this.$.scroller.hasAttribute('column-resizing')) {
          // Resizing is in progress
          return;
        }

        if (!this._touchDevice) {
          // Not a touch device
          this._onTrackStart(e);
        }
      } else if (e.detail.state === 'track') {
        this._onTrack(e);
      } else if (e.detail.state === 'end') {
        this._onTrackEnd(e);
      }
    }

    /** @private */
    _onTrackStart(e) {
      if (!this.columnReorderingAllowed) {
        return;
      }

      // Cancel reordering if there are draggable nodes on the event path
      const path = e.composedPath && e.composedPath();
      if (path && path.some((node) => node.hasAttribute && node.hasAttribute('draggable'))) {
        return;
      }

      const headerCell = this._cellFromPoint(e.detail.x, e.detail.y);
      if (!headerCell || !headerCell.getAttribute('part').includes('header-cell')) {
        return;
      }

      this.toggleAttribute('reordering', true);
      this._draggedColumn = headerCell._column;
      while (this._draggedColumn.parentElement.childElementCount === 1) {
        // This is the only column in the group, drag the whole group instead
        this._draggedColumn = this._draggedColumn.parentElement;
      }
      this._setSiblingsReorderStatus(this._draggedColumn, 'allowed');
      this._draggedColumn._reorderStatus = 'dragging';

      this._updateGhost(headerCell);
      this._reorderGhost.style.visibility = 'visible';
      this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y);
      this._autoScroller();
    }

    /** @private */
    _onTrack(e) {
      if (!this._draggedColumn) {
        // Reordering didn’t start. Skip this event.
        return;
      }

      const targetCell = this._cellFromPoint(e.detail.x, e.detail.y);
      if (!targetCell) {
        return;
      }

      const targetColumn = this._getTargetColumn(targetCell, this._draggedColumn);
      if (
        this._isSwapAllowed(this._draggedColumn, targetColumn) &&
        this._isSwappableByPosition(targetColumn, e.detail.x)
      ) {
        // Get the header level of the target column (and the dragged column)
        const columnTreeLevel = this._columnTree.findIndex((level) => level.includes(targetColumn));
        // Get the columns on that level in visual order
        const levelColumnsInOrder = this._getColumnsInOrder(columnTreeLevel);

        // Index of the column being dragged
        const startIndex = levelColumnsInOrder.indexOf(this._draggedColumn);
        // Index of the column being dragged over
        const endIndex = levelColumnsInOrder.indexOf(targetColumn);

        // Direction of iteration
        const direction = startIndex < endIndex ? 1 : -1;

        // Iteratively swap all the columns from the dragged column to the target column
        for (let i = startIndex; i !== endIndex; i += direction) {
          this._swapColumnOrders(this._draggedColumn, levelColumnsInOrder[i + direction]);
        }
      }

      this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y);
      this._lastDragClientX = e.detail.x;
    }

    /** @private */
    _onTrackEnd() {
      if (!this._draggedColumn) {
        // Reordering didn’t start. Skip this event.
        return;
      }

      this.toggleAttribute('reordering', false);
      this._draggedColumn._reorderStatus = '';
      this._setSiblingsReorderStatus(this._draggedColumn, '');
      this._draggedColumn = null;
      this._lastDragClientX = null;
      this._reorderGhost.style.visibility = 'hidden';

      this.dispatchEvent(
        new CustomEvent('column-reorder', {
          detail: {
            columns: this._getColumnsInOrder(),
          },
        }),
      );
    }

    /**
     * Returns the columns (or column groups) on the specified header level in visual order.
     * By default, the bottom level is used.
     *
     * @return {!Array<!GridColumn>}
     * @protected
     */
    _getColumnsInOrder(headerLevel = this._columnTree.length - 1) {
      return this._columnTree[headerLevel].filter((c) => !c.hidden).sort((b, a) => b._order - a._order);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {HTMLElement | undefined}
     * @protected
     */
    _cellFromPoint(x, y) {
      x = x || 0;
      y = y || 0;
      if (!this._draggedColumn) {
        this.$.scroller.toggleAttribute('no-content-pointer-events', true);
      }
      const cell = this.shadowRoot.elementFromPoint(x, y);
      this.$.scroller.toggleAttribute('no-content-pointer-events', false);

      // Make sure the element is actually a cell
      if (cell && cell._column) {
        return cell;
      }
    }

    /**
     * @param {number} eventClientX
     * @param {number} eventClientY
     * @protected
     */
    _updateGhostPosition(eventClientX, eventClientY) {
      const ghostRect = this._reorderGhost.getBoundingClientRect();
      // // This is where we want to position the ghost
      const targetLeft = eventClientX - ghostRect.width / 2;
      const targetTop = eventClientY - ghostRect.height / 2;
      // Current position
      const _left = parseInt(this._reorderGhost._left || 0);
      const _top = parseInt(this._reorderGhost._top || 0);
      // Reposition the ghost
      this._reorderGhost._left = _left - (ghostRect.left - targetLeft);
      this._reorderGhost._top = _top - (ghostRect.top - targetTop);
      this._reorderGhost.style.transform = `translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`;
    }

    /**
     * @param {!HTMLElement} cell
     * @return {!HTMLElement}
     * @protected
     */
    _updateGhost(cell) {
      const ghost = this._reorderGhost;
      ghost.textContent = cell._content.innerText;
      const style = window.getComputedStyle(cell);
      [
        'boxSizing',
        'display',
        'width',
        'height',
        'background',
        'alignItems',
        'padding',
        'border',
        'flex-direction',
        'overflow',
      ].forEach((propertyName) => {
        ghost.style[propertyName] = style[propertyName];
      });
      return ghost;
    }

    /** @private */
    _updateOrders(columnTree) {
      if (columnTree === undefined) {
        return;
      }

      // Reset all column orders
      columnTree[0].forEach((column) => {
        column._order = 0;
      });
      // Set order numbers to top-level columns
      updateColumnOrders(columnTree[0], this._orderBaseScope, 0);
    }

    /**
     * @param {!GridColumn} column
     * @param {string} status
     * @protected
     */
    _setSiblingsReorderStatus(column, status) {
      Array.from(column.parentNode.children)
        .filter((child) => /column/.test(child.localName) && this._isSwapAllowed(child, column))
        .forEach((sibling) => {
          sibling._reorderStatus = status;
        });
    }

    /** @protected */
    _autoScroller() {
      if (this._lastDragClientX) {
        const rightDiff = this._lastDragClientX - this.getBoundingClientRect().right + 50;
        const leftDiff = this.getBoundingClientRect().left - this._lastDragClientX + 50;

        if (rightDiff > 0) {
          this.$.table.scrollLeft += rightDiff / 10;
        } else if (leftDiff > 0) {
          this.$.table.scrollLeft -= leftDiff / 10;
        }
      }

      if (this._draggedColumn) {
        setTimeout(() => this._autoScroller(), 10);
      }
    }

    /**
     * @param {GridColumn | undefined} column1
     * @param {GridColumn | undefined} column2
     * @return {boolean | undefined}
     * @protected
     */
    _isSwapAllowed(column1, column2) {
      if (column1 && column2) {
        const differentColumns = column1 !== column2;
        const sameParent = column1.parentElement === column2.parentElement;
        const sameFrozen =
          (column1.frozen && column2.frozen) || // Both columns are frozen
          (column1.frozenToEnd && column2.frozenToEnd) || // Both columns are frozen to end
          (!column1.frozen && !column1.frozenToEnd && !column2.frozen && !column2.frozenToEnd);
        return differentColumns && sameParent && sameFrozen;
      }
    }

    /**
     * @param {!GridColumn} targetColumn
     * @param {number} clientX
     * @return {boolean}
     * @protected
     */
    _isSwappableByPosition(targetColumn, clientX) {
      const targetCell = Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find((cell) =>
        targetColumn.contains(cell._column),
      );
      const sourceCellRect = this.$.header
        .querySelector('tr:not([hidden]) [reorder-status=dragging]')
        .getBoundingClientRect();
      const targetRect = targetCell.getBoundingClientRect();
      if (targetRect.left > sourceCellRect.left) {
        return clientX > targetRect.right - sourceCellRect.width;
      }
      return clientX < targetRect.left + sourceCellRect.width;
    }

    /**
     * @param {!GridColumn} column1
     * @param {!GridColumn} column2
     * @protected
     */
    _swapColumnOrders(column1, column2) {
      [column1._order, column2._order] = [column2._order, column1._order];
      this._debounceUpdateFrozenColumn();
      this._updateFirstAndLastColumn();
    }

    /**
     * @param {HTMLElement | undefined} targetCell
     * @param {GridColumn} draggedColumn
     * @return {GridColumn | undefined}
     * @protected
     */
    _getTargetColumn(targetCell, draggedColumn) {
      if (targetCell && draggedColumn) {
        let candidate = targetCell._column;
        while (candidate.parentElement !== draggedColumn.parentElement && candidate !== this) {
          candidate = candidate.parentElement;
        }
        if (candidate.parentElement === draggedColumn.parentElement) {
          return candidate;
        }
        return targetCell._column;
      }
    }

    /**
     * Fired when the columns in the grid are reordered.
     *
     * @event column-reorder
     * @param {Object} detail
     * @param {Object} detail.columns the columns in the new order
     */
  };
