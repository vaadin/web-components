/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
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
   * A change to this property triggers an update of the current item in the breadcrumb.
   * While it typically corresponds to the browser's URL, the specific value assigned to
   * the property is irrelevant. The component has its own internal logic for determining
   * which item is current.
   *
   * The main use case for this property is when the breadcrumb is used with a client-side
   * router. In this case, the component needs to be informed about route changes so it
   * can update the current item.
   */
  location: unknown;
}
