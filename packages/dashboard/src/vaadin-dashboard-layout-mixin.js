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
          display: block;
          overflow: hidden;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([dense]) #grid {
          grid-auto-flow: dense;
        }

        #grid {
          box-sizing: border-box;
          padding: 20px;

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
          --_vaadin-dashboard-col-max-count: var(--vaadin-dashboard-col-max-count, var(--_vaadin-dashboard-col-count));

          /* Effective column count */
          --_vaadin-dashboard-effective-col-count: min(
            var(--_vaadin-dashboard-col-count),
            var(--_vaadin-dashboard-col-max-count)
          );

          /* Effective row height */
          --_vaadin-dashboard-row-height: minmax(var(--vaadin-dashboard-row-min-height, auto), auto);

          display: grid;
          overflow: auto;
          height: 100%;

          grid-template-columns: repeat(
            var(--_vaadin-dashboard-effective-col-count, auto-fill),
            minmax(var(--_vaadin-dashboard-col-min-width), var(--_vaadin-dashboard-col-max-width))
          );

          grid-auto-rows: var(--_vaadin-dashboard-row-height);

          gap: var(--vaadin-dashboard-gap, 1rem);
        }

        ::slotted(*) {
          /* The grid-column value applied to children */
          --_vaadin-dashboard-item-column: span
            min(
              var(--vaadin-dashboard-item-colspan, 1),
              var(--_vaadin-dashboard-effective-col-count, var(--_vaadin-dashboard-col-count))
            );

          grid-column: var(--_vaadin-dashboard-item-column);

          /* The grid-row value applied to children */
          --_vaadin-dashboard-item-row: span var(--vaadin-dashboard-item-rowspan, 1);
          grid-row: var(--_vaadin-dashboard-item-row);
        }
      `;
    }

    static get properties() {
      return {
        /**
         * Whether the dashboard layout is dense.
         * @type {boolean}
         */
        dense: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();
      // Avoid flickering on the initial render
      this._onResize();
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      // Update the grid width to match the host width. This is done programmatically to avoid
      // flickering due to the asynchronous nature of ResizeObserver.
      this.$.grid.style.width = `${this.offsetWidth}px`;
      this.__updateColumnCount();
    }

    /**
     * @private
     */
    __updateColumnCount() {
      // Clear the previously computed column count
      this.$.grid.style.removeProperty('--_vaadin-dashboard-col-count');
      // Get the column count (with no colspans etc in effect)...
      const columnCount = getComputedStyle(this.$.grid).gridTemplateColumns.split(' ').length;
      // ...and set it as the new value
      this.$.grid.style.setProperty('--_vaadin-dashboard-col-count', columnCount);
    }
  };
