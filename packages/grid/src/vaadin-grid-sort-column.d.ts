/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from './vaadin-grid.js';
import { GridColumn } from './vaadin-grid-column.js';
import { GridSorterDirection } from './vaadin-grid-sorter.js';

/**
 * Fired when the `direction` property changes.
 */
export type GridSortColumnDirectionChangedEvent = CustomEvent<{ value: GridSorterDirection }>;

export interface GridSortColumnCustomEventMap {
  'direction-changed': GridSortColumnDirectionChangedEvent;
}

export interface GridSortColumnEventMap extends HTMLElementEventMap, GridSortColumnCustomEventMap {}

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
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 */
declare class GridSortColumn<TItem = GridDefaultItem> extends GridColumn<TItem> {
  /**
   * JS Path of the property in the item used for sorting the data.
   */
  path: string | null | undefined;

  /**
   * How to sort the data.
   * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
   * descending direction, or `null` for not sorting the data.
   */
  direction: GridSorterDirection | null | undefined;

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
