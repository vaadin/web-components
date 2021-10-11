/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type GridSorterDirection = 'asc' | 'desc' | null;

/**
 * Fired when the `direction` property changes.
 */
export type GridSorterDirectionChangedEvent = CustomEvent<{ value: GridSorterDirection }>;

export interface GridSorterCustomEventMap {
  'sorter-changed': Event;

  'direction-changed': GridSorterDirectionChangedEvent;
}

export interface GridSorterEventMap extends HTMLElementEventMap, GridSorterCustomEventMap {}

/**
 * `<vaadin-grid-sorter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * visual feedback, and handlers for sorting the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.renderer = (root, column, model) => {
 *   let sorter = root.firstElementChild;
 *   if (!sorter) {
 *     sorter = document.createElement('vaadin-grid-sorter');
 *     root.appendChild(sorter);
 *   }
 *   sorter.path = 'name.first';
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `content` | The slotted content wrapper
 * `indicators` | The internal sorter indicators.
 * `order` | The internal sorter order
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `direction` | Sort direction of a sorter | :host
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 * @fires {CustomEvent} sorter-changed - Fired when the `path` or `direction` property changes.
 */
declare class GridSorter extends ThemableMixin(DirMixin(HTMLElement)) {
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

  addEventListener<K extends keyof GridSorterEventMap>(
    type: K,
    listener: (this: GridSorter, ev: GridSorterEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof GridSorterEventMap>(
    type: K,
    listener: (this: GridSorter, ev: GridSorterEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-sorter': GridSorter;
  }
}

export { GridSorter };
