/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a single item inside a `<vaadin-breadcrumb-trail>`.
 */
declare class BreadcrumbItem extends ElementMixin(HTMLElement) {
  /**
   * The URL the breadcrumb item links to. When set, the item renders as
   * an `<a>` link; when unset, it renders as a non-interactive `<span>`
   * representing the current page.
   */
  path: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
