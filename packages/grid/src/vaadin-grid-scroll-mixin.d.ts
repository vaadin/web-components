/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ScrollMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ScrollMixinClass> & T;

export declare class ScrollMixinClass {
  /**
   * Makes the content on the grid columns render lazily when
   * the column cells are scrolled into view.
   *
   * If true, the grid will be able to optimize cell rendering
   * significantly when there are multiple columns in the grid.
   *
   * NOTE: make sure that each cell on a single row has the same
   * intrinsic height as all other cells on that row.
   * Otherwise, you may experience jumpiness when scrolling the grid
   * horizontally when lazily rendered cells with different
   * heights are scrolled into view.
   *
   * NOTE: columns with auto-width will only take the header content into account
   * when calculating the width for columns that are initially outside the viewport.
   */
  lazyColumns: boolean | null | undefined;

  /**
   * Scroll to a flat index in the grid. The method doesn't take into account
   * the hierarchy of the items.
   */
  protected _scrollToFlatIndex(index: number): void;
}
