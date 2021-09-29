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
}

export { SortMixin, SortMixinConstructor };
