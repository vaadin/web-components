/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const A11yMixin = (superClass) =>
  class A11yMixin extends superClass {
    static get observers() {
      return ['_a11yUpdateGridSize(_effectiveSize, _columnTree, _columnTree.*)'];
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
    _a11yUpdateGridSize(effectiveSize, _columnTree) {
      if (effectiveSize === undefined || _columnTree === undefined) {
        return;
      }

      const bodyColumns = _columnTree[_columnTree.length - 1];
      this.$.table.setAttribute(
        'aria-rowcount',
        effectiveSize + this._a11yGetHeaderRowCount(_columnTree) + this._a11yGetFooterRowCount(_columnTree)
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
        footerRow.setAttribute(
          'aria-rowindex',
          this._a11yGetHeaderRowCount(this._columnTree) + this._effectiveSize + index + 1
        )
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
     * @param {number} level
     * @protected
     */
    _a11yUpdateRowLevel(row, level) {
      row.setAttribute('aria-level', level + 1);
    }

    /**
     * @param {!HTMLElement} row
     * @param {boolean} detailsOpened
     * @protected
     */
    _a11yUpdateRowDetailsOpened(row, detailsOpened) {
      const detailsCell = row.querySelector('[part~=details-cell]');

      Array.from(row.children).forEach((cell) => {
        if (detailsCell) {
          cell.setAttribute('aria-expanded', detailsOpened);
        } else {
          cell.removeAttribute('aria-expanded');
        }
      });
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
