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
          overflow: auto;
          box-sizing: border-box;
          width: 100%;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([dense-layout]) #grid {
          grid-auto-flow: dense;
        }

        #grid {
          box-sizing: border-box;

          /* Padding around dashboard edges */
          --_default-padding: 1rem;
          --_padding: max(0px, var(--vaadin-dashboard-padding, var(--_default-padding)));
          padding: var(--_padding);

          /* Gap between widgets */
          --_default-gap: 1rem;
          --_gap: max(0px, var(--vaadin-dashboard-gap, var(--_default-gap)));
          gap: var(--_gap);

          /* Default min and max column widths */
          --_default-col-min-width: 25rem;
          --_default-col-max-width: 1fr;

          /* Effective min and max column widths */
          --_col-min-width: var(--vaadin-dashboard-col-min-width, var(--_default-col-min-width));
          --_col-max-width: var(--vaadin-dashboard-col-max-width, var(--_default-col-max-width));

          /* Effective max column count */
          --_col-max-count: var(--vaadin-dashboard-col-max-count, var(--_col-count));

          /* Effective column count */
          --_effective-col-count: min(var(--_col-count), var(--_col-max-count));

          /* Default row min height */
          --_default-row-min-height: 12rem;
          /* Effective row min height */
          --_row-min-height: var(--vaadin-dashboard-row-min-height, var(--_default-row-min-height));
          /* Effective row height */
          --_row-height: minmax(var(--_row-min-height, auto), auto);

          display: grid;
          overflow: hidden;
          min-width: calc(var(--_col-min-width) + var(--_padding) * 2);

          grid-template-columns: repeat(
            var(--_effective-col-count, auto-fill),
            minmax(var(--_col-min-width), var(--_col-max-width))
          );

          grid-auto-rows: var(--_row-height);
        }

        ::slotted(*) {
          /* The grid-column value applied to children */
          --_item-column: span
            min(var(--vaadin-dashboard-widget-colspan, 1), var(--_effective-col-count, var(--_col-count)));

          grid-column: var(--_item-column);

          /* The grid-row value applied to children */
          --_item-row: span var(--vaadin-dashboard-widget-rowspan, 1);
          grid-row: var(--_item-row);
        }
      `;
    }

    static get properties() {
      return {
        /**
         * Whether the dashboard layout is dense.
         *
         * @attr {boolean} dense-layout
         * @type {boolean}
         */
        denseLayout: {
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
      this.$.grid.style.removeProperty('--_col-count');
      // Get the column count (with no colspans etc in effect)...
      const columnCount = getComputedStyle(this.$.grid).gridTemplateColumns.split(' ').length;
      // ...and set it as the new value
      this.$.grid.style.setProperty('--_col-count', columnCount);
    }
  };
