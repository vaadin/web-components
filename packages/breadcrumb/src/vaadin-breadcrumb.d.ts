/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a web component for displaying breadcrumb navigation.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 */
declare class Breadcrumb extends BreadcrumbMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: Breadcrumb, ev: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: Breadcrumb, ev: HTMLElementEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb': Breadcrumb;
  }
}

export { Breadcrumb };
