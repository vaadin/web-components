/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const RowStateMixin = (superClass) =>
  class RowStateMixin extends superClass {
    static get observers() {
      return ['__updateHeaderFooterRows(size, _columnTree, _columnTree.*)'];
    }

    /** @private */
    __iterateRows(container, callback) {
      [...container.children].forEach(callback);
    }

    /** @private */
    __updateHeaderFooterRows() {
      this._updateHeaderRows();
      this._updateFooterRows();
    }

    /** @protected */
    _updateHeaderRows() {
      this.__iterateRows(this.$.header, (headerRow, index, rows) => {
        this._updateHeaderRow(headerRow, index, rows);
      });
    }

    /** @protected */
    _updateFooterRows() {
      this.__iterateRows(this.$.footer, (headerRow, index, rows) => {
        this._updateFooterRow(headerRow, index, rows);
      });
    }

    /**
     * Override to change the header row state based on the index.
     *
     * @param {HTMLTableRowElement} _headerRow
     * @param {number} _index
     * @param {HTMLTableRowElement[]} _rows
     * @protected
     */
    _updateHeaderRow(_headerRow, _index, _rows) {
      // To be implemented.
    }

    /**
     * Override to change the footer row state based on the index.
     *
     * @param {HTMLTableRowElement} _footerRow
     * @param {number} _index
     * @param {HTMLTableRowElement[]} _rows
     * @protected
     */
    _updateFooterRow(_headerRow, _index, _rows) {
      // To be implemented.
    }
  };
