import { GridDataProviderCallback, GridDataProviderParams, GridFilter, GridSorter } from './interfaces';

declare function ArrayDataProviderMixin<TItem, T extends new (...args: any[]) => {}>(
  base: T
): T & ArrayDataProviderMixinConstructor<TItem>;

interface ArrayDataProviderMixinConstructor<TItem> {
  new (...args: any[]): ArrayDataProviderMixin<TItem>;
}

declare interface ArrayDataProviderMixin<TItem> {
  /**
   * An array containing the items which will be passed to renderer functions.
   */
  items: TItem[] | null | undefined;

  _arrayDataProvider(opts: GridDataProviderParams<TItem> | null, cb: GridDataProviderCallback<TItem> | null): void;

  /**
   * Check array of filters/sorters for paths validity, console.warn invalid items
   *
   * @param arrayToCheck The array of filters/sorters to check
   * @param action The name of action to include in warning (filtering, sorting)
   */
  _checkPaths(arrayToCheck: Array<GridFilter | GridSorter>, action: string, items: TItem[]): any;

  _multiSort(a: unknown | null, b: unknown | null): number;

  _normalizeEmptyValue(value: unknown | null): string;

  _compare(a: unknown | null, b: unknown | null): number;

  _filter(items: TItem[]): TItem[];
}

export { ArrayDataProviderMixin, ArrayDataProviderMixinConstructor };
