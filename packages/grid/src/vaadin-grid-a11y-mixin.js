/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const A11yMixin = (superClass) =>
  class A11yMixin extends superClass {
    static get observers() {
      return ['_a11yUpdateGridSize(size, _columnTree, _columnTree.*)'];
    }

    /** @private */
    _a11yGetHeaderRowCount(_columnTree) {
      return _columnTree.filter((level) => level.some((col) => col.headerRenderer || col.path || col.header)).length;
    }

    /** @private */
    _a11yGetFooterRowCount(_columnTree) {
      return _columnTree.filter((level) => level.some((col) => col.headerRenderer)).length;
    }

    /** @private */
    _a11yUpdateGridSize(size, _columnTree) {
      if (size === undefined || _columnTree === undefined) {
        return;
      }

      const bodyColumns = _columnTree[_columnTree.length - 1];
      this.$.table.setAttribute(
        'aria-rowcount',
        size + this._a11yGetHeaderRowCount(_columnTree) + this._a11yGetFooterRowCount(_columnTree)
      );
      this.$.table.setAttribute('aria-colcount', (bodyColumns && bodyColumns.length) || 0);

      this._a11yUpdateHeaderRows();
      this._a11yUpdateFooterRows();
    }

    /** @protected */
    _a11yUpdateHeaderRows() {
      Array.from(this.$.header.children).forEach((headerRow, index) =>
        headerRow.setAttribute('aria-rowindex', index + 1)
      );
    }

    /** @protected */
    _a11yUpdateFooterRows() {
      Array.from(this.$.footer.children).forEach((footerRow, index) =>
        footerRow.setAttribute('aria-rowindex', this._a11yGetHeaderRowCount(this._columnTree) + this.size + index + 1)
      );
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} index
     * @protected
     */
    _a11yUpdateRowRowindex(row, index) {
      row.setAttribute('aria-rowindex', index + this._a11yGetHeaderRowCount(this._columnTree) + 1);
    }

    /**
     * @param {!HTMLElement} row
     * @param {boolean} selected
     * @protected
     */
    _a11yUpdateRowSelected(row, selected) {
      // Jaws reads selection only for rows, NVDA only for cells
      row.setAttribute('aria-selected', Boolean(selected));
      Array.from(row.children).forEach((cell) => cell.setAttribute('aria-selected', Boolean(selected)));
    }

    /**
     * @param {!HTMLElement} row
     * @protected
     */
    _a11yUpdateRowExpanded(row) {
      if (this.__isRowExpandable(row)) {
        row.setAttribute('aria-expanded', 'false');
      } else if (this.__isRowCollapsible(row)) {
        row.setAttribute('aria-expanded', 'true');
      } else {
        row.removeAttribute('aria-expanded');
      }
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} level
     * @protected
     */
    _a11yUpdateRowLevel(row, level) {
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
     * @protected
     */
    _a11ySetRowDetailsCell(row, detailsCell) {
      Array.from(row.children).forEach((cell) => {
        if (cell !== detailsCell) {
          cell.setAttribute('aria-controls', detailsCell.id);
        }
      });
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} colspan
     * @protected
     */
    _a11yUpdateCellColspan(cell, colspan) {
      cell.setAttribute('aria-colspan', Number(colspan));
    }

    /** @protected */
    _a11yUpdateSorters() {
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
              desc: 'descending'
            }[String(sorter.direction)] || 'none'
          );
        }
      });
    }
  };
