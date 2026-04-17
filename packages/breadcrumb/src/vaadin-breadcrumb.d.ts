/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { BreadcrumbNavigateDetail } from './vaadin-breadcrumb-mixin.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

export interface BreadcrumbCustomEventMap {
  navigate: CustomEvent<BreadcrumbNavigateDetail>;
}

export type BreadcrumbEventMap = BreadcrumbCustomEventMap & HTMLElementEventMap;

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying breadcrumb navigation.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * @fires {CustomEvent<BreadcrumbNavigateDetail>} navigate - Fired when a breadcrumb item link is clicked and no `onNavigate` callback is set.
 */
declare class Breadcrumb extends BreadcrumbMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  addEventListener<K extends keyof BreadcrumbEventMap>(
    type: K,
    listener: (this: Breadcrumb, ev: BreadcrumbEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof BreadcrumbEventMap>(
    type: K,
    listener: (this: Breadcrumb, ev: BreadcrumbEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb': Breadcrumb;
  }
}

export { Breadcrumb };
