/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function BreadcrumbMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<BreadcrumbMixinClass> & T;

export declare class BreadcrumbMixinClass {
  /**
   * The array of slotted breadcrumb items.
   */
  protected _items: Element[];

  /**
   * The number of slotted items.
   */
  protected _itemCount: number;
}
