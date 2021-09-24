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
}

export { ArrayDataProviderMixin, ArrayDataProviderMixinConstructor };
