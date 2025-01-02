/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { Grid, GridItemModel } from './vaadin-grid.js';

export type GridRowDetailsRenderer<TItem> = (root: HTMLElement, grid: Grid<TItem>, model: GridItemModel<TItem>) => void;

export declare function RowDetailsMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<RowDetailsMixinClass<TItem>> & T;

export declare class RowDetailsMixinClass<TItem> {
  /**
   * An array containing references to items with open row details.
   */
  detailsOpenedItems: TItem[];

  /**
   * Custom function for rendering the content of the row details.
   * Receives three arguments:
   *
   * - `root` The row details content DOM element. Append your content to it.
   * - `grid` The `<vaadin-grid>` element.
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.level` The number of the item's tree sublevel, starts from 0.
   *   - `model.expanded` True if the item's tree sublevel is expanded.
   *   - `model.selected` True if the item is selected.
   */
  rowDetailsRenderer: GridRowDetailsRenderer<TItem> | null | undefined;

  /**
   * Open the details row of a given item.
   */
  openItemDetails(item: TItem): void;

  /**
   * Close the details row of a given item.
   */
  closeItemDetails(item: TItem): void;
}
