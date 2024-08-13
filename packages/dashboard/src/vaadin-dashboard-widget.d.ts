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

/**
 * A Widget component for use with the Dashboard component
 */
declare class DashboardWidget extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-widget': DashboardWidget;
  }
}

export { DashboardWidget };
