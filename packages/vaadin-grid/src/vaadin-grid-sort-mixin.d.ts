import { GridSorter } from './interfaces';

declare function SortMixin<T extends new (...args: any[]) => {}>(base: T): T & SortMixinConstructor;

interface SortMixinConstructor {
  new (...args: any[]): SortMixin;
}

interface SortMixin {
  /**
   * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
   * @attr {boolean} multi-sort
   */
  multiSort: boolean;

  _sorters: GridSorter[];

  _mapSorters(): GridSorter[];
}

export { SortMixin, SortMixinConstructor };
