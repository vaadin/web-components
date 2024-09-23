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
import { type DashboardItemI18n, DashboardItemMixin } from './vaadin-dashboard-item-mixin.js';

export interface DashboardWidgetI18n extends Omit<DashboardItemI18n, 'section'> {}

/**
 * A Widget component for use with the Dashboard component
 */
declare class DashboardWidget extends DashboardItemMixin(ControllerMixin(ElementMixin(HTMLElement))) {
  /**
   * The title of the widget
   */
  widgetTitle: string | null | undefined;

  /**
   * The object used to localize this component.
   *
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * The object has the following structure and default values:
   * ```
   * {
   *   widget: {
   *     selectTitleForEditing: 'Select widget title for editing',
   *   },
   *   remove: {
   *     title: 'Remove',
   *   },
   *   resize: {
   *     title: 'Resize',
   *     apply: 'Apply',
   *     shrinkWidth: 'Shrink width',
   *     growWidth: 'Grow width',
   *     shrinkHeight: 'Shrink height',
   *     growHeight: 'Grow height',
   *   },
   *   move: {
   *     title: 'Move',
   *     apply: 'Apply',
   *     forward: 'Move Forward',
   *     backward: 'Move Backward',
   *   },
   * }
   * ```
   */
  i18n: DashboardWidgetI18n;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-widget': DashboardWidget;
  }
}

export { DashboardWidget };
