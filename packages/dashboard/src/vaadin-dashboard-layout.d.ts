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
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

/**
 * A responsive, grid-based dashboard layout component
 *
 * ```html
 * <vaadin-dashboard-layout>
 *   <vaadin-dashboard-widget widget-title="Widget 1"></vaadin-dashboard-widget>
 *   <vaadin-dashboard-widget widget-title="Widget 2"></vaadin-dashboard-widget>
 *   <vaadin-dashboard-section section-title="Section">
 *     <vaadin-dashboard-widget widget-title="Widget in Section"></vaadin-dashboard-widget>
 *   </vaadin-dashboard-section>
 * </vaadin-dashboard-layout>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available:
 *
 * Custom Property                     | Description
 * ------------------------------------|-------------
 * `--vaadin-dashboard-col-min-width`  | minimum column width of the layout
 * `--vaadin-dashboard-col-max-width`  | maximum column width of the layout
 * `--vaadin-dashboard-row-min-height` | minimum row height of the layout
 * `--vaadin-dashboard-col-max-count`  | maximum column count of the layout
 * `--vaadin-dashboard-spacing`        | spacing between child elements and space around its outer edges. Must be in length units (0 is not allowed, 0px is)
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `dense-layout` | Set when the dashboard is in dense mode.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DashboardLayout extends DashboardLayoutMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-layout': DashboardLayout;
  }
}

export { DashboardLayout };