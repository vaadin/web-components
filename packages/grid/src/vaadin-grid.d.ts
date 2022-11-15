/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { ActiveItemMixinClass } from './vaadin-grid-active-item-mixin.js';
import type { ArrayDataProviderMixinClass } from './vaadin-grid-array-data-provider-mixin.js';
import type { GridColumn } from './vaadin-grid-column.js';
import { GridBodyRenderer, GridHeaderFooterRenderer } from './vaadin-grid-column.js';
import type { ColumnReorderingMixinClass } from './vaadin-grid-column-reordering-mixin.js';
import type { DataProviderMixinClass } from './vaadin-grid-data-provider-mixin.js';
import {
  GridDataProvider,
  GridDataProviderCallback,
  GridDataProviderParams,
  GridFilterDefinition,
  GridSorterDefinition,
  GridSorterDirection,
} from './vaadin-grid-data-provider-mixin.js';
import type { DragAndDropMixinClass } from './vaadin-grid-drag-and-drop-mixin.js';
import { GridDragAndDropFilter, GridDropLocation, GridDropMode } from './vaadin-grid-drag-and-drop-mixin.js';
import type { EventContextMixinClass } from './vaadin-grid-event-context-mixin.js';
import { GridEventContext } from './vaadin-grid-event-context-mixin.js';
import type { RowDetailsMixinClass } from './vaadin-grid-row-details-mixin.js';
import { GridRowDetailsRenderer } from './vaadin-grid-row-details-mixin.js';
import type { ScrollMixinClass } from './vaadin-grid-scroll-mixin.js';
import type { SelectionMixinClass } from './vaadin-grid-selection-mixin.js';
import type { SortMixinClass } from './vaadin-grid-sort-mixin.js';
import type { StylingMixinClass } from './vaadin-grid-styling-mixin.js';
import { GridCellClassNameGenerator } from './vaadin-grid-styling-mixin.js';

export {
  GridBodyRenderer,
  GridCellClassNameGenerator,
  GridDataProvider,
  GridDataProviderCallback,
  GridDataProviderParams,
  GridDragAndDropFilter,
  GridDropLocation,
  GridDropMode,
  GridEventContext,
  GridFilterDefinition,
  GridHeaderFooterRenderer,
  GridRowDetailsRenderer,
  GridSorterDefinition,
  GridSorterDirection,
};

export type GridDefaultItem = any;

export interface GridItemModel<TItem> {
  index: number;
  item: TItem;
  selected?: boolean;
  expanded?: boolean;
  level?: number;
  detailsOpened?: boolean;
}

/**
 * Fired when the `activeItem` property changes.
 */
export type GridActiveItemChangedEvent<TItem> = CustomEvent<{ value: TItem }>;

/**
 * Fired when the cell is activated with click or keyboard.
 */
export type GridCellActivateEvent<TItem> = CustomEvent<{ model: GridItemModel<TItem> }>;

/**
 * Fired when a cell is focused with click or keyboard navigation.
 */
export type GridCellFocusEvent<TItem> = CustomEvent<{ context: GridEventContext<TItem> }>;

/**
 * Fired when the columns in the grid are reordered.
 */
export type GridColumnReorderEvent<TItem> = CustomEvent<{ columns: Array<GridColumn<TItem>> }>;

/**
 * Fired when the grid column resize is finished.
 */
export type GridColumnResizeEvent<TItem> = CustomEvent<{ resizedColumn: GridColumn<TItem> }>;

/**
 * Fired when the `expandedItems` property changes.
 */
export type GridExpandedItemsChangedEvent<TItem> = CustomEvent<{ value: TItem[] }>;

/**
 * Fired when starting to drag grid rows.
 */
export type GridDragStartEvent<TItem> = CustomEvent<{
  draggedItems: TItem[];
  setDraggedItemsCount(count: number): void;
  setDragData(type: string, data: string): void;
}>;

/**
 * Fired when a drop occurs on top of the grid.
 */
export type GridDropEvent<TItem> = CustomEvent<{
  dropTargetItem: TItem;
  dropLocation: GridDropLocation;
  dragData: Array<{ type: string; data: string }>;
}>;

/**
 * Fired when the `loading` property changes.
 */
export type GridLoadingChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `selectedItems` property changes.
 */
export type GridSelectedItemsChangedEvent<TItem> = CustomEvent<{ value: TItem[] }>;

export interface GridCustomEventMap<TItem> {
  'active-item-changed': GridActiveItemChangedEvent<TItem>;

  'cell-activate': GridCellActivateEvent<TItem>;

  'cell-focus': GridCellFocusEvent<TItem>;

  'column-reorder': GridColumnReorderEvent<TItem>;

  'column-resize': GridColumnResizeEvent<TItem>;

  'expanded-items-changed': GridExpandedItemsChangedEvent<TItem>;

  'grid-dragstart': GridDragStartEvent<TItem>;

  'grid-dragend': Event;

  'grid-drop': GridDropEvent<TItem>;

  'loading-changed': GridLoadingChangedEvent;

  'selected-items-changed': GridSelectedItemsChangedEvent<TItem>;
}

export interface GridEventMap<TItem> extends HTMLElementEventMap, GridCustomEventMap<TItem> {}

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
 * Attribute              | Description                                                                                       | Part name
 * -----------------------|---------------------------------------------------------------------------------------------------|-----------
 * `loading`              | Set when the grid is loading data from data provider                                              | :host
 * `interacting`          | Keyboard navigation in interaction mode                                                           | :host
 * `navigating`           | Keyboard navigation in navigation mode                                                            | :host
 * `overflow`             | Set when rows are overflowing the grid viewport. Possible values: `top`, `bottom`, `start`, `end` | :host
 * `reordering`           | Set when the grid's columns are being reordered                                                   | :host
 * `dragover`             | Set when the grid (not a specific row) is dragged over                                            | :host
 * `dragging-rows`        | Set when grid rows are dragged                                                                    | :host
 * `reorder-status`       | Reflects the status of a cell while columns are being reordered                                   | cell
 * `frozen`               | Frozen cell                                                                                       | cell
 * `frozen-to-end`        | Cell frozen to end                                                                                | cell
 * `last-frozen`          | Last frozen cell                                                                                  | cell
 * `first-frozen-to-end`  | First cell frozen to end                                                                          | cell
 * `first-column`         | First visible cell on a row                                                                       | cell
 * `last-column`          | Last visible cell on a row                                                                        | cell
 * `selected`             | Selected row                                                                                      | row
 * `expanded`             | Expanded row                                                                                      | row
 * `details-opened`       | Row with details open                                                                             | row
 * `loading`              | Row that is waiting for data from data provider                                                   | row
 * `odd`                  | Odd row                                                                                           | row
 * `first`                | The first body row                                                                                | row
 * `last`                 | The last body row                                                                                 | row
 * `dragstart`            | Set for one frame when starting to drag a row. The value is a number when dragging multiple rows  | row
 * `dragover`             | Set when the row is dragged over                                                                  | row
 * `drag-disabled`        | Set to a row that isn't available for dragging                                                    | row
 * `drop-disabled`        | Set to a row that can't be dropped on top of                                                      | row
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
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
 */
declare class Grid<TItem = GridDefaultItem> extends HTMLElement {
  /**
   * If true, the grid's height is defined by its rows.
   *
   * Effectively, this disables the grid's virtual scrolling so that all the rows are rendered in the DOM at once.
   * If the grid has a large number of items, using the feature is discouraged to avoid performance issues.
   * @attr {boolean} all-rows-visible
   */
  allRowsVisible: boolean;

  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths(): void;

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
  requestContentUpdate(): void;

  /**
   * Updates the computed metrics and positioning of internal grid parts
   * (row/details cell positioning etc). Needs to be invoked whenever the sizing of grid
   * content changes asynchronously to ensure consistent appearance (e.g. when a
   * contained image whose bounds aren't known beforehand finishes loading).
   *
   * @deprecated Since Vaadin 22, `notifyResize()` is deprecated. The component uses a
   * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
   */
  notifyResize(): void;

  addEventListener<K extends keyof GridEventMap<TItem>>(
    type: K,
    listener: (this: Grid<TItem>, ev: GridEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof GridEventMap<TItem>>(
    type: K,
    listener: (this: Grid<TItem>, ev: GridEventMap<TItem>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

interface Grid<TItem = GridDefaultItem>
  extends DisabledMixinClass,
    ElementMixinClass,
    ThemableMixinClass,
    ThemePropertyMixinClass,
    ActiveItemMixinClass<TItem>,
    ArrayDataProviderMixinClass<TItem>,
    DataProviderMixinClass<TItem>,
    RowDetailsMixinClass<TItem>,
    ScrollMixinClass,
    SelectionMixinClass<TItem>,
    SortMixinClass,
    ColumnReorderingMixinClass,
    EventContextMixinClass<TItem>,
    StylingMixinClass<TItem>,
    DragAndDropMixinClass<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid': Grid<GridDefaultItem>;
  }
}

export { Grid };
