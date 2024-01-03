/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ArrayDataProviderMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ArrayDataProviderMixinClass<TItem>> & T;

export declare class ArrayDataProviderMixinClass<TItem> {
  /**
   * An array containing the items which will be passed to renderer functions.
   */
  items: TItem[] | null | undefined;
}
