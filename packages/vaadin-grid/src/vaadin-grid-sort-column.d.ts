import { GridSorterDirection } from './interfaces';

import { GridColumnElement } from './vaadin-grid-column.js';

/**
 * Fired when the `direction` property changes.
 */
export type GridSortColumnDirectionChanged = CustomEvent<{ value: GridSorterDirection }>;

export interface GridSortColumnElementEventMap {
  'direction-changed': GridSortColumnDirectionChanged;
}

export interface GridSortColumnEventMap extends HTMLElementEventMap, GridSortColumnElementEventMap {}

/**
 * `<vaadin-grid-sort-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header template and functionality for sorting.
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
declare class GridSortColumnElement extends GridColumnElement {
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
    listener: (this: GridSortColumnElement, ev: GridSortColumnEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridSortColumnEventMap>(
    type: K,
    listener: (this: GridSortColumnElement, ev: GridSortColumnEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-sort-column': GridSortColumnElement;
  }
}

export { GridSortColumnElement };
