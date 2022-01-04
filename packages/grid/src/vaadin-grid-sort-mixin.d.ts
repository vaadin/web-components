/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function SortMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<SortMixinClass>;

export declare class SortMixinClass {
  /**
   * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
   * @attr {boolean} multi-sort
   */
  multiSort: boolean;
}
