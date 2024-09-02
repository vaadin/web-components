/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { GridEventMap, GridMixinClass } from './vaadin-grid-mixin.js';

export * from './vaadin-grid-mixin.js';

export type GridDefaultItem = any;

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
 * See the [`dataProvider`](#/elements/vaadin-grid#property-dataProvider) property
 * documentation for the detailed data provider arguments description.
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
 * Part name                  | Description
 * ---------------------------|----------------
 * `row`                      | Row in the internal table
 * `body-row`                 | Body row in the internal table
 * `collapsed-row`            | Collapsed row
 * `expanded-row`             | Expanded row
 * `selected-row`             | Selected row
 * `details-opened-row`       | Row with details open
 * `odd-row`                  | Odd row
 * `even-row`                 | Even row
 * `first-row`                | The first body row
 * `last-row`                 | The last body row
 * `dragstart-row`            | Set on the row for one frame when drag is starting.
 * `dragover-above-row`       | Set on the row when the a row is dragged over above
 * `dragover-below-row`       | Set on the row when the a row is dragged over below
 * `dragover-on-top-row`      | Set on the row when the a row is dragged over on top
 * `drag-disabled-row`        | Set to a row that isn't available for dragging
 * `drop-disabled-row`        | Set to a row that can't be dropped on top of
 * `cell`                     | Cell in the internal table
 * `header-cell`              | Header cell in the internal table
 * `body-cell`                | Body cell in the internal table
 * `footer-cell`              | Footer cell in the internal table
 * `details-cell`             | Row details cell in the internal table
 * `focused-cell`             | Focused cell in the internal table
 * `odd-row-cell`             | Cell in an odd row
 * `even-row-cell`            | Cell in an even row
 * `first-row-cell`           | Cell in the first body row
 * `last-row-cell`            | Cell in the last body row
 * `first-header-row-cell`    | Cell in the first header row
 * `first-footer-row-cell`    | Cell in the first footer row
 * `last-header-row-cell`     | Cell in the last header row
 * `last-footer-row-cell`     | Cell in the last footer row
 * `loading-row-cell`         | Cell in a row that is waiting for data from data provider
 * `selected-row-cell`        | Cell in a selected row
 * `collapsed-row-cell`       | Cell in a collapsed row
 * `expanded-row-cell`        | Cell in an expanded row
 * `details-opened-row-cell`  | Cell in an row with details open
 * `dragstart-row-cell`       | Cell in the ghost image row, but not in a source row
 * `drag-source-row-cell`     | Cell in a source row, but not in the ghost image
 * `dragover-above-row-cell`  | Cell in a row that has another row dragged over above
 * `dragover-below-row-cell`  | Cell in a row that has another row dragged over below
 * `dragover-on-top-row-cell` | Cell in a row that has another row dragged over on top
 * `drag-disabled-row-cell`   | Cell in a row that isn't available for dragging
 * `drop-disabled-row-cell`   | Cell in a row that can't be dropped on top of
 * `frozen-cell`              | Frozen cell in the internal table
 * `frozen-to-end-cell`       | Frozen to end cell in the internal table
 * `last-frozen-cell`         | Last frozen cell
 * `first-frozen-to-end-cell` | First cell frozen to end
 * `first-column-cell`        | First visible cell on a row
 * `last-column-cell`         | Last visible cell on a row
 * `reorder-allowed-cell`     | Cell in a column where another column can be reordered
 * `reorder-dragging-cell`    | Cell in a column currently being reordered
 * `resize-handle`            | Handle for resizing the columns
 * `empty-state`              | The container for the content to be displayed when there are no body rows to show
 * `reorder-ghost`            | Ghost element of the header cell being dragged
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} active-item-changed - Fired when the `activeItem` property changes.
 * @fires {CustomEvent} cell-activate - Fired when the cell is activated with click or keyboard.
 * @fires {CustomEvent} cell-focus - Fired when a cell is focused with click or keyboard navigation.
 * @fires {CustomEvent} column-reorder - Fired when the columns in the grid are reordered.
 * @fires {CustomEvent} column-resize - Fired when the grid column resize is finished.
 * @fires {CustomEvent} data-provider-changed - Fired when the `dataProvider` property changes.
 * @fires {CustomEvent} expanded-items-changed - Fired when the `expandedItems` property changes.
 * @fires {CustomEvent} grid-dragstart - Fired when starting to drag grid rows.
 * @fires {CustomEvent} grid-dragend - Fired when the dragging of the rows ends.
 * @fires {CustomEvent} grid-drop - Fired when a drop occurs on top of the grid.
 * @fires {CustomEvent} loading-changed - Fired when the `loading` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 * @fires {CustomEvent} size-changed - Fired when the `size` property changes.
 */
declare class Grid<TItem = GridDefaultItem> extends HTMLElement {
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
    ControllerMixinClass,
    GridMixinClass<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid': Grid<GridDefaultItem>;
  }
}

export { Grid };
