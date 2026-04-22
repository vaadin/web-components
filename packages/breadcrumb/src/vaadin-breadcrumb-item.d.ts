/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is an individual item used inside `<vaadin-breadcrumb>`.
 *
 * This component is experimental. To use it, enable the feature flag before
 * importing the component:
 *
 * ```js
 * window.Vaadin.featureFlags.breadcrumbComponent = true;
 * ```
 */
declare class BreadcrumbItem extends ElementMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
