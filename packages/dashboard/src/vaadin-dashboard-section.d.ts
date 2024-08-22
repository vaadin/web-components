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

/**
 * A Section component for use with the Dashboard component
 */
declare class DashboardSection extends ControllerMixin(ElementMixin(HTMLElement)) {
  /**
   * The title of the section
   */
  sectionTitle: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dashboard-section': DashboardSection;
  }
}

export { DashboardSection };
