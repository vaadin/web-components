declare function ScrollMixin<T extends new (...args: any[]) => {}>(base: T): T & ScrollMixinConstructor;

interface ScrollMixinConstructor {
  new (...args: any[]): ScrollMixin;
}

interface ScrollMixin {
  /**
   * Scroll to a specific row index in the virtual list. Note that the row index is
   * not always the same for any particular item. For example, sorting/filtering/expanding
   * or collapsing hierarchical items can affect the row index related to an item.
   *
   * @param index Row index to scroll to
   */
  scrollToIndex(index: number): void;

  _frozenCellsChanged(): void;

  _updateScrollerMeasurements(): void;

  _updateLastFrozen(): void;
}

export { ScrollMixin, ScrollMixinConstructor };
