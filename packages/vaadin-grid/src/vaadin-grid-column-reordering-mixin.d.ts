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
