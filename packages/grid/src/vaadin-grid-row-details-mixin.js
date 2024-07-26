/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { iterateChildren } from './vaadin-grid-helpers.js';

/**
 * @polymerMixin
 */
export const RowDetailsMixin = (superClass) =>
  class RowDetailsMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing references to items with open row details.
         * @type {!Array<!GridItem>}
         */
        detailsOpenedItems: {
          type: Array,
          value: () => [],
          sync: true,
        },

        /**
         * Custom function for rendering the content of the row details.
         * Receives three arguments:
         *
         * - `root` The row details content DOM element. Append your content to it.
         * - `grid` The `<vaadin-grid>` element.
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.level` The number of the item's tree sublevel, starts from 0.
         *   - `model.expanded` True if the item's tree sublevel is expanded.
         *   - `model.selected` True if the item is selected.
         *
         * @type {GridRowDetailsRenderer | null | undefined}
         */
        rowDetailsRenderer: {
          type: Function,
          sync: true,
        },

        /**
         * @type {!Array<!HTMLElement> | undefined}
         * @protected
         */
        _detailsCells: {
          type: Array,
        },
      };
    }

    static get observers() {
      return [
        '_detailsOpenedItemsChanged(detailsOpenedItems, rowDetailsRenderer)',
        '_rowDetailsRendererChanged(rowDetailsRenderer)',
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      this._detailsCellResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(({ target: cell }) => {
          this._updateDetailsCellHeight(cell.parentElement);
        });

        // This workaround is needed until Safari also supports
        // ResizeObserver.observe with {box: 'border-box'}
        this.__virtualizer.__adapter._resizeHandler();
      });
    }

    /** @private */
    _rowDetailsRendererChanged(rowDetailsRenderer) {
      if (!rowDetailsRenderer) {
        return;
      }

      if (this._columnTree) {
        // Only update the rows if the column tree has already been initialized
        iterateChildren(this.$.items, (row) => {
          if (!row.querySelector('[part~=details-cell]')) {
            this._updateRow(row, this._columnTree[this._columnTree.length - 1]);
            const isDetailsOpened = this._isDetailsOpened(row._item);
            this._toggleDetailsCell(row, isDetailsOpened);
          }
        });
      }
    }

    /** @private */
    _detailsOpenedItemsChanged(_detailsOpenedItems, rowDetailsRenderer) {
      iterateChildren(this.$.items, (row) => {
        // Re-renders the row to possibly close the previously opened details.
        if (row.hasAttribute('details-opened')) {
          this._updateItem(row, row._item);
          return;
        }

        // Re-renders the row to open the details when a row details renderer is provided.
        if (rowDetailsRenderer && this._isDetailsOpened(row._item)) {
          this._updateItem(row, row._item);
        }
      });
    }

    /**
     * @param {!HTMLElement} cell
     * @protected
     */
    _configureDetailsCell(cell) {
      cell.setAttribute('part', 'cell details-cell');
      // Freeze the details cell, so that it does not scroll horizontally
      // with the normal cells. This way it looks less weird.
      cell.toggleAttribute('frozen', true);

      this._detailsCellResizeObserver.observe(cell);
    }

    /**
     * @param {!HTMLElement} row
     * @param {!GridItem} item
     * @protected
     */
    _toggleDetailsCell(row, detailsOpened) {
      const cell = row.querySelector('[part~="details-cell"]');
      if (!cell) {
        return;
      }

      cell.hidden = !detailsOpened;

      if (cell.hidden) {
        return;
      }

      // Assigns a renderer when the details cell is opened.
      // The details cell content is rendered later in the `_updateItem` method.
      if (this.rowDetailsRenderer) {
        cell._renderer = this.rowDetailsRenderer;
      }
    }

    /** @protected */
    _updateDetailsCellHeight(row) {
      const cell = row.querySelector('[part~="details-cell"]');
      if (!cell) {
        return;
      }

      this.__updateDetailsRowPadding(row, cell);
      // Ensure the row has correct padding after frame (the resize observer might miss it)
      requestAnimationFrame(() => this.__updateDetailsRowPadding(row, cell));
    }

    /** @private */
    __updateDetailsRowPadding(row, cell) {
      if (cell.hidden) {
        row.style.removeProperty('padding-bottom');
      } else {
        row.style.setProperty('padding-bottom', `${cell.offsetHeight}px`);
      }
    }

    /** @protected */
    _updateDetailsCellHeights() {
      iterateChildren(this.$.items, (row) => {
        this._updateDetailsCellHeight(row);
      });
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isDetailsOpened(item) {
      return this.detailsOpenedItems && this._getItemIndexInArray(item, this.detailsOpenedItems) !== -1;
    }

    /**
     * Open the details row of a given item.
     * @param {!GridItem} item
     */
    openItemDetails(item) {
      if (!this._isDetailsOpened(item)) {
        this.detailsOpenedItems = [...this.detailsOpenedItems, item];
      }
    }

    /**
     * Close the details row of a given item.
     * @param {!GridItem} item
     */
    closeItemDetails(item) {
      if (this._isDetailsOpened(item)) {
        this.detailsOpenedItems = this.detailsOpenedItems.filter((i) => !this._itemsEqual(i, item));
      }
    }
  };
