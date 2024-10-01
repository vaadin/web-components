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
 *
 * ```html
 * <vaadin-dashboard-widget widget-title="Title">
 *   <span slot="header">Header</span>
 *   <div>Content</div>
 * </vaadin-dashboard-widget>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `title`   | A slot for the widget title. Overrides the `widgetTitle` property.
 * `header`  | A slot for the widget header.
 *
 * #### Example
 *
 * ```html
 * <vaadin-dashboard-widget>
 *   <span slot="header">Header</span>
 *   <span slot="title">Title</span>
 *   <div>Content</div>
 * </vaadin-dashboard-widget>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available:
 *
 * Custom Property                 | Description
 * --------------------------------|-------------
 * --vaadin-dashboard-item-colspan | colspan of the widget
 * --vaadin-dashboard-item-rowspan | rowspan of the widget
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `selected`     | Set when the element is selected.
 * `focused`      | Set when the element is focused.
 * `move-mode`    | Set when the element is being moved.
 * `resize-mode`  | Set when the element is being resized.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DashboardWidget extends DashboardItemMixin(ControllerMixin(ElementMixin(HTMLElement))) {
  /**
   * The title of the widget
   *
   * @attr {string} widget-title
   */
  widgetTitle: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-widget': DashboardWidget;
  }
}

export { DashboardWidget };
