/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { GridDefaultItem } from './vaadin-grid.js';
import type { GridColumnMixin } from './vaadin-grid-column.js';
import type { GridColumn } from './vaadin-grid-column.js';
import type {
  GridSelectionColumnEventMap,
  GridSelectionColumnMixinClass,
} from './vaadin-grid-selection-column-mixin.js';

export * from './vaadin-grid-selection-column-mixin.js';

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
 */
declare class GridSelectionColumn<TItem = GridDefaultItem> extends HTMLElement {}

interface GridSelectionColumn<TItem = GridDefaultItem>
  extends GridSelectionColumnMixinClass<TItem>,
    GridColumnMixin<TItem, GridColumn<TItem>>,
    GridColumn<TItem> {
  addEventListener<K extends keyof GridSelectionColumnEventMap>(
    type: K,
    listener: (this: GridSelectionColumn<TItem>, ev: GridSelectionColumnEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof GridSelectionColumnEventMap>(
    type: K,
    listener: (this: GridSelectionColumn<TItem>, ev: GridSelectionColumnEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-selection-column': GridSelectionColumn<GridDefaultItem>;
  }
}

export { GridSelectionColumn };
