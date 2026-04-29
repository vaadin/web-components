/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-trail>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 *
 * ```html
 * <vaadin-breadcrumb-trail>
 *   <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb-trail>
 * ```
 *
 * This component is experimental and only registers when the
 * `breadcrumbTrailComponent` feature flag is enabled.
 */
declare class BreadcrumbTrail extends ElementMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-trail': BreadcrumbTrail;
  }
}

export { BreadcrumbTrail };
