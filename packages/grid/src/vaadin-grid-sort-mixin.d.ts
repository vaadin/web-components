/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function SortMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<SortMixinClass>;

export declare class SortMixinClass {
  /**
   * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
   * @attr {boolean} multi-sort
   */
  multiSort: boolean;

  /**
   * Use this property to determine the order in which the grid rows are sorted.
   * It's visually indicated by numbers in grid sorters placed in column headers.
   *
   * By default, whenever an unsorted column is sorted, or the sort-direction of a column is
   * changed, that column gets sort priority 1, thus affecting the priority for all the other
   * sorted columns. This is identical to using `multi-sort-priority="prepend"`.
   *
   * Using this property allows to change this behavior so that sorting an unsorted column
   * would add it to the "end" of the sort, and changing column's sort direction would retain
   * it's previous priority. To set this, use `multi-sort-priority="append"`.
   *
   * @attr {string} multi-sort-priority
   */
  multiSortPriority: 'prepend' | 'append';
}
