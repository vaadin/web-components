declare function ColumnResizingMixin<T extends new (...args: any[]) => {}>(base: T): T & ColumnResizingMixinConstructor;

interface ColumnResizingMixinConstructor {
  new (...args: any[]): ColumnResizingMixin;
}

export { ColumnResizingMixinConstructor };

interface ColumnResizingMixin {}

export { ColumnResizingMixin };
