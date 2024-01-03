/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export type GridSorterDirection = 'asc' | 'desc' | null;

/**
 * Fired when the `path` or `direction` property changes.
 */
export type GridSorterChangedEvent = CustomEvent<{ shiftClick: boolean; fromSorterClick: boolean }>;

/**
 * Fired when the `direction` property changes.
 */
export type GridSorterDirectionChangedEvent = CustomEvent<{ value: GridSorterDirection }>;

export interface GridSorterCustomEventMap {
  'sorter-changed': GridSorterChangedEvent;

  'direction-changed': GridSorterDirectionChangedEvent;
}

export interface GridSorterEventMap extends HTMLElementEventMap, GridSorterCustomEventMap {}

export declare function GridSorterMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<GridSorterMixinClass> & T;

declare class GridSorterMixinClass {
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
