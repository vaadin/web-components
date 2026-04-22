/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying a breadcrumb trail of
 * navigational steps leading to the current page.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item path="/reports">Reports</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Quarterly</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * This component is experimental. To use it, enable the feature flag before
 * importing the component:
 *
 * ```js
 * window.Vaadin.featureFlags.breadcrumbComponent = true;
 * ```
 */
declare class Breadcrumb extends BreadcrumbMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb': Breadcrumb;
  }
}

export { Breadcrumb };
