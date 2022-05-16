/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function ArrayDataProviderMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<ArrayDataProviderMixinClass<TItem>>;

export declare class ArrayDataProviderMixinClass<TItem> {
  /**
   * An array containing the items which will be passed to renderer functions.
   */
  items: TItem[] | null | undefined;
}
