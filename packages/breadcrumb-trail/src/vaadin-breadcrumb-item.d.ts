/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a single item in a `<vaadin-breadcrumb-trail>`.
 * When `path` is set, the item renders as a link; otherwise it renders as
 * non-interactive text representing the current page.
 */
declare class BreadcrumbItem extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
