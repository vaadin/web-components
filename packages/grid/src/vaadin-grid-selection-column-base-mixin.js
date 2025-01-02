/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
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
          sync: true,
        },

        /**
         * Override `autoWidth` to enable auto-width
         */
        autoWidth: {
          type: Boolean,
          value: true,
        },

        /**
         * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
         * @attr {number} flex-grow
         * @type {number}
         */
        flexGrow: {
          type: Number,
          value: 0,
          sync: true,
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
          sync: true,
        },

        /**
         * When true, the active gets automatically selected.
         * @attr {boolean} auto-select
         * @type {boolean}
         */
        autoSelect: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When true, rows can be selected by dragging over the selection column.
         * @attr {boolean} drag-select
         * @type {boolean}
         */
        dragSelect: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /** @protected */
        _indeterminate: {
          type: Boolean,
          sync: true,
        },

        /** @protected */
        _selectAllHidden: Boolean,

        /**
         * Indicates whether the shift key is currently pressed.
         *
         * @protected
         */
        _shiftKeyDown: {
          type: Boolean,
          value: false,
        },
      };
    }

    static get observers() {
      return [
        '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, _indeterminate, _selectAllHidden)',
      ];
    }

    constructor() {
      super();
      this.__onCellTrack = this.__onCellTrack.bind(this);
      this.__onCellClick = this.__onCellClick.bind(this);
      this.__onCellMouseDown = this.__onCellMouseDown.bind(this);
      this.__onGridInteraction = this.__onGridInteraction.bind(this);
      this.__onActiveItemChanged = this.__onActiveItemChanged.bind(this);
      this.__onSelectRowCheckboxChange = this.__onSelectRowCheckboxChange.bind(this);
      this.__onSelectAllCheckboxChange = this.__onSelectAllCheckboxChange.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      if (this._grid) {
        this._grid.addEventListener('keyup', this.__onGridInteraction);
        this._grid.addEventListener('keydown', this.__onGridInteraction, { capture: true });
        this._grid.addEventListener('mousedown', this.__onGridInteraction);
        this._grid.addEventListener('active-item-changed', this.__onActiveItemChanged);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._grid) {
        this._grid.removeEventListener('keyup', this.__onGridInteraction);
        this._grid.removeEventListener('keydown', this.__onGridInteraction, { capture: true });
        this._grid.removeEventListener('mousedown', this.__onGridInteraction);
        this._grid.removeEventListener('active-item-changed', this.__onActiveItemChanged);
      }
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
        checkbox.addEventListener('change', this.__onSelectAllCheckboxChange);
        root.appendChild(checkbox);
      }

      const checked = this.__isChecked(this.selectAll, this._indeterminate);
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
        checkbox.addEventListener('change', this.__onSelectRowCheckboxChange);
        root.appendChild(checkbox);
        addListener(root, 'track', this.__onCellTrack);
        root.addEventListener('mousedown', this.__onCellMouseDown);
        root.addEventListener('click', this.__onCellClick);
      }

      checkbox.__item = item;
      checkbox.checked = selected;

      const isSelectable = this._grid.__isItemSelectable(item);
      checkbox.readonly = !isSelectable;
      checkbox.hidden = !isSelectable && !selected;
    }

    /**
     * Updates the select all state when the Select All checkbox is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onSelectAllCheckboxChange(e) {
      if (this._indeterminate || e.currentTarget.checked) {
        this._selectAll();
      } else {
        this._deselectAll();
      }
    }

    /** @private */
    __onGridInteraction(e) {
      if (e instanceof KeyboardEvent) {
        this._shiftKeyDown = e.key !== 'Shift' && e.shiftKey;
      } else {
        this._shiftKeyDown = e.shiftKey;
      }

      if (this.autoSelect) {
        // Prevent text selection when shift-clicking to select a range of items.
        this._grid.$.scroller.toggleAttribute('range-selecting', this._shiftKeyDown);
      }
    }

    /**
     * Selects or deselects the row when the Select Row checkbox is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onSelectRowCheckboxChange(e) {
      this.__toggleItem(e.currentTarget.__item, e.currentTarget.checked);
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
        this.__selectOnDrag = !this._grid._isSelected(dragStartRow._item);
        // Store the index of the row where the drag started
        this.__dragStartIndex = dragStartRow.index;
        // Store the item of the row where the drag started
        this.__dragStartItem = dragStartRow._item;
        // Start the auto scroller
        this.__dragAutoScroller();
      } else if (event.detail.state === 'end') {
        // if drag start and end stays within the same item, then toggle its state
        if (this.__dragStartItem) {
          this.__toggleItem(this.__dragStartItem, this.__selectOnDrag);
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
    _onCellKeyDown(e) {
      const target = e.composedPath()[0];
      // Toggle on Space without having to enter interaction mode first
      if (e.keyCode !== 32) {
        return;
      }
      if (target === this._headerCell) {
        if (this.selectAll) {
          this._deselectAll();
        } else {
          this._selectAll();
        }
      } else if (this._cells.includes(target) && !this.autoSelect) {
        const checkbox = target._content.firstElementChild;
        this.__toggleItem(checkbox.__item);
      }
    }

    /** @private */
    __onActiveItemChanged(e) {
      const activeItem = e.detail.value;
      if (this.autoSelect) {
        const item = activeItem || this.__previousActiveItem;
        if (item) {
          this.__toggleItem(item);
        }
      }
      this.__previousActiveItem = activeItem;
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
            this.__toggleItem(row._item, this.__selectOnDrag);
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
    _selectItem(_item) {}

    /**
     * Override to handle the user deselecting an item.
     * @param {Object} item the item to deselect
     * @protected
     */
    _deselectItem(_item) {}

    /**
     * Toggles the selected state of the given item.
     *
     * @param item the item to toggle
     * @param {boolean} [selected] whether to select or deselect the item
     * @private
     */
    __toggleItem(item, selected = !this._grid._isSelected(item)) {
      if (selected === this._grid._isSelected(item)) {
        // Skip selection if the item is already in the desired state.
        // Note, _selectItem and _deselectItem may be overridden in custom
        // selection column implementations, and calling them unnecessarily
        // might affect performance (e.g. vaadin-grid-flow-selection-column).
        return;
      }

      if (selected) {
        this._selectItem(item);
      } else {
        this._deselectItem(item);
      }
    }

    /**
     * IOS needs indeterminate + checked at the same time
     * @private
     */
    __isChecked(selectAll, indeterminate) {
      return indeterminate || selectAll;
    }
  };
