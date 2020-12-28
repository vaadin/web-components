import { GridDataProvider, GridItem } from './interfaces';

declare class ItemCache {
  grid: HTMLElement;
  parentCache: ItemCache | undefined;
  parentItem: GridItem | undefined;
  itemCaches: object | null;
  items: object | null;
  effectiveSize: number;
  size: number;
  pendingRequests: object | null;
  constructor(grid: HTMLElement, parentCache: ItemCache | undefined, parentItem: GridItem | undefined);
  isLoading(): boolean;
  getItemForIndex(index: number): GridItem | undefined;
  updateSize(): void;
  ensureSubCacheForScaledIndex(scaledIndex: number): void;
  getCacheAndIndex(index: number): { cache: ItemCache; scaledIndex: number };
}

declare function DataProviderMixin<T extends new (...args: any[]) => {}>(base: T): T & DataProviderMixinConstructor;

interface DataProviderMixinConstructor {
  new (...args: any[]): DataProviderMixin;
}

interface DataProviderMixin {
  /**
   * Number of items fetched at a time from the dataprovider.
   * @attr {number} page-size
   */
  pageSize: number;

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
  dataProvider: GridDataProvider | null | undefined;

  /**
   * `true` while data is being requested from the data provider.
   */
  readonly loading: boolean | null | undefined;

  _cache: ItemCache;

  /**
   * Path to an item sub-property that identifies the item.
   * @attr {string} item-id-path
   */
  itemIdPath: string | null | undefined;

  /**
   * An array that contains the expanded items.
   */
  expandedItems: GridItem[];

  _getItem(index: number, el: HTMLElement | null): void;

  /**
   * Returns a value that identifies the item. Uses `itemIdPath` if available.
   * Can be customized by overriding.
   */
  getItemId(item: GridItem): GridItem | unknown;

  _isExpanded(item: GridItem): boolean;

  /**
   * Expands the given item tree.
   */
  expandItem(item: GridItem): void;

  /**
   * Collapses the given item tree.
   */
  collapseItem(item: GridItem): void;

  _getIndexLevel(index: number): number;

  _canPopulate(): boolean;

  _loadPage(page: number, cache: ItemCache | null): void;

  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache(): void;

  _checkSize(): void;

  _ensureFirstPageLoaded(): void;

  _itemsEqual(item1: GridItem, item2: GridItem): boolean;

  _getItemIndexInArray(item: GridItem, array: GridItem[]): number;
}

export { DataProviderMixin, DataProviderMixinConstructor, ItemCache };
