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
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * A mixin to enable the dashboard layout functionality
 *
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const DashboardLayoutMixin = (superClass) =>
  class DashboardLayoutMixinClass extends ResizeMixin(superClass) {
    static get styles() {
      return css`
        :host {
          /* Default min and max column widths */
          --_vaadin-dashboard-default-col-min-width: 25rem;
          --_vaadin-dashboard-default-col-max-width: 1fr;
          /* Effective min and max column widths */
          --_vaadin-dashboard-col-min-width: var(
            --vaadin-dashboard-col-min-width,
            var(--_vaadin-dashboard-default-col-min-width)
          );
          --_vaadin-dashboard-col-max-width: var(
            --vaadin-dashboard-col-max-width,
            var(--_vaadin-dashboard-default-col-max-width)
          );

          display: grid;
          overflow: auto;

          grid-template-columns: repeat(
            auto-fill,
            minmax(var(--_vaadin-dashboard-col-min-width), var(--_vaadin-dashboard-col-max-width))
          );

          gap: var(--vaadin-dashboard-gap, 1rem);
        }

        :host([hidden]) {
          display: none !important;
        }

        ::slotted(*) {
          grid-column: span min(var(--vaadin-dashboard-item-colspan, 1), var(--_vaadin-dashboard-item-max-colspan));
        }
      `;
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this.__updateItemMaxColspan();
    }

    /**
     * @private
     */
    __updateItemMaxColspan() {
      // Temporarily set max colspan to 1
      this.style.setProperty('--_vaadin-dashboard-item-max-colspan', 1);
      // Get the effective column count with no colspans
      const columnCount = getComputedStyle(this).gridTemplateColumns.split(' ').length;
      // ...and set it as the new max colspan value
      this.style.setProperty('--_vaadin-dashboard-item-max-colspan', columnCount);
    }
  };
