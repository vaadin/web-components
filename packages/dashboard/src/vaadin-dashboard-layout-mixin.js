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

          /* Effective max column count */
          --_vaadin-dashboard-col-max-count: var(--vaadin-dashboard-col-max-count, infinity);

          /* Effective column count */
          --_vaadin-dashboard-effective-col-count: min(
            var(--_vaadin-dashboard-col-count),
            var(--_vaadin-dashboard-col-max-count)
          );

          display: grid;
          overflow: auto;

          grid-template-columns: repeat(
            var(--_vaadin-dashboard-effective-col-count, auto-fill),
            minmax(var(--_vaadin-dashboard-col-min-width), var(--_vaadin-dashboard-col-max-width))
          );

          gap: var(--vaadin-dashboard-gap, 1rem);
        }

        :host([hidden]) {
          display: none !important;
        }

        ::slotted(*) {
          --_vaadin-dashboard-item-column: span
            min(
              var(--vaadin-dashboard-item-colspan, 1),
              var(--_vaadin-dashboard-effective-col-count, var(--_vaadin-dashboard-col-count))
            );

          grid-column: var(--_vaadin-dashboard-item-column);
        }
      `;
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this.__updateColumnCount();
    }

    /**
     * @private
     */
    __updateColumnCount() {
      // Clear the previously computed column count
      this.style.removeProperty('--_vaadin-dashboard-col-count');
      // Get the column count (with no colspans etc in effect)...
      const columnCount = getComputedStyle(this).gridTemplateColumns.split(' ').length;
      // ...and set it as the new value
      this.style.setProperty('--_vaadin-dashboard-col-count', columnCount);
    }
  };
