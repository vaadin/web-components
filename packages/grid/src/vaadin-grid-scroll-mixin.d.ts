/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
}

export { ScrollMixin, ScrollMixinConstructor };
