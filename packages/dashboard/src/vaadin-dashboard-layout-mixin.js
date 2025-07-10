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

/**
 * A mixin to enable the dashboard layout functionality
 *
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const DashboardLayoutMixin = (superClass) =>
  class DashboardLayoutMixinClass extends ResizeMixin(superClass) {
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
