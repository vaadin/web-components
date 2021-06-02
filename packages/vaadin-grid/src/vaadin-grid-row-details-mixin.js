/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Templatizer } from './vaadin-grid-templatizer.js';

/**
 * @polymerMixin
 */
export const RowDetailsMixin = (superClass) =>
  class RowDetailsMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing references to items with open row details.
         * @type {Array<GridItem> | null | undefined}
         */
        detailsOpenedItems: {
          type: Array,
          value: function () {
            return [];
          }
        },

        /**
         * @type {HTMLTemplateElement}
         * @protected
         */
        _rowDetailsTemplate: Object,

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
         *
         * @type {GridRowDetailsRenderer | null | undefined}
         */
        rowDetailsRenderer: Function,

        /**
         * @type {!Array<!HTMLElement> | undefined}
         * @protected
         */
        _detailsCells: {
          type: Array
        }
      };
    }

    static get observers() {
      return [
        '_detailsOpenedItemsChanged(detailsOpenedItems.*, _rowDetailsTemplate, rowDetailsRenderer)',
        '_rowDetailsTemplateOrRendererChanged(_rowDetailsTemplate, rowDetailsRenderer)'
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
    _rowDetailsTemplateOrRendererChanged(rowDetailsTemplate, rowDetailsRenderer) {
      if (rowDetailsTemplate && rowDetailsRenderer) {
        throw new Error('You should only use either a renderer or a template for row details');
      }
      if (rowDetailsTemplate || rowDetailsRenderer) {
        if (rowDetailsTemplate && !rowDetailsTemplate.templatizer) {
          const templatizer = new Templatizer();
          templatizer._grid = this;
          templatizer.dataHost = this.dataHost;
          templatizer.template = rowDetailsTemplate;
          rowDetailsTemplate.templatizer = templatizer;
        }

        if (this._columnTree) {
          // Only update the rows if the column tree has already been initialized
          Array.from(this.$.items.children).forEach((row) => {
            if (!row.querySelector('[part~=details-cell]')) {
              this._updateRow(row, this._columnTree[this._columnTree.length - 1]);
              this._a11yUpdateRowDetailsOpened(row, false);
            }
            // Clear any old template instances
            delete row.querySelector('[part~=details-cell]')._instance;
          });
        }
      }
    }

    /** @private */
    _detailsOpenedItemsChanged(changeRecord, _rowDetailsTemplate, _rowDetailsRenderer) {
      // Skip to avoid duplicate work of both “.splices” and “.length” updates
      if (changeRecord.path === 'detailsOpenedItems.length' || !changeRecord.value) {
        return;
      }

      [...this.$.items.children].forEach((row) => {
        // Re-renders the row to possibly close the previously opened details
        if (row.hasAttribute('details-opened')) {
          this._updateItem(row, row._item);
          return;
        }

        // Re-renders the row to open the details when either a renderer or a template is provided
        if ((_rowDetailsTemplate || _rowDetailsRenderer) && this._isDetailsOpened(row._item)) {
          this._updateItem(row, row._item);
          return;
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
      this._toggleAttribute('frozen', true, cell);

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

      // Assign either a renderer...
      if (this.rowDetailsRenderer) {
        cell._renderer = this.rowDetailsRenderer;
      }

      // ...or a template.
      if (this._rowDetailsTemplate && !cell._instance) {
        cell._instance = this._rowDetailsTemplate.templatizer.createInstance();
        cell._content.innerHTML = '';
        cell._content.appendChild(cell._instance.root);
      }
    }

    /** @protected */
    _updateDetailsCellHeight(row) {
      const cell = row.querySelector('[part~="details-cell"]');
      if (!cell) {
        return;
      }

      if (cell.hidden) {
        row.style.removeProperty('padding-bottom');
      } else {
        row.style.setProperty('padding-bottom', `${cell.offsetHeight}px`);
      }
    }

    /** @protected */
    _updateDetailsCellHeights() {
      Array.from(this.$.items.querySelectorAll('[part~="details-cell"]:not([hidden])')).forEach((cell) => {
        cell.parentElement.style.setProperty('padding-bottom', `${cell.offsetHeight}px`);
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

    /** @private */
    _detailsOpenedInstanceChangedCallback(instance, value) {
      if (value) {
        this.openItemDetails(instance.item);
      } else {
        this.closeItemDetails(instance.item);
      }
    }
  };
