import { GridDataProvider } from './interfaces';

declare class ItemCache<TItem> {
  grid: HTMLElement;
  parentCache: ItemCache<TItem> | undefined;
  parentItem: TItem | undefined;
  itemCaches: object | null;
  items: object | null;
  effectiveSize: number;
  size: number;
  pendingRequests: object | null;

  constructor(grid: HTMLElement, parentCache: ItemCache<TItem> | undefined, parentItem: TItem | undefined);

  isLoading(): boolean;

  getItemForIndex(index: number): TItem | undefined;

  updateSize(): void;

  ensureSubCacheForScaledIndex(scaledIndex: number): void;

  getCacheAndIndex(index: number): { cache: ItemCache<TItem>; scaledIndex: number };
}

declare function DataProviderMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & DataProviderMixinConstructor<TItem>;

interface DataProviderMixinConstructor<TItem> {
  new (...args: any[]): DataProviderMixin<TItem>;
}

interface DataProviderMixin<TItem> {
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

  _cache: ItemCache<TItem>;

  /**
   * Path to an item sub-property that identifies the item.
   * @attr {string} item-id-path
   */
  itemIdPath: string | null | undefined;

  /**
   * An array that contains the expanded items.
   */
  expandedItems: TItem[];

  _getItem(index: number, el: HTMLElement | null): void;

  /**
   * Returns a value that identifies the item. Uses `itemIdPath` if available.
   * Can be customized by overriding.
   */
  getItemId(item: TItem): TItem | unknown;

  _isExpanded(item: TItem): boolean;

  /**
   * Expands the given item tree.
   */
  expandItem(item: TItem): void;

  /**
   * Collapses the given item tree.
   */
  collapseItem(item: TItem): void;

  _getIndexLevel(index: number): number;

  _loadPage(page: number, cache: ItemCache<TItem> | null): void;

  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache(): void;

  _checkSize(): void;

  _ensureFirstPageLoaded(): void;

  _itemsEqual(item1: TItem, item2: TItem): boolean;

  _getItemIndexInArray(item: TItem, array: TItem[]): number;
}

export { DataProviderMixin, DataProviderMixinConstructor, ItemCache };
