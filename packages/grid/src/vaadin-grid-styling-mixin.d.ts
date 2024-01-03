/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { GridItemModel } from './vaadin-grid.js';
import type { GridColumn } from './vaadin-grid-column.js';

export type GridCellPartNameGenerator<TItem> = (column: GridColumn<TItem>, model: GridItemModel<TItem>) => string;

/**
 * @deprecated Use `GridCellPartNameGenerator` type and `cellPartNameGenerator` API instead.
 */
export type GridCellClassNameGenerator<TItem> = GridCellPartNameGenerator<TItem>;

export declare function StylingMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<StylingMixinClass<TItem>> & T;

export declare class StylingMixinClass<TItem> {
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
   *
   * @deprecated Use `cellPartNameGenerator` instead.
   */
  cellClassNameGenerator: GridCellClassNameGenerator<TItem> | null | undefined;

  /**
   * A function that allows generating CSS `part` names for grid cells in Shadow DOM based
   * on their row and column, for styling from outside using the `::part()` selector.
   *
   * The return value should be the generated part name as a string, or multiple part names
   * separated by whitespace characters.
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
  cellPartNameGenerator: GridCellPartNameGenerator<TItem> | null | undefined;

  /**
   * Runs the `cellClassNameGenerator` for the visible cells.
   * If the generator depends on varying conditions, you need to
   * call this function manually in order to update the styles when
   * the conditions change.
   *
   * @deprecated Use `cellPartNameGenerator` and `generateCellPartNames()` instead.
   */
  generateCellClassNames(): void;

  /**
   * Runs the `cellPastNameGenerator` for the visible cells.
   * If the generator depends on varying conditions, you need to
   * call this function manually in order to update the styles when
   * the conditions change.
   */
  generateCellPartNames(): void;
}
