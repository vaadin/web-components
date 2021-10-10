/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
