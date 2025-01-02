/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type {
  DataProvider,
  DataProviderCallback,
} from '@vaadin/component-base/src/data-provider-controller/data-provider-controller.js';
import { GridSorterDirection } from './vaadin-grid-sorter.js';

export { GridSorterDirection };

export interface GridFilterDefinition {
  path: string;
  value: string;
}

export interface GridSorterDefinition {
  path: string;
  direction: GridSorterDirection;
}

export type GridDataProviderCallback<TItem> = DataProviderCallback<TItem>;

export type GridDataProviderParams<TItem> = {
  page: number;
  pageSize: number;
  filters: GridFilterDefinition[];
  sortOrders: GridSorterDefinition[];
  parentItem?: TItem;
};

export type GridDataProvider<TItem> = DataProvider<TItem, GridDataProviderParams<TItem>>;

export declare function DataProviderMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DataProviderMixinClass<TItem>> & T;

export declare class DataProviderMixinClass<TItem> {
  /**
   * Number of items fetched at a time from the dataprovider.
   * @attr {number} page-size
   */
  pageSize: number;

  /**
   * The number of root-level items in the grid.
   * @attr {number} size
   */
  size: number;

  /**
   * Function that provides items lazily. Receives arguments `params`, `callback`
   *
   * `params.page` Requested page index
   *
   * `params.pageSize` Current page size
   *
   * `params.filters` Currently applied filters
   *
   * `params.sortOrders` Currently applied sorting orders
   *
   * `params.parentItem` When tree is used, and sublevel items
   * are requested, reference to parent item of the requested sublevel.
   * Otherwise `undefined`.
   *
   * `callback(items, size)` Callback function with arguments:
   *   - `items` Current page of items
   *   - `size` Total number of items. When tree sublevel items
   *     are requested, total number of items in the requested sublevel.
   *     Optional when tree is not used, required for tree.
   */
  dataProvider: GridDataProvider<TItem> | null | undefined;

  /**
   * `true` while data is being requested from the data provider.
   */
  readonly loading: boolean | null | undefined;

  /**
   * Path to an item sub-property that indicates whether the item has child items.
   * @attr {string} item-has-children-path
   */
  itemHasChildrenPath: string;

  /**
   * Path to an item sub-property that identifies the item.
   * @attr {string} item-id-path
   */
  itemIdPath: string | null | undefined;

  /**
   * An array that contains the expanded items.
   */
  expandedItems: TItem[];

  /**
   * Returns a value that identifies the item. Uses `itemIdPath` if available.
   * Can be customized by overriding.
   */
  getItemId(item: TItem): TItem | unknown;

  /**
   * Expands the given item tree.
   */
  expandItem(item: TItem): void;

  /**
   * Collapses the given item tree.
   */
  collapseItem(item: TItem): void;

  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache(): void;

  /**
   * Scroll to a specific row index in the virtual list. Note that the row index is
   * not always the same for any particular item. For example, sorting or filtering
   * items can affect the row index related to an item.
   *
   * The `indexes` parameter can be either a single number or multiple numbers.
   * The grid will first try to scroll to the item at the first index on the top level.
   * In case the item at the first index is expanded, the grid will then try scroll to the
   * item at the second index within the children of the expanded first item, and so on.
   * Each given index points to a child of the item at the previous index.
   *
   * Using `Infinity` as an index will point to the last item on the level.
   */
  scrollToIndex(...indexes: number[]): void;
}
