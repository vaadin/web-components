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
declare class BreadcrumbItem extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The URL to navigate to. When set, the item renders as an `<a>` link.
   * When absent, the item renders as a non-interactive `<span>`.
   */
  path?: string | null;

  /**
   * The link target (e.g. `_blank`). Only applies when `path` is set.
   */
  target?: string | null;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
