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
         * When true, rows can be selected by dragging mouse cursor over selection column.
         * @attr {boolean} select-rows-by-dragging
         * @type {boolean}
         */
        selectRowsByDragging: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
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

    /** @private */
    __lassoAutoScroller() {
      if (this.__lassoDragStartIndex !== undefined) {
        // Get the row being hovered over
        const renderedRows = this._grid._getRenderedRows();
        const hoveredRow = renderedRows.find((row) => {
          const rowRect = row.getBoundingClientRect();
          return this.__lassoCurrentY >= rowRect.top && this.__lassoCurrentY <= rowRect.bottom;
        });

        // Get the index of the row being hovered over or the first/last
        // visible row if hovering outside the grid
        let hoveredIndex = hoveredRow ? hoveredRow.index : undefined;
        const scrollableArea = this.__getScrollableArea();
        if (this.__lassoCurrentY < scrollableArea.top) {
          hoveredIndex = this._grid._firstVisibleIndex;
        } else if (this.__lassoCurrentY > scrollableArea.bottom) {
          hoveredIndex = this._grid._lastVisibleIndex;
        }

        if (hoveredIndex !== undefined) {
          // Select all items between the start and the current row
          renderedRows.forEach((row) => {
            if (
              (hoveredIndex > this.__lassoDragStartIndex &&
                row.index >= this.__lassoDragStartIndex &&
                row.index <= hoveredIndex) ||
              (hoveredIndex < this.__lassoDragStartIndex &&
                row.index <= this.__lassoDragStartIndex &&
                row.index >= hoveredIndex)
            ) {
              if (this.__lassoSelect) {
                this._selectItem(row._item);
              } else {
                this._deselectItem(row._item);
              }
              this.__lassoDragStartItem = undefined;
            }
          });
        }

        // Start scrolling in the top/bottom 15% of the scrollable area
        const scrollTriggerArea = scrollableArea.height * 0.15;
        // Maximum number of pixels to scroll per iteration
        const maxScrollAmount = 10;

        if (this.__lassoDy < 0 && this.__lassoCurrentY < scrollableArea.top + scrollTriggerArea) {
          const dy = scrollableArea.top + scrollTriggerArea - this.__lassoCurrentY;
          const percentage = Math.min(1, dy / scrollTriggerArea);
          this._grid.$.table.scrollTop -= percentage * maxScrollAmount;
        }
        if (this.__lassoDy > 0 && this.__lassoCurrentY > scrollableArea.bottom - scrollTriggerArea) {
          const dy = this.__lassoCurrentY - (scrollableArea.bottom - scrollTriggerArea);
          const percentage = Math.min(1, dy / scrollTriggerArea);
          this._grid.$.table.scrollTop += percentage * maxScrollAmount;
        }

        // Schedule the next auto scroll
        setTimeout(() => this.__lassoAutoScroller(), 10);
      }
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

    /** @private */
    __onSelectionColumnCellTrack(event) {
      if (!this.selectRowsByDragging) {
        return;
      }
      this.__lassoCurrentY = event.detail.y;
      this.__lassoDy = event.detail.dy;
      if (event.detail.state === 'start') {
        this.__lassoWasEnabled = true;
        const renderedRows = this._grid._getRenderedRows();
        // Get the row where the drag started
        const lassoStartRow = renderedRows.find((row) => row.contains(event.currentTarget.assignedSlot));
        // Whether to select or deselect the items on drag
        this.__lassoSelect = !this._grid._isSelected(lassoStartRow._item);
        // Store the index of the row where the drag started
        this.__lassoDragStartIndex = lassoStartRow.index;
        // Store the item of the row where the drag started
        this.__lassoDragStartItem = lassoStartRow._item;
        // Start the auto scroller
        this.__lassoAutoScroller();
      } else if (event.detail.state === 'end') {
        // if lasso drag start and end stays within the same item, then toggle its state
        if (this.__lassoDragStartItem) {
          if (this.__lassoSelect) {
            this._selectItem(this.__lassoDragStartItem);
          } else {
            this._deselectItem(this.__lassoDragStartItem);
          }
        }
        this.__lassoDragStartIndex = undefined;
      }
    }

    /** @private */
    __onSelectionColumnCellMouseDown(e) {
      if (this.selectRowsByDragging) {
        e.preventDefault();
      }
    }

    /** @private */
    __onCheckboxClick(e) {
      if (!this.selectRowsByDragging) {
        return;
      }
      // ignore checkbox mouse click if start item was already selected or deselected by lasso selection
      if (this.__lassoDragStartItem) {
        e.preventDefault();
      }
      this.__lassoDragStartItem = undefined;
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
        checkbox.addEventListener('click', this.__onCheckboxClick.bind(this));
        addListener(root, 'track', this.__onSelectionColumnCellTrack.bind(this));
        root.addEventListener('mousedown', this.__onSelectionColumnCellMouseDown.bind(this));
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
