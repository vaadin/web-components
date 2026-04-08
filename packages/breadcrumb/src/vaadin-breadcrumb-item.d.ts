/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a navigation item used within `<vaadin-breadcrumb>`.
 *
 * ```html
 * <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
 * ```
 */
declare class BreadcrumbItem extends DisabledMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * Navigation target. If absent, the item represents the current page.
   * Consistent with `vaadin-side-nav-item`.
   * @attr {string} path
   */
  path: string | null | undefined;

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: BreadcrumbItem, ev: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: BreadcrumbItem, ev: HTMLElementEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
