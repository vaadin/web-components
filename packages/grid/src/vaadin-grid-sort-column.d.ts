/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { GridDefaultItem } from './vaadin-grid.js';
import type { GridColumn, GridColumnMixin } from './vaadin-grid-column.js';
import type { GridSortColumnEventMap, GridSortColumnMixinClass } from './vaadin-grid-sort-column-mixin.js';

export * from './vaadin-grid-sort-column-mixin.js';

/**
 * `<vaadin-grid-sort-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header renderer and functionality for sorting.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-sort-column path="name.first" direction="asc"></vaadin-grid-sort-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
declare class GridSortColumn<TItem = GridDefaultItem> extends HTMLElement {}

interface GridSortColumn<TItem = GridDefaultItem>
  extends GridSortColumnMixinClass,
    GridColumnMixin<TItem, GridColumn<TItem>>,
    GridColumn<TItem> {
  addEventListener<K extends keyof GridSortColumnEventMap>(
    type: K,
    listener: (this: GridSortColumn<TItem>, ev: GridSortColumnEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof GridSortColumnEventMap>(
    type: K,
    listener: (this: GridSortColumn<TItem>, ev: GridSortColumnEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-sort-column': GridSortColumn<GridDefaultItem>;
  }
}

export { GridSortColumn };
