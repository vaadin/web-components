/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing context menu position functionality.
 *
 * @polymerMixin
 */
export const ContextMenuPositionMixin = (superClass) =>
  class ContextMenuPositionMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Position of the overlay with respect to the target.
         * Supported values: null, `top-start`, `top`, `top-end`,
         * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
         * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
         */
        position: {
          type: String,
        },
      };
    }

    /** @protected */
    __computeHorizontalAlign(position) {
      if (!position) {
        return 'start';
      }

      return ['top-end', 'bottom-end', 'start-top', 'start', 'start-bottom'].includes(position) ? 'end' : 'start';
    }

    /** @protected */
    __computeNoHorizontalOverlap(position) {
      if (!position) {
        return !!this._positionTarget;
      }

      return ['start-top', 'start', 'start-bottom', 'end-top', 'end', 'end-bottom'].includes(position);
    }

    /** @protected */
    __computeNoVerticalOverlap(position) {
      if (!position) {
        return false;
      }

      return ['top-start', 'top-end', 'top', 'bottom-start', 'bottom', 'bottom-end'].includes(position);
    }

    /** @protected */
    __computeVerticalAlign(position) {
      if (!position) {
        return 'top';
      }

      return ['top-start', 'top-end', 'top', 'start-bottom', 'end-bottom'].includes(position) ? 'bottom' : 'top';
    }
  };
