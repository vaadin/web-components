/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

declare function ColumnReorderingMixin<T extends new (...args: any[]) => {}>(
  base: T
): T & ColumnReorderingMixinConstructor;

interface ColumnReorderingMixinConstructor {
  new (...args: any[]): ColumnReorderingMixin;
}

export { ColumnReorderingMixinConstructor };

interface ColumnReorderingMixin {
  /**
   * Set to true to allow column reordering.
   * @attr {boolean} column-reordering-allowed
   */
  columnReorderingAllowed: boolean;
}

export { ColumnReorderingMixin };
