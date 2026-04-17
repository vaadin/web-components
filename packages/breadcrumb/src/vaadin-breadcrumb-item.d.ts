/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BreadcrumbItemMixin } from './vaadin-breadcrumb-item-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a Web Component for individual breadcrumb items
 * used within `<vaadin-breadcrumb>`.
 *
 * ```html
 * <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
 * ```
 */
declare class BreadcrumbItem extends BreadcrumbItemMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
