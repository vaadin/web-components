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
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';

/**
 * A section component for use with the Dashboard component
 *
 * ```html
 * <vaadin-dashboard-section section-title="Section Title">
 *   <vaadin-dashboard-widget widget-title="Widget 1"></vaadin-dashboard-widget>
 *   <vaadin-dashboard-widget widget-title="Widget 2"></vaadin-dashboard-widget>
 * </vaadin-dashboard-section>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `title`   | A slot for the section title. Overrides the `sectionTitle` property.
 *
 * #### Example
 *
 * ```html
 * <vaadin-dashboard-section>
 *   <span slot="title">Section Title</span>
 *   <vaadin-dashboard-widget widget-title="Widget 1"></vaadin-dashboard-widget>
 *   <vaadin-dashboard-widget widget-title="Widget 2"></vaadin-dashboard-widget>
 * </vaadin-dashboard-section>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name              | Description
 * -----------------------|-------------
 * `header`               | The header of the section
 * `move-button`          | The move button
 * `remove-button`        | The remove button
 * `move-backward-button` | The move backward button when in move mode
 * `move-forward-button`  | The move forward button when in move mode
 * `move-apply-button`    | The apply button when in move mode
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `selected`     | Set when the element is selected.
 * `focused`      | Set when the element is focused.
 * `move-mode`    | Set when the element is being moved.
 * `editable`     | Set when the element is editable.
 * `first-child`  | Set when the element is the first child of the parent.
 * `last-child`   | Set when the element is the last child of the parent.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DashboardSection extends DashboardItemMixin(ControllerMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  /**
   * The title of the section
   *
   * @attr {string} section-title
   */
  sectionTitle: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-section': DashboardSection;
  }
}

export { DashboardSection };
