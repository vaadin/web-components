/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addListener } from '@vaadin/component-base/src/gestures.js';

/**
 * A mixin that provides basic functionality for the
 * `<vaadin-grid-selection-column>`. This includes properties, cell rendering,
 * and overridable methods for handling changes to the selection state.
 *
 * **NOTE**: This mixin is re-used by the Flow component, and as such must not
 * implement any selection state updates for the column element or the grid.
 * Web component-specific selection state updates must be implemented in the
 * `<vaadin-grid-selection-column>` itself, by overriding the protected methods
 * provided by this mixin.
 *
 * @polymerMixin
 */
export const GridSelectionColumnBaseMixin = (superClass) =>
  class GridSelectionColumnBaseMixin extends superClass {
    static get properties() {
      return {
        /**
         * Width of the cells for this column.
         */
        width: {
          type: String,
          value: '58px',
        },

        /**
         * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
         * @attr {number} flex-grow
         * @type {number}
         */
        flexGrow: {
          type: Number,
          value: 0,
        },

        /**
         * When true, all the items are selected.
         * @attr {boolean} select-all
         * @type {boolean}
         */
        selectAll: {
          type: Boolean,
          value: false,
          notify: true,
        },

        /**
         * When true, the active gets automatically selected.
         * @attr {boolean} auto-select
         * @type {boolean}
         */
        autoSelect: {
          type: Boolean,
          value: false,
        },

        /**
         * When true, rows can be selected by dragging over the selection column.
         * @attr {boolean} drag-select
         * @type {boolean}
         */
        dragSelect: {
          type: Boolean,
          value: false,
        },

        /** @protected */
        _indeterminate: Boolean,

        /** @protected */
        _selectAllHidden: Boolean,
      };
    }

    static get observers() {
      return [
        '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, _indeterminate, _selectAllHidden)',
      ];
    }

    /**
     * Renders the Select All checkbox to the header cell.
     *
     * @override
     */
    _defaultHeaderRenderer(root, _column) {
      let checkbox = root.firstElementChild;
      if (!checkbox) {
        checkbox = document.createElement('vaadin-checkbox');
        checkbox.setAttribute('aria-label', 'Select All');
        checkbox.classList.add('vaadin-grid-select-all-checkbox');
        root.appendChild(checkbox);
        // Add listener after appending, so we can skip the initial change event
        checkbox.addEventListener('checked-changed', this.__onSelectAllCheckedChanged.bind(this));
      }

      const checked = this.__isChecked(this.selectAll, this._indeterminate);
      checkbox.__rendererChecked = checked;
      checkbox.checked = checked;
      checkbox.hidden = this._selectAllHidden;
      checkbox.indeterminate = this._indeterminate;
    }

    /**
     * Renders the Select Row checkbox to the body cell.
     *
     * @override
     */
    _defaultRenderer(root, _column, { item, selected }) {
      let checkbox = root.firstElementChild;
      if (!checkbox) {
        checkbox = document.createElement('vaadin-checkbox');
        checkbox.setAttribute('aria-label', 'Select Row');
        root.appendChild(checkbox);
        // Add listener after appending, so we can skip the initial change event
        checkbox.addEventListener('checked-changed', this.__onSelectRowCheckedChanged.bind(this));
        addListener(root, 'track', this.__onCellTrack.bind(this));
        root.addEventListener('mousedown', this.__onCellMouseDown.bind(this));
        root.addEventListener('click', this.__onCellClick.bind(this));
      }

      checkbox.__item = item;
      checkbox.__rendererChecked = selected;
      checkbox.checked = selected;
    }

    /**
     * Updates the select all state when the Select All checkbox is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onSelectAllCheckedChanged(e) {
      // Skip if the state is changed by the renderer.
      if (e.target.checked === e.target.__rendererChecked) {
        return;
      }

      if (this._indeterminate || e.target.checked) {
        this._selectAll();
      } else {
        this._deselectAll();
      }
    }

    /**
     * Selects or deselects the row when the Select Row checkbox is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onSelectRowCheckedChanged(e) {
      // Skip if the state is changed by the renderer.
      if (e.target.checked === e.target.__rendererChecked) {
        return;
      }

      if (e.target.checked) {
        this._selectItem(e.target.__item);
      } else {
        this._deselectItem(e.target.__item);
      }
    }

    /** @private */
    __onCellTrack(event) {
      if (!this.dragSelect) {
        return;
      }
      this.__dragCurrentY = event.detail.y;
      this.__dragDy = event.detail.dy;
      if (event.detail.state === 'start') {
        const renderedRows = this._grid._getRenderedRows();
        // Get the row where the drag started
        const dragStartRow = renderedRows.find((row) => row.contains(event.currentTarget.assignedSlot));
        // Whether to select or deselect the items on drag
        this.__dragSelect = !this._grid._isSelected(dragStartRow._item);
        // Store the index of the row where the drag started
        this.__dragStartIndex = dragStartRow.index;
        // Store the item of the row where the drag started
        this.__dragStartItem = dragStartRow._item;
        // Start the auto scroller
        this.__dragAutoScroller();
      } else if (event.detail.state === 'end') {
        // if drag start and end stays within the same item, then toggle its state
        if (this.__dragStartItem) {
          if (this.__dragSelect) {
            this._selectItem(this.__dragStartItem);
          } else {
            this._deselectItem(this.__dragStartItem);
          }
        }
        // clear drag state after timeout, which allows preventing the
        // subsequent click event if drag started and ended on the same item
        setTimeout(() => {
          this.__dragStartIndex = undefined;
        });
      }
    }

    /** @private */
    __onCellMouseDown(e) {
      if (this.dragSelect) {
        // Prevent text selection when starting to drag
        e.preventDefault();
      }
    }

    /** @private */
    __onCellClick(e) {
      if (this.__dragStartIndex !== undefined) {
        // Stop the click event if drag was enabled. This click event should
        // only occur if drag started and stopped on the same item. In that case
        // the selection state has already been toggled on drag end, and we
        // don't  want to toggle it again from clicking the checkbox or changing
        // the active item.
        e.preventDefault();
      }
    }

    /** @private */
    __dragAutoScroller() {
      if (this.__dragStartIndex === undefined) {
        return;
      }
      // Get the row being hovered over
      const renderedRows = this._grid._getRenderedRows();
      const hoveredRow = renderedRows.find((row) => {
        const rowRect = row.getBoundingClientRect();
        return this.__dragCurrentY >= rowRect.top && this.__dragCurrentY <= rowRect.bottom;
      });

      // Get the index of the row being hovered over or the first/last
      // visible row if hovering outside the grid
      let hoveredIndex = hoveredRow ? hoveredRow.index : undefined;
      const scrollableArea = this.__getScrollableArea();
      if (this.__dragCurrentY < scrollableArea.top) {
        hoveredIndex = this._grid._firstVisibleIndex;
      } else if (this.__dragCurrentY > scrollableArea.bottom) {
        hoveredIndex = this._grid._lastVisibleIndex;
      }

      if (hoveredIndex !== undefined) {
        // Select all items between the start and the current row
        renderedRows.forEach((row) => {
          if (
            (hoveredIndex > this.__dragStartIndex && row.index >= this.__dragStartIndex && row.index <= hoveredIndex) ||
            (hoveredIndex < this.__dragStartIndex && row.index <= this.__dragStartIndex && row.index >= hoveredIndex)
          ) {
            if (this.__dragSelect) {
              this._selectItem(row._item);
            } else {
              this._deselectItem(row._item);
            }
            this.__dragStartItem = undefined;
          }
        });
      }

      // Start scrolling in the top/bottom 15% of the scrollable area
      const scrollTriggerArea = scrollableArea.height * 0.15;
      // Maximum number of pixels to scroll per iteration
      const maxScrollAmount = 10;

      if (this.__dragDy < 0 && this.__dragCurrentY < scrollableArea.top + scrollTriggerArea) {
        const dy = scrollableArea.top + scrollTriggerArea - this.__dragCurrentY;
        const percentage = Math.min(1, dy / scrollTriggerArea);
        this._grid.$.table.scrollTop -= percentage * maxScrollAmount;
      }
      if (this.__dragDy > 0 && this.__dragCurrentY > scrollableArea.bottom - scrollTriggerArea) {
        const dy = this.__dragCurrentY - (scrollableArea.bottom - scrollTriggerArea);
        const percentage = Math.min(1, dy / scrollTriggerArea);
        this._grid.$.table.scrollTop += percentage * maxScrollAmount;
      }

      // Schedule the next auto scroll
      setTimeout(() => this.__dragAutoScroller(), 10);
    }

    /**
     * Gets the scrollable area of the grid as a bounding client rect. The
     * scrollable area is the bounding rect of the grid minus the header and
     * footer.
     *
     * @private
     */
    __getScrollableArea() {
      const gridRect = this._grid.$.table.getBoundingClientRect();
      const headerRect = this._grid.$.header.getBoundingClientRect();
      const footerRect = this._grid.$.footer.getBoundingClientRect();

      return {
        top: gridRect.top + headerRect.height,
        bottom: gridRect.bottom - footerRect.height,
        left: gridRect.left,
        right: gridRect.right,
        height: gridRect.height - headerRect.height - footerRect.height,
        width: gridRect.width,
      };
    }

    /**
     * Override to handle the user selecting all items.
     * @protected
     */
    _selectAll() {}

    /**
     * Override to handle the user deselecting all items.
     * @protected
     */
    _deselectAll() {}

    /**
     * Override to handle the user selecting an item.
     * @param {Object} item the item to select
     * @protected
     */
    _selectItem(item) {}

    /**
     * Override to handle the user deselecting an item.
     * @param {Object} item the item to deselect
     * @protected
     */
    _deselectItem(item) {}

    /**
     * IOS needs indeterminate + checked at the same time
     * @private
     */
    __isChecked(selectAll, indeterminate) {
      return indeterminate || selectAll;
    }
  };
