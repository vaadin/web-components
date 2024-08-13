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
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * A mixin to enable the dashboard layout functionality
 *
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const DashboardLayoutMixin = (superClass) =>
  class DashboardLayoutMixinClass extends superClass {
    static get styles() {
      return css`
        :host {
          display: grid;

          --_vaadin-dashboard-default-col-min-width: 200px;
          --_vaadin-dashboard-default-col-max-width: 400px;

          --_vaadin-dashboard-col-min-width: var(
            --vaadin-dashboard-col-min-width,
            var(--_vaadin-dashboard-default-col-min-width)
          );
          --_vaadin-dashboard-col-max-width: var(
            --vaadin-dashboard-col-max-width,
            var(--_vaadin-dashboard-default-col-max-width)
          );

          grid-template-columns: repeat(
            auto-fill,
            minmax(var(--_vaadin-dashboard-col-min-width), var(--_vaadin-dashboard-col-max-width))
          );
        }
      `;
    }
  };
