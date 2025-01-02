/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ScrollMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ScrollMixinClass> & T;

export type ColumnRendering = 'eager' | 'lazy';

export declare class ScrollMixinClass {
  /**
   * Allows you to choose between modes for rendering columns in the grid:
   *
   * "eager" (default): All columns are rendered upfront, regardless of their visibility within the viewport.
   * This mode should generally be preferred, as it avoids the limitations imposed by the "lazy" mode.
   * Use this mode unless the grid has a large number of columns and performance outweighs the limitations
   * in priority.
   *
   * "lazy": Optimizes the rendering of cells when there are multiple columns in the grid by virtualizing
   * horizontal scrolling. In this mode, body cells are rendered only when their corresponding columns are
   * inside the visible viewport.
   *
   * Using "lazy" rendering should be used only if you're dealing with a large number of columns and performance
   * is your highest priority. For most use cases, the default "eager" mode is recommended due to the
   * limitations imposed by the "lazy" mode.
   *
   * When using the "lazy" mode, keep the following limitations in mind:
   *
   * - Row Height: When only a number of columns are visible at once, the height of a row can only be that of
   * the highest cell currently visible on that row. Make sure each cell on a single row has the same height
   * as all other cells on that row. If row cells have different heights, users may experience jumpiness when
   * scrolling the grid horizontally as lazily rendered cells with different heights are scrolled into view.
   *
   * - Auto-width Columns: For the columns that are initially outside the visible viewport but still use auto-width,
   * only the header content is taken into account when calculating the column width because the body cells
   * of the columns outside the viewport are not initially rendered.
   *
   * - Screen Reader Compatibility: Screen readers may not be able to associate the focused cells with the correct
   * headers when only a subset of the body cells on a row is rendered.
   *
   * - Keyboard Navigation: Tabbing through focusable elements inside the grid body may not work as expected because
   * some of the columns that would include focusable elements in the body cells may be outside the visible viewport
   * and thus not rendered.
   *
   * @attr {eager|lazy} column-rendering
   */
  columnRendering: ColumnRendering;

  /**
   * Scroll to a flat index in the grid. The method doesn't take into account
   * the hierarchy of the items.
   */
  protected _scrollToFlatIndex(index: number): void;
}
