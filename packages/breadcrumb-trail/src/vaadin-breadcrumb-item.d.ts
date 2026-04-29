/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a single item in a `<vaadin-breadcrumb-trail>`.
 * When `path` is set, the item renders as a link; otherwise it renders as
 * non-interactive text representing the current page.
 *
 * This component is experimental and only registers when the
 * `breadcrumbTrailComponent` feature flag is enabled.
 */
declare class BreadcrumbItem extends ElementMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
