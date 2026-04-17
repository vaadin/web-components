/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function BreadcrumbItemMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbItemMixinClass> & T;

export declare class BreadcrumbItemMixinClass {
  /**
   * The path (URL) for this breadcrumb item. When set, the item
   * renders as a clickable link.
   */
  path: string | undefined;
}
