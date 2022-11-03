/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function SortMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<SortMixinClass> & T;

export declare class SortMixinClass {
  /**
   * Sets the default multi-sort priority to use for all grid instances.
   * This method should be called before creating any grid instances.
   * Changing this setting does not affect the default for existing grids.
   */
  static setDefaultMultiSortPriority(priority: 'append' | 'prepend'): void;

  /**
   * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
   * @attr {boolean} multi-sort
   */
  multiSort: boolean;

  /**
   * Controls how columns are added to the sort order when using multi-sort.
   * The sort order is visually indicated by numbers in grid sorters placed in column headers.
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
  multiSortPriority: 'append' | 'prepend';

  /**
   * When `true`, Shift-clicking an unsorted column's sorter adds it to the multi-sort.
   * Shift + Space does the same action via keyboard. This property has precedence over the
   * `multiSort` property. If `multiSortOnShiftClick` is true, the multiSort property is effectively ignored.
   *
   * @attr {boolean} multi-sort-on-shift-click
   */
  multiSortOnShiftClick: boolean;
}
