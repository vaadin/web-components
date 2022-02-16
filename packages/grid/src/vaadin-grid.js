/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-grid-column.js';
import './vaadin-grid-styles.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { isAndroid, isFirefox, isIOS, isSafari, isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TabindexMixin } from '@vaadin/component-base/src/tabindex-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { A11yMixin } from './vaadin-grid-a11y-mixin.js';
import { ActiveItemMixin } from './vaadin-grid-active-item-mixin.js';
import { ArrayDataProviderMixin } from './vaadin-grid-array-data-provider-mixin.js';
import { ColumnReorderingMixin } from './vaadin-grid-column-reordering-mixin.js';
import { ColumnResizingMixin } from './vaadin-grid-column-resizing-mixin.js';
import { DataProviderMixin } from './vaadin-grid-data-provider-mixin.js';
import { DragAndDropMixin } from './vaadin-grid-drag-and-drop-mixin.js';
import { DynamicColumnsMixin } from './vaadin-grid-dynamic-columns-mixin.js';
import { EventContextMixin } from './vaadin-grid-event-context-mixin.js';
import { FilterMixin } from './vaadin-grid-filter-mixin.js';
import { KeyboardNavigationMixin } from './vaadin-grid-keyboard-navigation-mixin.js';
import { RowDetailsMixin } from './vaadin-grid-row-details-mixin.js';
import { ScrollMixin } from './vaadin-grid-scroll-mixin.js';
import { SelectionMixin } from './vaadin-grid-selection-mixin.js';
import { SortMixin } from './vaadin-grid-sort-mixin.js';
import { StylingMixin } from './vaadin-grid-styling-mixin.js';

/**
 * `<vaadin-grid>` is a free, high quality data grid / data table Web Component. The content of the
 * the grid can be populated by using renderer callback function.
 *
 * ### Quick Start
 *
 * Start with an assigning an array to the [`items`](#/elements/vaadin-grid#property-items) property to visualize your data.
 *
 * Use the [`<vaadin-grid-column>`](#/elements/vaadin-grid-column) element to configure the grid columns. Set `path` and `header`
 * shorthand properties for the columns to define what gets rendered in the cells of the column.
 *
 * #### Example:
 * ```html
 * <vaadin-grid>
 *   <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
 *   <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
 *   <vaadin-grid-column path="email"></vaadin-grid-column>
 * </vaadin-grid>
 * ```
 *
 * For custom content `vaadin-grid-column` element provides you with three types of `renderer` callback functions: `headerRenderer`,
 * `renderer` and `footerRenderer`.
 *
 * Each of those renderer functions provides `root`, `column`, `model` arguments when applicable.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `column`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * Renderers are called on initialization of new column cells and each time the
 * related row model is updated. DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * #### Example:
 * ```html
 * <vaadin-grid>
 *   <vaadin-grid-column></vaadin-grid-column>
 *   <vaadin-grid-column></vaadin-grid-column>
 *   <vaadin-grid-column></vaadin-grid-column>
 * </vaadin-grid>
 * ```
 * ```js
 * const grid = document.querySelector('vaadin-grid');
 * grid.items = [{'name': 'John', 'surname': 'Lennon', 'role': 'singer'},
 *               {'name': 'Ringo', 'surname': 'Starr', 'role': 'drums'}];
 *
 * const columns = grid.querySelectorAll('vaadin-grid-column');
 *
 * columns[0].headerRenderer = function(root) {
 *   root.textContent = 'Name';
 * };
 * columns[0].renderer = function(root, column, model) {
 *   root.textContent = model.item.name;
 * };
 *
 * columns[1].headerRenderer = function(root) {
 *   root.textContent = 'Surname';
 * };
 * columns[1].renderer = function(root, column, model) {
 *   root.textContent = model.item.surname;
 * };
 *
 * columns[2].headerRenderer = function(root) {
 *   root.textContent = 'Role';
 * };
 * columns[2].renderer = function(root, column, model) {
 *   root.textContent = model.item.role;
 * };
 * ```
 *
 * The following properties are available in the `model` argument:
 *
 * Property name | Type | Description
 * --------------|------|------------
 * `index`| Number | The index of the item.
 * `item` | String or Object | The item.
 * `level` | Number | Number of the item's tree sublevel, starts from 0.
 * `expanded` | Boolean | True if the item's tree sublevel is expanded.
 * `selected` | Boolean | True if the item is selected.
 * `detailsOpened` | Boolean | True if the item's row details are open.
 *
 * The following helper elements can be used for further customization:
 * - [`<vaadin-grid-column-group>`](#/elements/vaadin-grid-column-group)
 * - [`<vaadin-grid-filter>`](#/elements/vaadin-grid-filter)
 * - [`<vaadin-grid-sorter>`](#/elements/vaadin-grid-sorter)
 * - [`<vaadin-grid-selection-column>`](#/elements/vaadin-grid-selection-column)
 * - [`<vaadin-grid-tree-toggle>`](#/elements/vaadin-grid-tree-toggle)
 *
 * __Note that the helper elements must be explicitly imported.__
 * If you want to import everything at once you can use the `all-imports.html` bundle.
 *
 * ### Lazy Loading with Function Data Provider
 *
 * In addition to assigning an array to the items property, you can alternatively
 * provide the `<vaadin-grid>` data through the
 * [`dataProvider`](#/elements/vaadin-grid#property-dataProvider) function property.
 * The `<vaadin-grid>` calls this function lazily, only when it needs more data
 * to be displayed.
 *
 * See the [`dataProvider`](#/elements/vaadin-grid#property-dataProvider) in
 * the API reference below for the detailed data provider arguments description,
 * and the “Assigning Data” page in the demos.
 *
 * __Note that expanding the tree grid's item will trigger a call to the `dataProvider`.__
 *
 * __Also, note that when using function data providers, the total number of items
 * needs to be set manually. The total number of items can be returned
 * in the second argument of the data provider callback:__
 *
 * ```javascript
 * grid.dataProvider = ({page, pageSize}, callback) => {
 *   // page: the requested page index
 *   // pageSize: number of items on one page
 *   const url = `https://api.example/data?page=${page}&per_page=${pageSize}`;
 *
 *   fetch(url)
 *     .then((res) => res.json())
 *     .then(({ employees, totalSize }) => {
 *       callback(employees, totalSize);
 *     });
 * };
 * ```
 *
 * __Alternatively, you can use the `size` property to set the total number of items:__
 *
 * ```javascript
 * grid.size = 200; // The total number of items
 * grid.dataProvider = ({page, pageSize}, callback) => {
 *   const url = `https://api.example/data?page=${page}&per_page=${pageSize}`;
 *
 *   fetch(url)
 *     .then((res) => res.json())
 *     .then((resJson) => callback(resJson.employees));
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `row` | Row in the internal table
 * `cell` | Cell in the internal table
 * `header-cell` | Header cell in the internal table
 * `body-cell` | Body cell in the internal table
 * `footer-cell` | Footer cell in the internal table
 * `details-cell` | Row details cell in the internal table
 * `resize-handle` | Handle for resizing the columns
 * `reorder-ghost` | Ghost element of the header cell being dragged
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `loading` | Set when the grid is loading data from data provider | :host
 * `interacting` | Keyboard navigation in interaction mode | :host
 * `navigating` | Keyboard navigation in navigation mode | :host
 * `overflow` | Set when rows are overflowing the grid viewport. Possible values: `top`, `bottom`, `left`, `right` | :host
 * `reordering` | Set when the grid's columns are being reordered | :host
 * `dragover` | Set when the grid (not a specific row) is dragged over | :host
 * `dragging-rows` : Set when grid rows are dragged  | :host
 * `reorder-status` | Reflects the status of a cell while columns are being reordered | cell
 * `frozen` | Frozen cell | cell
 * `last-frozen` | Last frozen cell | cell
 * `first-column` | First visible cell on a row | cell
 * `last-column` | Last visible cell on a row | cell
 * `selected` | Selected row | row
 * `expanded` | Expanded row | row
 * `details-opened` | Row with details open | row
 * `loading` | Row that is waiting for data from data provider | row
 * `odd` | Odd row | row
 * `first` | The first body row | row
 * `last` | The last body row | row
 * `dragstart` | Set for one frame when drag of a row is starting. The value is a number when multiple rows are dragged | row
 * `dragover` | Set when the row is dragged over | row
 * `drag-disabled` | Set to a row that isn't available for dragging | row
 * `drop-disabled` | Set to a row that can't be dropped on top of | row
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} active-item-changed - Fired when the `activeItem` property changes.
 * @fires {CustomEvent} cell-activate - Fired when the cell is activated with click or keyboard.
 * @fires {CustomEvent} cell-focus - Fired when a cell is focused with click or keyboard navigation.
 * @fires {CustomEvent} column-reorder - Fired when the columns in the grid are reordered.
 * @fires {CustomEvent} column-resize - Fired when the grid column resize is finished.
 * @fires {CustomEvent} expanded-items-changed - Fired when the `expandedItems` property changes.
 * @fires {CustomEvent} grid-dragstart - Fired when starting to drag grid rows.
 * @fires {CustomEvent} grid-dragend - Fired when the dragging of the rows ends.
 * @fires {CustomEvent} grid-drop - Fired when a drop occurs on top of the grid.
 * @fires {CustomEvent} loading-changed - Fired when the `loading` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes A11yMixin
 * @mixes ActiveItemMixin
 * @mixes ArrayDataProviderMixin
 * @mixes ColumnResizingMixin
 * @mixes DataProviderMixin
 * @mixes DynamicColumnsMixin
 * @mixes FilterMixin
 * @mixes RowDetailsMixin
 * @mixes ScrollMixin
 * @mixes SelectionMixin
 * @mixes SortMixin
 * @mixes KeyboardNavigationMixin
 * @mixes ColumnReorderingMixin
 * @mixes EventContextMixin
 * @mixes StylingMixin
 * @mixes DragAndDropMixin
 */
class Grid extends ElementMixin(
  ThemableMixin(
    DataProviderMixin(
      ArrayDataProviderMixin(
        DynamicColumnsMixin(
          ActiveItemMixin(
            ScrollMixin(
              SelectionMixin(
                SortMixin(
                  RowDetailsMixin(
                    KeyboardNavigationMixin(
                      A11yMixin(
                        FilterMixin(
                          ColumnReorderingMixin(
                            ColumnResizingMixin(
                              EventContextMixin(DragAndDropMixin(StylingMixin(TabindexMixin(PolymerElement))))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
) {
  static get template() {
    return html`
      <div
        id="scroller"
        safari$="[[_safari]]"
        ios$="[[_ios]]"
        loading$="[[loading]]"
        column-reordering-allowed$="[[columnReorderingAllowed]]"
      >
        <table id="table" role="treegrid" aria-multiselectable="true" tabindex="0">
          <caption id="sizer" part="row"></caption>
          <thead id="header" role="rowgroup"></thead>
          <tbody id="items" role="rowgroup"></tbody>
          <tfoot id="footer" role="rowgroup"></tfoot>
        </table>

        <div part="reorder-ghost"></div>
      </div>

      <div id="focusexit" tabindex="0"></div>
    `;
  }

  static get is() {
    return 'vaadin-grid';
  }

  static get observers() {
    return [
      '_columnTreeChanged(_columnTree, _columnTree.*)',
      '_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)'
    ];
  }

  static get properties() {
    return {
      /** @private */
      _safari: {
        type: Boolean,
        value: isSafari
      },

      /** @private */
      _ios: {
        type: Boolean,
        value: isIOS
      },

      /** @private */
      _firefox: {
        type: Boolean,
        value: isFirefox
      },

      /** @private */
      _android: {
        type: Boolean,
        value: isAndroid
      },

      /** @private */
      _touchDevice: {
        type: Boolean,
        value: isTouch
      },

      /** @protected */
      tabindex: {
        value: undefined
      },

      /**
       * If true, the grid's height is defined by its rows.
       *
       * Effectively, this disables the grid's virtual scrolling so that all the rows are rendered in the DOM at once.
       * If the grid has a large number of items, using the feature is discouraged to avoid performance issues.
       * @attr {boolean} all-rows-visible
       * @type {boolean}
       */
      allRowsVisible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /** @private */
      _recalculateColumnWidthOnceLoadingFinished: {
        type: Boolean,
        value: true
      },

      /** @private */
      isAttached: {
        value: false
      },

      /**
       * An internal property that is mainly used by `vaadin-template-renderer`
       * to identify grid elements.
       *
       * @private
       */
      __gridElement: {
        type: Boolean,
        value: true
      }
    };
  }

  constructor() {
    super();
    this.addEventListener('animationend', this._onAnimationEnd);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.isAttached = true;
    this.recalculateColumnWidths();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.isAttached = false;
  }

  /** @private */
  __getFirstVisibleItem() {
    return this._getVisibleRows().find((row) => this._isInViewport(row));
  }

  /** @private */
  get _firstVisibleIndex() {
    const firstVisibleItem = this.__getFirstVisibleItem();
    return firstVisibleItem ? firstVisibleItem.index : undefined;
  }

  /** @private */
  __getLastVisibleItem() {
    return this._getVisibleRows()
      .reverse()
      .find((row) => this._isInViewport(row));
  }

  /** @private */
  get _lastVisibleIndex() {
    const lastVisibleItem = this.__getLastVisibleItem();
    return lastVisibleItem ? lastVisibleItem.index : undefined;
  }

  /** @private */
  _isInViewport(item) {
    const scrollTargetRect = this.$.table.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const headerHeight = this.$.header.getBoundingClientRect().height;
    const footerHeight = this.$.footer.getBoundingClientRect().height;
    return (
      itemRect.bottom > scrollTargetRect.top + headerHeight && itemRect.top < scrollTargetRect.bottom - footerHeight
    );
  }

  /** @private */
  _getVisibleRows() {
    return Array.from(this.$.items.children)
      .filter((item) => !item.hidden)
      .sort((a, b) => a.index - b.index);
  }

  /** @protected */
  ready() {
    super.ready();

    this.__virtualizer = new Virtualizer({
      createElements: this._createScrollerRows.bind(this),
      updateElement: this._updateScrollerItem.bind(this),
      scrollContainer: this.$.items,
      scrollTarget: this.$.table,
      reorderElements: true
    });

    new ResizeObserver(() => setTimeout(() => this.__updateFooterPositioning())).observe(this.$.footer);

    processTemplates(this);
  }

  /**
   * @param {string} name
   * @param {?string} oldValue
   * @param {?string} newValue
   * @protected
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'dir') {
      this.__isRTL = newValue === 'rtl';
    }
  }

  /**
   * Override an observer from `DisabledMixin` to not
   * set `tabindex` on the grid when it is re-enabled.
   *
   * @param {boolean} disabled
   * @param {boolean} oldDisabled
   * @protected
   * @override
   */
  _disabledChanged(disabled, oldDisabled) {
    super._disabledChanged(disabled, oldDisabled);

    if (oldDisabled) {
      this.removeAttribute('tabindex');
    }
  }

  /** @private */
  __getBodyCellCoordinates(cell) {
    if (this.$.items.contains(cell) && cell.localName === 'td') {
      return {
        item: cell.parentElement._item,
        column: cell._column
      };
    }
  }

  /** @private */
  __focusBodyCell({ item, column }) {
    const row = this._getVisibleRows().find((row) => row._item === item);
    const cell = row && [...row.children].find((cell) => cell._column === column);
    cell && cell.focus();
  }

  /** @private */
  _effectiveSizeChanged(effectiveSize, virtualizer, hasData, columnTree) {
    if (virtualizer && hasData && columnTree) {
      // Changing the virtualizer size may result in the row with focus getting hidden
      const cell = this.shadowRoot.activeElement;
      const cellCoordinates = this.__getBodyCellCoordinates(cell);

      virtualizer.size = effectiveSize;
      virtualizer.update();
      virtualizer.flush();

      // If the focused cell's parent row got hidden by the size change, focus the corresponding new cell
      cellCoordinates && cell.parentElement.hidden && this.__focusBodyCell(cellCoordinates);

      // Make sure the body has a tabbable element
      this._resetKeyboardNavigation();
    }
  }

  /** @private */
  __hasRowsWithClientHeight() {
    return !!Array.from(this.$.items.children).filter((row) => row.clientHeight).length;
  }

  /** @protected */
  __itemsReceived() {
    if (
      this._recalculateColumnWidthOnceLoadingFinished &&
      !this._cache.isLoading() &&
      this.__hasRowsWithClientHeight()
    ) {
      this._recalculateColumnWidthOnceLoadingFinished = false;
      this.recalculateColumnWidths();
    }
  }

  /** @private */
  __getIntrinsicWidth(col) {
    const initialWidth = col.width;
    const initialFlexGrow = col.flexGrow;

    col.width = 'auto';
    col.flexGrow = 0;

    // Note: _allCells only contains cells which are currently rendered in DOM
    const width = col._allCells
      .filter((cell) => {
        // Exclude body cells that are out of the visible viewport
        return !this.$.items.contains(cell) || this._isInViewport(cell.parentElement);
      })
      .reduce((width, cell) => {
        // Add 1px buffer to the offset width to avoid too narrow columns (sub-pixel rendering)
        return Math.max(width, cell.offsetWidth + 1);
      }, 0);

    col.flexGrow = initialFlexGrow;
    col.width = initialWidth;

    return width;
  }

  /** @private */
  __getDistributedWidth(col, innerColumn) {
    if (col == null || col === this) {
      return 0;
    }

    const columnWidth = Math.max(this.__getIntrinsicWidth(col), this.__getDistributedWidth(col.parentElement, col));

    // we're processing a regular grid-column and not a grid-column-group
    if (!innerColumn) {
      return columnWidth;
    }

    // At the end, the width of each vaadin-grid-column-group is determined by the sum of the width of its children.
    // Here we determine how much space the vaadin-grid-column-group actually needs to render properly and then we distribute that space
    // to its children, so when we actually do the summation it will be rendered properly.
    // Check out vaadin-grid-column-group:_updateFlexAndWidth
    const columnGroup = col;
    const columnGroupWidth = columnWidth;
    const sumOfWidthOfAllChildColumns = columnGroup._visibleChildColumns
      .map((col) => this.__getIntrinsicWidth(col))
      .reduce((sum, curr) => sum + curr, 0);

    const extraNecessarySpaceForGridColumnGroup = Math.max(0, columnGroupWidth - sumOfWidthOfAllChildColumns);

    // The distribution of the extra necessary space is done according to the intrinsic width of each child column.
    // Lets say we need 100 pixels of extra space for the grid-column-group to render properly
    // it has two grid-column children, |100px|300px| in total 400px
    // the first column gets 25px of the additional space (100/400)*100 = 25
    // the second column gets the 75px of the additional space (300/400)*100 = 75
    const proportionOfExtraSpace = this.__getIntrinsicWidth(innerColumn) / sumOfWidthOfAllChildColumns;
    const shareOfInnerColumnFromNecessaryExtraSpace = proportionOfExtraSpace * extraNecessarySpaceForGridColumnGroup;

    return this.__getIntrinsicWidth(innerColumn) + shareOfInnerColumnFromNecessaryExtraSpace;
  }

  /**
   * @param {!Array<!GridColumn>} cols the columns to auto size based on their content width
   * @private
   */
  _recalculateColumnWidths(cols) {
    // Flush to make sure DOM is up-to-date when measuring the column widths
    this.__virtualizer.flush();

    cols.forEach((col) => {
      col.width = `${this.__getDistributedWidth(col)}px`;
    });
  }

  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths() {
    if (!this._columnTree) {
      return; // No columns
    }
    if (this._cache.isLoading()) {
      this._recalculateColumnWidthOnceLoadingFinished = true;
    } else {
      const cols = this._getColumns().filter((col) => !col.hidden && col.autoWidth);
      this._recalculateColumnWidths(cols);
    }
  }

  /** @private */
  _createScrollerRows(count) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const row = document.createElement('tr');
      row.setAttribute('part', 'row');
      row.setAttribute('role', 'row');
      row.setAttribute('tabindex', '-1');
      if (this._columnTree) {
        this._updateRow(row, this._columnTree[this._columnTree.length - 1], 'body', false, true);
      }
      rows.push(row);
    }

    if (this._columnTree) {
      this._columnTree[this._columnTree.length - 1].forEach(
        (c) => c.isConnected && c.notifyPath && c.notifyPath('_cells.*', c._cells)
      );
    }

    beforeNextRender(this, () => {
      this._updateFirstAndLastColumn();
      this._resetKeyboardNavigation();
      this._afterScroll();
      this.__itemsReceived();
    });
    return rows;
  }

  /** @private */
  _createCell(tagName) {
    const contentId = (this._contentIndex = this._contentIndex + 1 || 0);
    const slotName = 'vaadin-grid-cell-content-' + contentId;

    const cellContent = document.createElement('vaadin-grid-cell-content');
    cellContent.setAttribute('slot', slotName);

    const cell = document.createElement(tagName);
    cell.id = slotName.replace('-content-', '-');
    cell.setAttribute('tabindex', '-1');
    cell.setAttribute('role', tagName === 'td' ? 'gridcell' : 'columnheader');

    const slot = document.createElement('slot');
    slot.setAttribute('name', slotName);

    cell.appendChild(slot);

    cell._content = cellContent;

    // With native Shadow DOM, mousedown on slotted element does not focus
    // focusable slot wrapper, that is why cells are not focused with
    // mousedown. Workaround: listen for mousedown and focus manually.
    cellContent.addEventListener('mousedown', () => {
      if (window.chrome) {
        // Chrome bug: focusing before mouseup prevents text selection, see http://crbug.com/771903
        const mouseUpListener = () => {
          if (!cellContent.contains(this.getRootNode().activeElement)) {
            cell.focus();
          }
          // If focus is in the cell content — respect it, do not change.
          document.removeEventListener('mouseup', mouseUpListener, true);
        };
        document.addEventListener('mouseup', mouseUpListener, true);
      } else {
        // Focus on mouseup, on the other hand, removes selection on Safari.
        // Watch out sync focus removal issue, only async focus works here.
        setTimeout(() => {
          if (!cellContent.contains(this.getRootNode().activeElement)) {
            cell.focus();
          }
        });
      }
    });

    return cell;
  }

  /**
   * @param {!HTMLTableRowElement} row
   * @param {!Array<!GridColumn>} columns
   * @param {?string} section
   * @param {boolean} isColumnRow
   * @param {boolean} noNotify
   * @protected
   */
  // eslint-disable-next-line max-params
  _updateRow(row, columns, section, isColumnRow, noNotify) {
    section = section || 'body';

    const contentsFragment = document.createDocumentFragment();

    Array.from(row.children).forEach((cell) => (cell._vacant = true));
    row.innerHTML = '';

    columns
      .filter((column) => !column.hidden)
      .forEach((column, index, cols) => {
        let cell;

        if (section === 'body') {
          // Body
          column._cells = column._cells || [];
          cell = column._cells.filter((cell) => cell._vacant)[0];
          if (!cell) {
            cell = this._createCell('td');
            column._cells.push(cell);
          }
          cell.setAttribute('part', 'cell body-cell');
          row.appendChild(cell);

          if (index === cols.length - 1 && this.rowDetailsRenderer) {
            // Add details cell as last cell to body rows
            this._detailsCells = this._detailsCells || [];
            const detailsCell = this._detailsCells.filter((cell) => cell._vacant)[0] || this._createCell('td');
            if (this._detailsCells.indexOf(detailsCell) === -1) {
              this._detailsCells.push(detailsCell);
            }
            if (!detailsCell._content.parentElement) {
              contentsFragment.appendChild(detailsCell._content);
            }
            this._configureDetailsCell(detailsCell);
            row.appendChild(detailsCell);
            this._a11ySetRowDetailsCell(row, detailsCell);
            detailsCell._vacant = false;
          }

          if (column.notifyPath && !noNotify) {
            column.notifyPath('_cells.*', column._cells);
          }
        } else {
          // Header & footer
          const tagName = section === 'header' ? 'th' : 'td';
          if (isColumnRow || column.localName === 'vaadin-grid-column-group') {
            cell = column[`_${section}Cell`] || this._createCell(tagName);
            cell._column = column;
            row.appendChild(cell);
            column[`_${section}Cell`] = cell;
          } else {
            column._emptyCells = column._emptyCells || [];
            cell = column._emptyCells.filter((cell) => cell._vacant)[0] || this._createCell(tagName);
            cell._column = column;
            row.appendChild(cell);
            if (column._emptyCells.indexOf(cell) === -1) {
              column._emptyCells.push(cell);
            }
          }
          cell.setAttribute('part', `cell ${section}-cell`);
          this.__updateHeaderFooterRowVisibility(row);
        }

        if (!cell._content.parentElement) {
          contentsFragment.appendChild(cell._content);
        }
        cell._vacant = false;
        cell._column = column;
      });

    // Might be empty if only cache was used
    this.appendChild(contentsFragment);

    this._frozenCellsChanged();
    this._updateFirstAndLastColumnForRow(row);
  }

  /**
   * @param {HTMLTableRowElement} row
   * @protected
   */
  __updateHeaderFooterRowVisibility(row) {
    if (!row) {
      return;
    }

    const visibleRowCells = Array.from(row.children).filter((cell) => {
      const column = cell._column;
      if (column._emptyCells && column._emptyCells.indexOf(cell) > -1) {
        // The cell is an "empty cell"  -> doesn't block hiding the row
        return false;
      }
      if (row.parentElement === this.$.header) {
        if (column.headerRenderer) {
          // The cell is the header cell of a column that has a header renderer
          // -> row should be visible
          return true;
        }
        if (column.header === null) {
          // The column header is explicilty set to null -> doesn't block hiding the row
          return false;
        }
        if (column.path || column.header !== undefined) {
          // The column has an explicit non-null header or a path that generates a header
          // -> row should be visible
          return true;
        }
      } else if (column.footerRenderer) {
        // The cell is the footer cell of a column that has a footer renderer
        // -> row should be visible
        return true;
      }
      return false;
    });

    if (row.hidden !== !visibleRowCells.length) {
      row.hidden = !visibleRowCells.length;
    }

    // Make sure the section has a tabbable element
    this._resetKeyboardNavigation();
  }

  /** @private */
  _updateScrollerItem(row, index) {
    this._preventScrollerRotatingCellFocus(row, index);

    if (!this._columnTree) {
      return;
    }

    row.toggleAttribute('first', index === 0);
    row.toggleAttribute('last', index === this._effectiveSize - 1);
    row.toggleAttribute('odd', index % 2);
    this._a11yUpdateRowRowindex(row, index);
    this._getItem(index, row);
  }

  /** @private */
  _columnTreeChanged(columnTree) {
    this._renderColumnTree(columnTree);
    this.recalculateColumnWidths();
  }

  /**
   * @param {!Array<!GridColumn>} columnTree
   * @protected
   */
  _renderColumnTree(columnTree) {
    Array.from(this.$.items.children).forEach((row) =>
      this._updateRow(row, columnTree[columnTree.length - 1], null, false, true)
    );

    while (this.$.header.children.length < columnTree.length) {
      const headerRow = document.createElement('tr');
      headerRow.setAttribute('part', 'row');
      headerRow.setAttribute('role', 'row');
      headerRow.setAttribute('tabindex', '-1');
      this.$.header.appendChild(headerRow);

      const footerRow = document.createElement('tr');
      footerRow.setAttribute('part', 'row');
      footerRow.setAttribute('role', 'row');
      footerRow.setAttribute('tabindex', '-1');
      this.$.footer.appendChild(footerRow);
    }
    while (this.$.header.children.length > columnTree.length) {
      this.$.header.removeChild(this.$.header.firstElementChild);
      this.$.footer.removeChild(this.$.footer.firstElementChild);
    }

    Array.from(this.$.header.children).forEach((headerRow, index) =>
      this._updateRow(headerRow, columnTree[index], 'header', index === columnTree.length - 1)
    );

    Array.from(this.$.footer.children).forEach((footerRow, index) =>
      this._updateRow(footerRow, columnTree[columnTree.length - 1 - index], 'footer', index === 0)
    );

    // Sizer rows
    this._updateRow(this.$.sizer, columnTree[columnTree.length - 1]);

    this._resizeHandler();
    this._frozenCellsChanged();
    this._updateFirstAndLastColumn();
    this._resetKeyboardNavigation();
    this._a11yUpdateHeaderRows();
    this._a11yUpdateFooterRows();
    this.__updateFooterPositioning();
    this.generateCellClassNames();
  }

  __updateFooterPositioning() {
    if (this._firefox) {
      // Sticky (or translated) footer in a flexbox host doesn't get included in
      // the scroll height calculation on FF. This is a workaround for the issue.
      this.$.items.style.paddingBottom = 0;
      if (!this.allRowsVisible) {
        this.$.items.style.paddingBottom = `${this.$.footer.offsetHeight}px`;
      }
    }
  }

  /**
   * @param {!HTMLElement} row
   * @param {GridItem} item
   * @protected
   */
  _updateItem(row, item) {
    row._item = item;
    const model = this.__getRowModel(row);

    this._toggleDetailsCell(row, model.detailsOpened);

    this._a11yUpdateRowLevel(row, model.level);
    this._a11yUpdateRowSelected(row, model.selected);

    row.toggleAttribute('expanded', model.expanded);
    row.toggleAttribute('selected', model.selected);
    row.toggleAttribute('details-opened', model.detailsOpened);

    this._generateCellClassNames(row, model);
    this._filterDragAndDrop(row, model);

    Array.from(row.children).forEach((cell) => {
      if (cell._renderer) {
        const owner = cell._column || this;
        cell._renderer.call(owner, cell._content, owner, model);
      }
    });

    this._updateDetailsCellHeight(row);

    this._a11yUpdateRowExpanded(row, model.expanded);
  }

  /** @private */
  _resizeHandler() {
    this._updateDetailsCellHeights();
    this.__updateFooterPositioning();
  }

  /** @private */
  _onAnimationEnd(e) {
    // ShadyCSS applies scoping suffixes to animation names
    if (e.animationName.indexOf('vaadin-grid-appear') === 0) {
      e.stopPropagation();
      this.__itemsReceived();

      requestAnimationFrame(() => {
        this.__scrollToPendingIndex();
        // This needs to be set programmatically in order to avoid an iOS 10 bug (disappearing grid)
        this.$.table.style.webkitOverflowScrolling = 'touch';
      });
    }
  }

  /**
   * @param {!HTMLTableRowElement} row
   * @return {!GridItemModel}
   * @protected
   */
  __getRowModel(row) {
    return {
      index: row.index,
      item: row._item,
      level: this._getIndexLevel(row.index),
      expanded: this._isExpanded(row._item),
      selected: this._isSelected(row._item),
      detailsOpened: !!this.rowDetailsRenderer && this._isDetailsOpened(row._item)
    };
  }

  /**
   * Requests an update for the content of cells.
   *
   * While performing the update, the following renderers are invoked:
   * - `Grid.rowDetailsRenderer`
   * - `GridColumn.renderer`
   * - `GridColumn.headerRenderer`
   * - `GridColumn.footerRenderer`
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this._columnTree) {
      // header and footer renderers
      this._columnTree.forEach((level) => {
        level.forEach((column) => {
          column._renderHeaderAndFooter();
        });
      });

      // body and row details renderers
      this.__updateVisibleRows();
    }
  }

  /** @protected */
  __updateVisibleRows(start, end) {
    this.__virtualizer && this.__virtualizer.update(start, end);
  }

  /**
   * Updates the computed metrics and positioning of internal grid parts
   * (row/details cell positioning etc). Needs to be invoked whenever the sizing of grid
   * content changes asynchronously to ensure consistent appearance (e.g. when a
   * contained image whose bounds aren't known beforehand finishes loading).
   *
   * @deprecated Since Vaadin 22, `notifyResize()` is deprecated. The component uses a
   * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
   */
  notifyResize() {
    console.warn(
      `WARNING: Since Vaadin 22, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.`
    );
  }
}

customElements.define(Grid.is, Grid);

export { Grid };
