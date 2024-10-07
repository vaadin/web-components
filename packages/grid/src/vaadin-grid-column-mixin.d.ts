/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { GridItemModel } from './vaadin-grid.js';

export type GridBodyRenderer<TItem, Column extends GridColumnMixin<TItem, Column>> = (
  root: HTMLElement,
  column: Column,
  model: GridItemModel<TItem>,
) => void;

export type GridColumnTextAlign = 'center' | 'end' | 'start' | null;

export type GridHeaderFooterRenderer<TItem, Column extends ColumnBaseMixinClass<TItem, Column>> = (
  root: HTMLElement,
  column: Column,
) => void;

export declare function ColumnBaseMixin<
  TItem,
  Column extends GridColumnMixin<TItem, Column>,
  T extends Constructor<HTMLElement>,
>(base: T): Constructor<ColumnBaseMixinClass<TItem, Column>> & T;

export declare class ColumnBaseMixinClass<TItem, Column extends ColumnBaseMixinClass<TItem, Column>> {
  /**
   * When set to true, the column is user-resizable.
   */
  resizable: boolean | null | undefined;

  /**
   * When true, the column is frozen. When a column inside of a column group is frozen,
   * all of the sibling columns inside the group will get frozen also.
   */
  frozen: boolean;

  /**
   * When true, the column is frozen to end of grid.
   *
   * When a column inside of a column group is frozen to end, all of the sibling columns
   * inside the group will get frozen to end also.
   *
   * Column can not be set as `frozen` and `frozenToEnd` at the same time.
   * @attr {boolean} frozen-to-end
   */
  frozenToEnd: boolean;

  /**
   * When true, the cells for this column will be rendered with the `role` attribute
   * set as `rowheader`, instead of the `gridcell` role value used by default.
   *
   * When a column is set as row header, its cells will be announced by screen readers
   * while navigating to help user identify the current row as uniquely as possible.
   *
   * @attr {boolean} row-header
   */
  rowHeader: boolean;

  /**
   * When set to true, the cells for this column are hidden.
   */
  hidden: boolean;

  /**
   * Text content to display in the header cell of the column.
   */
  header: string | null | undefined;

  /**
   * Aligns the columns cell content horizontally.
   * Supported values: "start", "center" and "end".
   * @attr {start|center|end} text-align
   */
  textAlign: GridColumnTextAlign | null | undefined;

  /**
   * Custom function for rendering the header content.
   * Receives two arguments:
   *
   * - `root` The header cell content DOM element. Append your content to it.
   * - `column` The `<vaadin-grid-column>` element.
   */
  headerRenderer: GridHeaderFooterRenderer<TItem, Column> | null | undefined;

  /**
   * Custom function for rendering the footer content.
   * Receives two arguments:
   *
   * - `root` The footer cell content DOM element. Append your content to it.
   * - `column` The `<vaadin-grid-column>` element.
   */
  footerRenderer: GridHeaderFooterRenderer<TItem, Column> | null | undefined;

  /**
   * Custom part name for the header cell.
   *
   * @attr {string} header-part-name
   */
  headerPartName: string | null | undefined;

  /**
   * Custom part name for the footer cell.
   *
   * @attr {string} footer-part-name
   */
  footerPartName: string | null | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GridColumnMixin<TItem, Column extends GridColumnMixinClass<TItem, Column>>
  extends GridColumnMixinClass<TItem, Column> {}

export declare class GridColumnMixinClass<
  TItem,
  Column extends GridColumnMixinClass<TItem, Column>,
> extends ColumnBaseMixinClass<TItem, Column> {
  /**
   * Width of the cells for this column.
   *
   * Please note that using the `em` length unit is discouraged as
   * it might lead to misalignment issues if the header, body, and footer
   * cells have different font sizes. Instead, use `rem` if you need
   * a length unit relative to the font size.
   */
  width: string | null | undefined;

  /**
   * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
   * @attr {number} flex-grow
   */
  flexGrow: number;

  /**
   * Custom function for rendering the cell content.
   * Receives three arguments:
   *
   * - `root` The cell content DOM element. Append your content to it.
   * - `column` The `<vaadin-grid-column>` element.
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.expanded` Sublevel toggle state.
   *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
   *   - `model.selected` Selected state.
   *   - `model.detailsOpened` Details opened state.
   */
  renderer: GridBodyRenderer<TItem, Column> | null | undefined;

  /**
   * Path to an item sub-property whose value gets displayed in the column body cells.
   * The property name is also shown in the column header if an explicit header or renderer isn't defined.
   */
  path: string | null | undefined;

  /**
   * Automatically sets the width of the column based on the column contents when this is set to `true`.
   *
   * For performance reasons the column width is calculated automatically only once when the grid items
   * are rendered for the first time and the calculation only considers the rows which are currently
   * rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell
   * content changes, the column width might not match the contents anymore.
   *
   * Hidden columns are ignored in the calculation and their widths are not automatically updated when
   * you show a column that was initially hidden.
   *
   * You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.
   *
   * The column width may still grow larger when `flexGrow` is not 0.
   * @attr {boolean} auto-width
   */
  autoWidth: boolean;
}
