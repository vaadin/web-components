/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/checkbox/src/vaadin-checkbox.js';
import { addListener } from '@vaadin/component-base/src/gestures.js';
import { GridColumn } from './vaadin-grid-column.js';

/**
 * `<vaadin-grid-selection-column>` is a helper element for the `<vaadin-grid>`
 * that provides default renderers and functionality for item selection.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-selection-column frozen auto-select></vaadin-grid-selection-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * By default the selection column displays `<vaadin-checkbox>` elements in the
 * column cells. The checkboxes in the body rows toggle selection of the corresponding row items.
 *
 * When the grid data is provided as an array of [`items`](#/elements/vaadin-grid#property-items),
 * the column header gets an additional checkbox that can be used for toggling
 * selection for all the items at once.
 *
 * __The default content can also be overridden__
 *
 * @fires {CustomEvent} select-all-changed - Fired when the `selectAll` property changes.
 */
class GridSelectionColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-selection-column';
  }

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

      /** @private */
      __indeterminate: Boolean,

      /**
       * The previous state of activeItem. When activeItem turns to `null`,
       * previousActiveItem will have an Object with just unselected activeItem
       * @private
       */
      __previousActiveItem: Object,

      /** @private */
      __selectAllHidden: Boolean,
    };
  }

  static get observers() {
    return [
      '__onSelectAllChanged(selectAll)',
      '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, __indeterminate, __selectAllHidden)',
    ];
  }

  constructor() {
    super();

    this.__boundOnActiveItemChanged = this.__onActiveItemChanged.bind(this);
    this.__boundOnDataProviderChanged = this.__onDataProviderChanged.bind(this);
    this.__boundOnSelectedItemsChanged = this.__onSelectedItemsChanged.bind(this);
  }

  /** @protected */
  disconnectedCallback() {
    this._grid.removeEventListener('active-item-changed', this.__boundOnActiveItemChanged);
    this._grid.removeEventListener('data-provider-changed', this.__boundOnDataProviderChanged);
    this._grid.removeEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
    this._grid.removeEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);

    super.disconnectedCallback();
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    if (this._grid) {
      this._grid.addEventListener('active-item-changed', this.__boundOnActiveItemChanged);
      this._grid.addEventListener('data-provider-changed', this.__boundOnDataProviderChanged);
      this._grid.addEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
      this._grid.addEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);
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
      checkbox.addEventListener('checked-changed', this.__onSelectAllCheckedChanged.bind(this));
      root.appendChild(checkbox);
    }

    const checked = this.__isChecked(this.selectAll, this.__indeterminate);
    checkbox.__rendererChecked = checked;
    checkbox.checked = checked;
    checkbox.hidden = this.__selectAllHidden;
    checkbox.indeterminate = this.__indeterminate;
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
      checkbox.addEventListener('checked-changed', this.__onSelectRowCheckedChanged.bind(this));
      root.appendChild(checkbox);
      addListener(root, 'track', this.__onCellTrack.bind(this));
      root.addEventListener('mousedown', this.__onCellMouseDown.bind(this));
      root.addEventListener('click', this.__onCellClick.bind(this));
    }

    checkbox.__item = item;
    checkbox.__rendererChecked = selected;
    checkbox.checked = selected;
  }

  /** @private */
  __onSelectAllChanged(selectAll) {
    if (selectAll === undefined || !this._grid) {
      return;
    }

    if (!this.__selectAllInitialized) {
      // The initial value for selectAll property was applied, avoid clearing pre-selected items
      this.__selectAllInitialized = true;
      return;
    }

    if (this._selectAllChangeLock) {
      return;
    }

    if (selectAll && this.__hasArrayDataProvider()) {
      this.__withFilteredItemsArray((items) => {
        this._grid.selectedItems = items;
      });
    } else {
      this._grid.selectedItems = [];
    }
  }

  /**
   * Return true if array `a` contains all the items in `b`
   * We need this when sorting or to preserve selection after filtering.
   * @private
   */
  __arrayContains(a, b) {
    return Array.isArray(a) && Array.isArray(b) && b.every((i) => a.includes(i));
  }

  /**
   * Enables or disables the Select All mode once the Select All checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectAllCheckedChanged(e) {
    // Skip if the state is changed by the renderer.
    if (e.target.checked === e.target.__rendererChecked) {
      return;
    }

    this.selectAll = this.__indeterminate || e.target.checked;
  }

  /**
   * Selects or deselects the row once the Select Row checkbox is switched.
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
      this._grid.selectItem(e.target.__item);
    } else {
      this._grid.deselectItem(e.target.__item);
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
      const visibleRows = this._grid._getVisibleRows();
      // Get the row where the drag started
      const dragStartRow = visibleRows.find((row) => row.contains(event.currentTarget.assignedSlot));
      // Whether to select or deselect the items on drag
      this.__dragSelect = !this._grid._isSelected(dragStartRow._item);
      // Store the index of the row where the drag started
      this.__dragStartIndex = dragStartRow.index;
      // Store the item of the row where the drag started
      this.__dragStartItem = dragStartRow._item;
      // Start the auto scroller
      this.__dragAutoScroller();
    } else if (event.detail.state === 'end') {
      // If drag start and end stays within the same item, then toggle its state
      if (this.__dragStartItem) {
        if (this.__dragSelect) {
          this._grid.selectItem(this.__dragStartItem);
        } else {
          this._grid.deselectItem(this.__dragStartItem);
        }
      }
      // Clear drag state after timeout, which allows preventing the
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
    const visibleRows = this._grid._getVisibleRows();
    const hoveredRow = visibleRows.find((row) => {
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
      visibleRows.forEach((row) => {
        if (
          (hoveredIndex > this.__dragStartIndex && row.index >= this.__dragStartIndex && row.index <= hoveredIndex) ||
          (hoveredIndex < this.__dragStartIndex && row.index <= this.__dragStartIndex && row.index >= hoveredIndex)
        ) {
          if (this.__dragSelect) {
            this._grid.selectItem(row._item);
          } else {
            this._grid.deselectItem(row._item);
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
   * IOS needs indeterminate + checked at the same time
   * @private
   */
  __isChecked(selectAll, indeterminate) {
    return indeterminate || selectAll;
  }

  /** @private */
  __onActiveItemChanged(e) {
    const activeItem = e.detail.value;
    if (this.autoSelect) {
      const item = activeItem || this.__previousActiveItem;
      if (item) {
        this._grid._toggleItem(item);
      }
    }
    this.__previousActiveItem = activeItem;
  }

  /** @private */
  __hasArrayDataProvider() {
    return Array.isArray(this._grid.items) && !!this._grid.dataProvider;
  }

  /** @private */
  __onSelectedItemsChanged() {
    this._selectAllChangeLock = true;
    if (this.__hasArrayDataProvider()) {
      this.__withFilteredItemsArray((items) => {
        if (!this._grid.selectedItems.length) {
          this.selectAll = false;
          this.__indeterminate = false;
        } else if (this.__arrayContains(this._grid.selectedItems, items)) {
          this.selectAll = true;
          this.__indeterminate = false;
        } else {
          this.selectAll = false;
          this.__indeterminate = true;
        }
      });
    }
    this._selectAllChangeLock = false;
  }

  /** @private */
  __onDataProviderChanged() {
    this.__selectAllHidden = !Array.isArray(this._grid.items);
  }

  /**
   * Assuming the grid uses an items array data provider, fetches all the filtered items
   * from the data provider and invokes the callback with the resulting array.
   *
   * @private
   */
  __withFilteredItemsArray(callback) {
    const params = {
      page: 0,
      pageSize: Infinity,
      sortOrders: [],
      filters: this._grid._mapFilters(),
    };
    this._grid.dataProvider(params, (items) => callback(items));
  }
}

customElements.define(GridSelectionColumn.is, GridSelectionColumn);

export { GridSelectionColumn };
