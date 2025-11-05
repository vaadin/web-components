/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { findTreeToggleCell, iterateChildren, iterateRowCells } from './vaadin-grid-helpers.js';

/**
 * @polymerMixin
 */
export const A11yMixin = (superClass) =>
  class A11yMixin extends superClass {
    static get properties() {
      return {
        /**
         * String used to label the grid to screen reader users.
         * @attr {string} accessible-name
         */
        accessibleName: {
          type: String,
        },
      };
    }
    static get observers() {
      return ['__a11yUpdateGridSize(size, _columnTree, __emptyState)'];
    }

    /** @private */
    __a11yGetHeaderRowCount(_columnTree) {
      return _columnTree.filter((level) =>
        level.some((col) => col.headerRenderer || (col.path && col.header !== null) || col.header),
      ).length;
    }

    /** @private */
    __a11yGetFooterRowCount(_columnTree) {
      return _columnTree.filter((level) => level.some((col) => col.footerRenderer)).length;
    }

    /** @private */
    __a11yUpdateGridSize(size, _columnTree, emptyState) {
      if (size === undefined || _columnTree === undefined) {
        return;
      }

      const headerRowsCount = this.__a11yGetHeaderRowCount(_columnTree);
      const footerRowsCount = this.__a11yGetFooterRowCount(_columnTree);
      const bodyRowsCount = emptyState ? 1 : size;
      const rowsCount = bodyRowsCount + headerRowsCount + footerRowsCount;

      this.$.table.setAttribute('aria-rowcount', rowsCount);

      const bodyColumns = _columnTree[_columnTree.length - 1];

      // If no header and footer rows while the empty state is active, count as one column
      // Otherwise, use the number of body columns, if present
      const columnsCount = emptyState ? 1 : (rowsCount && bodyColumns && bodyColumns.length) || 0;
      this.$.table.setAttribute('aria-colcount', columnsCount);

      this.__a11yUpdateHeaderRows();
      this.__a11yUpdateFooterRows();
    }

    /** @private */
    __a11yUpdateHeaderRows() {
      iterateChildren(this.$.header, (headerRow, index) => {
        headerRow.setAttribute('aria-rowindex', index + 1);
      });
    }

    /** @private */
    __a11yUpdateFooterRows() {
      iterateChildren(this.$.footer, (footerRow, index) => {
        footerRow.setAttribute('aria-rowindex', this.__a11yGetHeaderRowCount(this._columnTree) + this.size + index + 1);
      });
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} index
     * @private
     */
    __a11yUpdateRowRowindex(row) {
      row.setAttribute('aria-rowindex', row.index + this.__a11yGetHeaderRowCount(this._columnTree) + 1);
    }

    /**
     * @param {!HTMLElement} row
     * @param {boolean} selected
     * @private
     */
    __a11yUpdateRowSelected(row, selected) {
      // Jaws reads selection only for rows, NVDA only for cells
      row.setAttribute('aria-selected', Boolean(selected));
      iterateRowCells(row, (cell) => {
        cell.setAttribute('aria-selected', Boolean(selected));
      });
    }

    /**
     * @param {!HTMLElement} row
     * @private
     */
    __a11yUpdateRowExpanded(row) {
      const toggleCell = findTreeToggleCell(row);
      if (this.__isRowExpandable(row)) {
        row.setAttribute('aria-expanded', 'false');
        if (toggleCell) {
          toggleCell.setAttribute('aria-expanded', 'false');
        }
      } else if (this.__isRowCollapsible(row)) {
        row.setAttribute('aria-expanded', 'true');
        if (toggleCell) {
          toggleCell.setAttribute('aria-expanded', 'true');
        }
      } else {
        row.removeAttribute('aria-expanded');
        if (toggleCell) {
          toggleCell.removeAttribute('aria-expanded');
        }
      }
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} level
     * @private
     */
    __a11yUpdateRowLevel(row, level) {
      // Set level for the expandable rows itself, and all the nested rows.
      if (level > 0 || this.__isRowCollapsible(row) || this.__isRowExpandable(row)) {
        row.setAttribute('aria-level', level + 1);
      } else {
        row.removeAttribute('aria-level');
      }
    }

    /**
     * @param {!HTMLElement} row
     * @param {!HTMLElement} detailsCell
     * @private
     */
    __a11ySetRowDetailsCell(row, detailsCell) {
      iterateRowCells(row, (cell) => {
        if (cell !== detailsCell) {
          cell.setAttribute('aria-controls', detailsCell.id);
        }
      });
    }

    /**
     * @param {!HTMLElement} cell
     * @param {number} colspan
     * @private
     */
    __a11yUpdateCellColspan(cell, colspan) {
      cell.setAttribute('aria-colspan', Number(colspan));
    }

    /** @private */
    __a11yUpdateSorters() {
      Array.from(this.querySelectorAll('vaadin-grid-sorter')).forEach((sorter) => {
        let cellContent = sorter.parentNode;
        while (cellContent && cellContent.localName !== 'vaadin-grid-cell-content') {
          cellContent = cellContent.parentNode;
        }
        if (cellContent && cellContent.assignedSlot) {
          const cell = cellContent.assignedSlot.parentNode;
          cell.setAttribute(
            'aria-sort',
            {
              asc: 'ascending',
              desc: 'descending',
            }[String(sorter.direction)] || 'none',
          );
        }
      });
    }
  };
