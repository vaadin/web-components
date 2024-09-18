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
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';

/**
 * A Widget component for use with the Dashboard component
 */
declare class DashboardWidget extends DashboardItemMixin(ControllerMixin(ElementMixin(HTMLElement))) {
  /**
   * The title of the widget
   */
  widgetTitle: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-widget': DashboardWidget;
  }
}

export { DashboardWidget };
