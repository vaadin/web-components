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

export interface DashboardSectionI18n extends DashboardItemI18n {
  selectTitleForEditing: string;
}

/**
 * A Section component for use with the Dashboard component
 */
declare class DashboardSection extends DashboardItemMixin(ControllerMixin(ElementMixin(HTMLElement))) {
  /**
   * The title of the section
   */
  sectionTitle: string | null | undefined;

  /**
   * The object used to localize this component.
   *
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * The object has the following structure and default values:
   * ```
   * {
   *   selectTitleForEditing: 'Select Section Title for editing',
   *   remove: {
   *     title: 'Remove',
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
  i18n: DashboardSectionI18n;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-section': DashboardSection;
  }
}

export { DashboardSection };
