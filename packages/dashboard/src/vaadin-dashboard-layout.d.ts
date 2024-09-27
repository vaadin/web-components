/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * A responsive, grid-based dashboard layout component
 */
declare class DashboardLayout extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * Whether the dashboard layout is dense.
   */
  dense: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-layout': DashboardLayout;
  }
}

export { DashboardLayout };
