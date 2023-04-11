/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function ColumnReorderingMixin<T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<ColumnReorderingMixinClass>;

export declare class ColumnReorderingMixinClass {
  /**
   * Set to true to allow column reordering.
   * @attr {boolean} column-reordering-allowed
   */
  columnReorderingAllowed: boolean;
}
