/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common breadcrumb functionality.
 */
export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbMixinClass> & T;

export declare class BreadcrumbMixinClass {
  /**
   * The accessible label for the breadcrumb navigation.
   * Mapped to `aria-label` on the host element.
   */
  label: string;
}
