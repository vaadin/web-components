/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { GridSorterDirection } from './vaadin-grid-sorter.js';

/**
 * Fired when the `direction` property changes.
 */
export type GridSortColumnDirectionChangedEvent = CustomEvent<{ value: GridSorterDirection }>;

export interface GridSortColumnCustomEventMap {
  'direction-changed': GridSortColumnDirectionChangedEvent;
}

export interface GridSortColumnEventMap extends HTMLElementEventMap, GridSortColumnCustomEventMap {}

export declare function GridSortColumnMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<GridSortColumnMixinClass> & T;

export declare class GridSortColumnMixinClass {
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
}
