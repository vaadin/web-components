/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function ColumnReorderingMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ColumnReorderingMixinClass> & T;

export declare class ColumnReorderingMixinClass {
  /**
   * Set to true to allow column reordering.
   * @attr {boolean} column-reordering-allowed
   */
  columnReorderingAllowed: boolean;
}
