/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { IncludedMixinClass } from './vaadin-crud-include-mixin.js';

/**
 * A mixin providing common crud grid functionality.
 */
export declare function CrudGridMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<CrudGridMixinClass> & Constructor<IncludedMixinClass> & T;

export declare class CrudGridMixinClass {
  /**
   * Disable filtering in the generated columns.
   * @attr {boolean} no-filter
   */
  noFilter: boolean | null | undefined;

  /**
   * Disable sorting in the generated columns.
   * @attr {boolean} no-sort
   */
  noSort: boolean | null | undefined;

  /**
   * Do not add headers to columns.
   * @attr {boolean} no-head
   */
  noHead: boolean | null | undefined;
}
