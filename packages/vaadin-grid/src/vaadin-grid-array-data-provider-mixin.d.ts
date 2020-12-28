import { GridDataProviderCallback, GridDataProviderParams, GridItem, GridFilter, GridSorter } from './interfaces';

declare function ArrayDataProviderMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ArrayDataProviderMixinConstructor;

interface ArrayDataProviderMixinConstructor {
  new (...args: any[]): ArrayDataProviderMixin;
}

interface ArrayDataProviderMixin {
  /**
   * An array containing the items which will be stamped to the column template
   * instances.
   */
  items: GridItem[] | null | undefined;

  _arrayDataProvider(opts: GridDataProviderParams | null, cb: GridDataProviderCallback | null): void;

  /**
   * Check array of filters/sorters for paths validity, console.warn invalid items
   *
   * @param arrayToCheck The array of filters/sorters to check
   * @param action The name of action to include in warning (filtering, sorting)
   */
  _checkPaths(arrayToCheck: Array<GridFilter | GridSorter>, action: string, items: GridItem[]): any;

  _multiSort(a: unknown | null, b: unknown | null): number;

  _normalizeEmptyValue(value: unknown | null): string;

  _compare(a: unknown | null, b: unknown | null): number;

  _filter(items: GridItem[]): GridItem[];
}

export { ArrayDataProviderMixin, ArrayDataProviderMixinConstructor };
