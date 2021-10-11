/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
