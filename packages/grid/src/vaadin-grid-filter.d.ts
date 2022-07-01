/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Fired when the `value` property changes.
 */
export type GridFilterValueChangedEvent = CustomEvent<{ value: string }>;

export interface GridFilterCustomEventMap {
  'value-changed': GridFilterValueChangedEvent;
}

export interface GridFilterEventMap extends HTMLElementEventMap, GridFilterCustomEventMap {}

/**
 * `<vaadin-grid-filter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * and handlers for filtering the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.headerRenderer = (root, column) => {
 *   let filter = root.firstElementChild;
 *   if (!filter) {
 *     filter = document.createElement('vaadin-grid-filter');
 *     root.appendChild(filter);
 *   }
 *   filter.path = 'name.first';
 * };
 * column.renderer = (root, column, model) => {
 *   root.textContent = model.item.name.first;
 * };
 * ```
 *
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class GridFilter extends HTMLElement {
  /**
   * JS Path of the property in the item used for filtering the data.
   */
  path: string | null | undefined;

  /**
   * Current filter value.
   */
  value: string | null | undefined;

  addEventListener<K extends keyof GridFilterEventMap>(
    type: K,
    listener: (this: GridFilter, ev: GridFilterEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof GridFilterEventMap>(
    type: K,
    listener: (this: GridFilter, ev: GridFilterEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-filter': GridFilter;
  }
}

export { GridFilter };
