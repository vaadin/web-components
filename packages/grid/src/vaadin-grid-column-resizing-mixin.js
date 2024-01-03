/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addListener } from '@vaadin/component-base/src/gestures.js';

/**
 * @polymerMixin
 */
export const ColumnResizingMixin = (superClass) =>
  class ColumnResizingMixin extends superClass {
    /** @protected */
    ready() {
      super.ready();
      const scroller = this.$.scroller;
      addListener(scroller, 'track', this._onHeaderTrack.bind(this));

      // Disallow scrolling while resizing
      scroller.addEventListener('touchmove', (e) => scroller.hasAttribute('column-resizing') && e.preventDefault());

      // Disable contextmenu on any resize separator.
      scroller.addEventListener(
        'contextmenu',
        (e) => e.target.getAttribute('part') === 'resize-handle' && e.preventDefault(),
      );

      // Disable native cell focus when resizing
      scroller.addEventListener(
        'mousedown',
        (e) => e.target.getAttribute('part') === 'resize-handle' && e.preventDefault(),
      );
    }

    /** @private */
    _onHeaderTrack(e) {
      const handle = e.target;
      if (handle.getAttribute('part') === 'resize-handle') {
        const cell = handle.parentElement;
        let column = cell._column;

        this.$.scroller.toggleAttribute('column-resizing', true);

        // Get the target column to resize
        while (column.localName === 'vaadin-grid-column-group') {
          column = column._childColumns
            .slice(0)
            .sort((a, b) => a._order - b._order)
            .filter((column) => !column.hidden)
            .pop();
        }

        const isRTL = this.__isRTL;
        const eventX = e.detail.x;
        const columnRowCells = Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]'));
        const targetCell = columnRowCells.find((cell) => cell._column === column);
        // Resize the target column
        if (targetCell.offsetWidth) {
          const style = getComputedStyle(targetCell._content);
          const minWidth =
            10 +
            parseInt(style.paddingLeft) +
            parseInt(style.paddingRight) +
            parseInt(style.borderLeftWidth) +
            parseInt(style.borderRightWidth) +
            parseInt(style.marginLeft) +
            parseInt(style.marginRight);

          let maxWidth;

          const cellWidth = targetCell.offsetWidth;
          const cellRect = targetCell.getBoundingClientRect();

          // For cells frozen to end, resize handle is flipped horizontally.
          if (targetCell.hasAttribute('frozen-to-end')) {
            maxWidth = cellWidth + (isRTL ? eventX - cellRect.right : cellRect.left - eventX);
          } else {
            maxWidth = cellWidth + (isRTL ? cellRect.left - eventX : eventX - cellRect.right);
          }

          column.width = `${Math.max(minWidth, maxWidth)}px`;
          column.flexGrow = 0;
        }
        // Fix width and flex-grow for all preceding columns
        columnRowCells
          .sort((a, b) => a._column._order - b._column._order)
          .forEach((cell, index, array) => {
            if (index < array.indexOf(targetCell)) {
              cell._column.width = `${cell.offsetWidth}px`;
              cell._column.flexGrow = 0;
            }
          });

        const cellFrozenToEnd = this._frozenToEndCells[0];

        // When handle moves below the cell frozen to end, scroll into view.
        if (cellFrozenToEnd && this.$.table.scrollWidth > this.$.table.offsetWidth) {
          const frozenRect = cellFrozenToEnd.getBoundingClientRect();
          const offset = eventX - (isRTL ? frozenRect.right : frozenRect.left);

          if ((isRTL && offset <= 0) || (!isRTL && offset >= 0)) {
            this.$.table.scrollLeft += offset;
          }
        }

        if (e.detail.state === 'end') {
          this.$.scroller.toggleAttribute('column-resizing', false);
          this.dispatchEvent(
            new CustomEvent('column-resize', {
              detail: { resizedColumn: column },
            }),
          );
        }

        // Notify resize
        this._resizeHandler();
      }
    }

    /**
     * Fired when a column in the grid is resized by the user.
     *
     * @event column-resize
     * @param {Object} detail
     * @param {Object} detail.resizedColumn the column that was resized
     */
  };
