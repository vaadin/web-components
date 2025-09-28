/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying hierarchical navigation.
 *
 * ⚠️ **This component is experimental** and the API may change. In order to use it, enable the feature flag by setting `window.Vaadin.featureFlags.breadcrumbComponent = true`.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Details</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|----------------
 * `list`     | The ordered list element
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Breadcrumb extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The aria-label attribute for the breadcrumb navigation
   */
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb': Breadcrumb;
  }
}

export { Breadcrumb };
