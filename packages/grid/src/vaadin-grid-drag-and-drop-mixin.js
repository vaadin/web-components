/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const DropMode = {
  BETWEEN: 'between',
  ON_TOP: 'on-top',
  ON_TOP_OR_BETWEEN: 'on-top-or-between',
  ON_GRID: 'on-grid',
};

const DropLocation = {
  ON_TOP: 'on-top',
  ABOVE: 'above',
  BELOW: 'below',
  EMPTY: 'empty',
};

/**
 * @polymerMixin
 */
export const DragAndDropMixin = (superClass) =>
  class DragAndDropMixin extends superClass {
    static get properties() {
      return {
        /**
         * Defines the locations within the Grid row where an element can be dropped.
         *
         * Possible values are:
         * - `between`: The drop event can happen between Grid rows.
         * - `on-top`: The drop event can happen on top of Grid rows.
         * - `on-top-or-between`: The drop event can happen either on top of or between Grid rows.
         * - `on-grid`: The drop event will not happen on any specific row, it will show the drop target outline around the whole grid.
         * @attr {between|on-top|on-top-or-between|on-grid} drop-mode
         * @type {GridDropMode | null | undefined}
         */
        dropMode: String,

        /**
         * Marks the grid's rows to be available for dragging.
         * @attr {boolean} rows-draggable
         */
        rowsDraggable: Boolean,

        /**
         * A function that filters dragging of specific grid rows. The return value should be false
         * if dragging of the row should be disabled.
         *
         * Receives one argument:
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *
         * @type {GridDragAndDropFilter | null | undefined}
         */
        dragFilter: Function,

        /**
         * A function that filters dropping on specific grid rows. The return value should be false
         * if dropping on the row should be disabled.
         *
         * Receives one argument:
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *
         * @type {GridDragAndDropFilter | null | undefined}
         */
        dropFilter: Function,

        /** @private */
        __dndAutoScrollThreshold: {
          value: 50,
        },
      };
    }

    static get observers() {
      return ['_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)'];
    }

    /** @protected */
    ready() {
      super.ready();
      this.$.table.addEventListener('dragstart', this._onDragStart.bind(this));
      this.$.table.addEventListener('dragend', this._onDragEnd.bind(this));
      this.$.table.addEventListener('dragover', this._onDragOver.bind(this));
      this.$.table.addEventListener('dragleave', this._onDragLeave.bind(this));
      this.$.table.addEventListener('drop', this._onDrop.bind(this));
      this.$.table.addEventListener('dragenter', (e) => {
        if (this.dropMode) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    /** @private */
    _onDragStart(e) {
      if (this.rowsDraggable) {
        let row = e.target;
        if (row.localName === 'vaadin-grid-cell-content') {
          // The draggable node is the cell content element on browsers that support native shadow
          row = row.assignedSlot.parentNode.parentNode;
        }
        if (row.parentNode !== this.$.items) {
          return;
        }

        e.stopPropagation();
        this.toggleAttribute('dragging-rows', true);

        if (this._safari) {
          // Safari doesn't position drag images from transformed
          // elements properly so we need to switch to use top temporarily
          const transform = row.style.transform;
          row.style.top = /translateY\((.*)\)/.exec(transform)[1];
          row.style.transform = 'none';
          requestAnimationFrame(() => {
            row.style.top = '';
            row.style.transform = transform;
          });
        }

        const rowRect = row.getBoundingClientRect();

        if (this._ios) {
          e.dataTransfer.setDragImage(row);
        } else {
          e.dataTransfer.setDragImage(row, e.clientX - rowRect.left, e.clientY - rowRect.top);
        }

        let rows = [row];
        if (this._isSelected(row._item)) {
          rows = this.__getViewportRows()
            .filter((row) => this._isSelected(row._item))
            .filter((row) => !this.dragFilter || this.dragFilter(this.__getRowModel(row)));
        }

        // Set the default transfer data
        e.dataTransfer.setData('text', this.__formatDefaultTransferData(rows));

        row.setAttribute('dragstart', rows.length > 1 ? rows.length : '');
        this.style.setProperty('--_grid-drag-start-x', `${e.clientX - rowRect.left + 20}px`);
        this.style.setProperty('--_grid-drag-start-y', `${e.clientY - rowRect.top + 10}px`);

        requestAnimationFrame(() => {
          row.removeAttribute('dragstart');
          this.updateStyles({ '--_grid-drag-start-x': '', '--_grid-drag-start-y': '' });
        });

        const event = new CustomEvent('grid-dragstart', {
          detail: {
            draggedItems: rows.map((row) => row._item),
            setDragData: (type, data) => e.dataTransfer.setData(type, data),
            setDraggedItemsCount: (count) => row.setAttribute('dragstart', count),
          },
        });
        event.originalEvent = e;
        this.dispatchEvent(event);
      }
    }

    /** @private */
    _onDragEnd(e) {
      this.toggleAttribute('dragging-rows', false);
      e.stopPropagation();
      const event = new CustomEvent('grid-dragend');
      event.originalEvent = e;
      this.dispatchEvent(event);
    }

    /** @private */
    _onDragLeave(e) {
      e.stopPropagation();
      this._clearDragStyles();
    }

    /** @private */
    _onDragOver(e) {
      if (this.dropMode) {
        this._dropLocation = undefined;
        this._dragOverItem = undefined;

        if (this.__dndAutoScroll(e.clientY)) {
          this._clearDragStyles();
          return;
        }

        let row = e.composedPath().filter((node) => node.localName === 'tr')[0];

        if (!this._effectiveSize || this.dropMode === DropMode.ON_GRID) {
          // The grid is empty or "on-grid" drop mode was used, always default to "empty"
          this._dropLocation = DropLocation.EMPTY;
        } else if (!row || row.parentNode !== this.$.items) {
          // The dragover didn't occur on a body row but the grid has items
          if (row) {
            // The dragover occurred over a header/footer row
            return;
          } else if (this.dropMode === DropMode.BETWEEN || this.dropMode === DropMode.ON_TOP_OR_BETWEEN) {
            // The drop mode allows setting the last row as the drag over item
            row = Array.from(this.$.items.children)
              .filter((row) => !row.hidden)
              .pop();
            this._dropLocation = DropLocation.BELOW;
          } else {
            // Drop mode on-top used but the dragover didn't occur over one of the existing rows
            return;
          }
        } else {
          // The dragover occurred on a body row, determine the drop location from coordinates
          const rowRect = row.getBoundingClientRect();

          this._dropLocation = DropLocation.ON_TOP;

          if (this.dropMode === DropMode.BETWEEN) {
            const dropAbove = e.clientY - rowRect.top < rowRect.bottom - e.clientY;
            this._dropLocation = dropAbove ? DropLocation.ABOVE : DropLocation.BELOW;
          } else if (this.dropMode === DropMode.ON_TOP_OR_BETWEEN) {
            if (e.clientY - rowRect.top < rowRect.height / 3) {
              this._dropLocation = DropLocation.ABOVE;
            } else if (e.clientY - rowRect.top > (rowRect.height / 3) * 2) {
              this._dropLocation = DropLocation.BELOW;
            }
          }
        }

        if (row && row.hasAttribute('drop-disabled')) {
          this._dropLocation = undefined;
          return;
        }

        e.stopPropagation();
        e.preventDefault();

        if (this._dropLocation === DropLocation.EMPTY) {
          this.toggleAttribute('dragover', true);
        } else if (row) {
          this._dragOverItem = row._item;
          if (row.getAttribute('dragover') !== this._dropLocation) {
            row.setAttribute('dragover', this._dropLocation);
          }
        } else {
          this._clearDragStyles();
        }
      }
    }

    /** @private */
    __dndAutoScroll(clientY) {
      if (this.__dndAutoScrolling) {
        return true;
      }

      const headerBottom = this.$.header.getBoundingClientRect().bottom;
      const footerTop = this.$.footer.getBoundingClientRect().top;
      const topDiff = headerBottom - clientY + this.__dndAutoScrollThreshold;
      const bottomDiff = clientY - footerTop + this.__dndAutoScrollThreshold;
      let scrollTopDelta = 0;

      if (bottomDiff > 0) {
        scrollTopDelta = bottomDiff * 2;
      } else if (topDiff > 0) {
        scrollTopDelta = -topDiff * 2;
      }

      if (scrollTopDelta) {
        const scrollTop = this.$.table.scrollTop;
        this.$.table.scrollTop += scrollTopDelta;
        const scrollTopChanged = scrollTop !== this.$.table.scrollTop;
        if (scrollTopChanged) {
          this.__dndAutoScrolling = true;
          // Disallow more auto-scrolls within 20ms
          setTimeout(() => (this.__dndAutoScrolling = false), 20);
          return true;
        }
      }
    }

    /** @private */
    __getViewportRows() {
      const headerBottom = this.$.header.getBoundingClientRect().bottom;
      const footerTop = this.$.footer.getBoundingClientRect().top;
      return Array.from(this.$.items.children).filter((row) => {
        const rowRect = row.getBoundingClientRect();
        return rowRect.bottom > headerBottom && rowRect.top < footerTop;
      });
    }

    /** @protected */
    _clearDragStyles() {
      this.removeAttribute('dragover');
      Array.from(this.$.items.children).forEach((row) => row.removeAttribute('dragover'));
    }

    /** @private */
    _onDrop(e) {
      if (this.dropMode) {
        e.stopPropagation();
        e.preventDefault();

        const dragData =
          e.dataTransfer.types &&
          Array.from(e.dataTransfer.types).map((type) => {
            return {
              type,
              data: e.dataTransfer.getData(type),
            };
          });

        this._clearDragStyles();

        const event = new CustomEvent('grid-drop', {
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          detail: {
            dropTargetItem: this._dragOverItem,
            dropLocation: this._dropLocation,
            dragData,
          },
        });
        event.originalEvent = e;
        this.dispatchEvent(event);
      }
    }

    /** @private */
    __formatDefaultTransferData(rows) {
      return rows
        .map((row) => {
          return Array.from(row.children)
            .filter((cell) => !cell.hidden && cell.getAttribute('part').indexOf('details-cell') === -1)
            .sort((a, b) => {
              return a._column._order > b._column._order ? 1 : -1;
            })
            .map((cell) => cell._content.textContent.trim())
            .filter((content) => content)
            .join('\t');
        })
        .join('\n');
    }

    /** @private */
    _dragDropAccessChanged() {
      this.filterDragAndDrop();
    }

    /**
     * Runs the `dragFilter` and `dropFilter` hooks for the visible cells.
     * If the filter depends on varying conditions, you may need to
     * call this function manually in order to update the draggability when
     * the conditions change.
     */
    filterDragAndDrop() {
      Array.from(this.$.items.children)
        .filter((row) => !row.hidden)
        .forEach((row) => {
          this._filterDragAndDrop(row, this.__getRowModel(row));
        });
    }

    /**
     * @param {!HTMLElement} row
     * @param {!GridItemModel} model
     * @protected
     */
    _filterDragAndDrop(row, model) {
      const loading = this.loading || row.hasAttribute('loading');
      const dragDisabled = !this.rowsDraggable || loading || (this.dragFilter && !this.dragFilter(model));
      const dropDisabled = !this.dropMode || loading || (this.dropFilter && !this.dropFilter(model));

      const draggableElements = Array.from(row.children).map((cell) => cell._content);

      draggableElements.forEach((e) => {
        if (dragDisabled) {
          e.removeAttribute('draggable');
        } else {
          e.setAttribute('draggable', true);
        }
      });

      row.toggleAttribute('drag-disabled', !!dragDisabled);
      row.toggleAttribute('drop-disabled', !!dropDisabled);
    }

    /**
     * Fired when starting to drag grid rows.
     *
     * @event grid-dragstart
     * @param {Object} originalEvent The native dragstart event
     * @param {Object} detail
     * @param {Object} detail.draggedItems the items in the visible viewport that are dragged
     * @param {Function} detail.setDraggedItemsCount Overrides the default number shown in the drag image on multi row drag.
     * Parameter is of type number.
     * @param {Function} detail.setDragData Sets dataTransfer data for the drag operation.
     * Note that "text" is the only data type supported by all the browsers the grid currently supports (including IE11).
     * The function takes two parameters:
     * - type:string The type of the data
     * - data:string The data
     */

    /**
     * Fired when the dragging of the rows ends.
     *
     * @event grid-dragend
     * @param {Object} originalEvent The native dragend event
     */

    /**
     * Fired when a drop occurs on top of the grid.
     *
     * @event grid-drop
     * @param {Object} originalEvent The native drop event
     * @param {Object} detail
     * @param {Object} detail.dropTargetItem The item of the grid row on which the drop occurred.
     * @param {string} detail.dropLocation The position at which the drop event took place relative to a row.
     * Depending on the dropMode value, the drop location can be one of the following
     * - `on-top`: when the drop occurred on top of the row
     * - `above`: when the drop occurred above the row
     * - `below`: when the drop occurred below the row
     * - `empty`: when the drop occurred over the grid, not relative to any specific row
     * @param {string} detail.dragData An array of items with the payload as a string representation as the
     * `data` property and the type of the data as `type` property.
     */
  };
