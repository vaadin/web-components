/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ScrollMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ScrollMixinClass> & T;

export declare class ScrollMixinClass {
  /**
   * Static height for all the body rows.
   * If specified, the grid will be able to optimize cell rendering
   * significantly when there are multiple columns in the grid.
   *
   * NOTE: columns with auto-width will only take the header content into account
   * when calculating the width for columns that are initially outside the viewport.
   */
  rowHeight: number | null | undefined;

  /**
   * Scroll to a specific row index in the virtual list. Note that the row index is
   * not always the same for any particular item. For example, sorting/filtering/expanding
   * or collapsing hierarchical items can affect the row index related to an item.
   *
   * @param index Row index to scroll to
   */
  scrollToIndex(index: number): void;
}
