/**
 * @license
 * Copyright (c) 2020 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Templatizer } from './vaadin-grid-templatizer.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';

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

        if (this.detailsOpenedItems.length) {
          Array.from(this.$.items.children).forEach(this._toggleDetailsCell, this);
          this._update();
        }
      }
    }

    /** @private */
    _detailsOpenedItemsChanged(changeRecord) {
      if (changeRecord.path === 'detailsOpenedItems.length' || !changeRecord.value) {
        // Let’s avoid duplicate work of both “.splices” and “.length” updates.
        return;
      }
      Array.from(this.$.items.children).forEach((row) => {
        this._toggleDetailsCell(row, row._item);
        this._a11yUpdateRowDetailsOpened(row, this._isDetailsOpened(row._item));
        this._toggleAttribute('details-opened', this._isDetailsOpened(row._item), row);
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
    }

    /**
     * @param {!HTMLElement} row
     * @param {!GridItem} item
     * @protected
     */
    _toggleDetailsCell(row, item) {
      const cell = row.querySelector('[part~="details-cell"]');
      if (!cell) {
        return;
      }
      const detailsHidden = !this._isDetailsOpened(item);
      const hiddenChanged = !!cell.hidden !== detailsHidden;

      if ((!cell._instance && !cell._renderer) || cell.hidden !== detailsHidden) {
        cell.hidden = detailsHidden;
        if (detailsHidden) {
          row.style.removeProperty('padding-bottom');
        } else {
          if (this.rowDetailsRenderer) {
            cell._renderer = this.rowDetailsRenderer;
            cell._renderer.call(this, cell._content, this, { index: row.index, item: item });
          } else if (this._rowDetailsTemplate && !cell._instance) {
            // Stamp the template
            cell._instance = this._rowDetailsTemplate.templatizer.createInstance();
            cell._content.innerHTML = '';
            cell._content.appendChild(cell._instance.root);
            this._updateItem(row, item);
          }

          flush();
          row.style.setProperty('padding-bottom', `${cell.offsetHeight}px`);

          requestAnimationFrame(() => this.notifyResize());
        }
      }
      if (hiddenChanged) {
        this._updateMetrics();
        this._positionItems();
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
        this.push('detailsOpenedItems', item);
      }
    }

    /**
     * Close the details row of a given item.
     * @param {!GridItem} item
     */
    closeItemDetails(item) {
      if (this._isDetailsOpened(item)) {
        this.splice('detailsOpenedItems', this._getItemIndexInArray(item, this.detailsOpenedItems), 1);
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
