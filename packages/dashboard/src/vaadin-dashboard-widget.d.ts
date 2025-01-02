/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';

/**
 * A Widget component for use with the Dashboard component
 *
 * ```html
 * <vaadin-dashboard-widget widget-title="Title">
 *   <span slot="header-content">Header</span>
 *   <div>Content</div>
 * </vaadin-dashboard-widget>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name        | Description
 * -----------------|-------------
 * `header-content` | A slot for the widget header content.
 *
 * #### Example
 *
 * ```html
 * <vaadin-dashboard-widget widget-title="Title">
 *   <span slot="header-content">Header</span>
 *   <div>Content</div>
 * </vaadin-dashboard-widget>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                     | Description
 * ------------------------------|-------------
 * `header`                      | The header of the widget
 * `title`                       | The title of the widget
 * `content`                     | The content of the widget
 * `move-button`                 | The move button
 * `remove-button`               | The remove button
 * `resize-button`               | The resize button
 * `move-backward-button`        | The move backward button when in move mode
 * `move-forward-button`         | The move forward button when in move mode
 * `move-apply-button`           | The apply button when in move mode
 * `resize-shrink-width-button`  | The shrink width button when in resize mode
 * `resize-grow-width-button`    | The grow width button when in resize mode
 * `resize-shrink-height-button` | The shrink height button when in resize mode
 * `resize-grow-height-button`   | The grow height button when in resize mode
 * `resize-apply-button`         | The apply button when in resize mode
 *
 * The following custom properties are available:
 *
 * Custom Property                   | Description
 * ----------------------------------|-------------
 * `--vaadin-dashboard-item-colspan` | colspan of the widget
 * `--vaadin-dashboard-item-rowspan` | rowspan of the widget
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `selected`     | Set when the element is selected.
 * `focused`      | Set when the element is focused.
 * `move-mode`    | Set when the element is being moved.
 * `resize-mode`  | Set when the element is being resized.
 * `resizing`     | Set when the element is being resized.
 * `dragging`     | Set when the element is being dragged.
 * `editable`     | Set when the element is editable.
 * `first-child`  | Set when the element is the first child of the parent.
 * `last-child`   | Set when the element is the last child of the parent.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DashboardWidget extends DashboardItemMixin(ElementMixin(ThemableMixin(HTMLElement))) {
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
