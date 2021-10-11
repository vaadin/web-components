/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridColumn } from './vaadin-grid-column.js';
import { GridItemModel } from './vaadin-grid.js';

export type GridCellClassNameGenerator<TItem> = (column: GridColumn<TItem>, model: GridItemModel<TItem>) => string;

declare function StylingMixin<TItem, T extends new (...args: any[]) => {}>(base: T): T & StylingMixinConstructor<TItem>;

interface StylingMixinConstructor<TItem> {
  new (...args: any[]): StylingMixin<TItem>;
}

interface StylingMixin<TItem> {
  /**
   * A function that allows generating CSS class names for grid cells
   * based on their row and column. The return value should be the generated
   * class name as a string, or multiple class names separated by whitespace
   * characters.
   *
   * Receives two arguments:
   * - `column` The `<vaadin-grid-column>` element (`undefined` for details-cell).
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.expanded` Sublevel toggle state.
   *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
   *   - `model.selected` Selected state.
   */
  cellClassNameGenerator: GridCellClassNameGenerator<TItem> | null | undefined;

  /**
   * Runs the `cellClassNameGenerator` for the visible cells.
   * If the generator depends on varying conditions, you need to
   * call this function manually in order to update the styles when
   * the conditions change.
   */
  generateCellClassNames(): void;
}

export { StylingMixin, StylingMixinConstructor };
