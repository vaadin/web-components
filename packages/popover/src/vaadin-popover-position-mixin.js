/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing popover position functionality.
 *
 * @polymerMixin
 */
export const PopoverPositionMixin = (superClass) =>
  class PopoverPositionMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Position of the overlay with respect to the target.
         * Supported values: `top-start`, `top`, `top-end`,
         * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
         * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
         */
        position: {
          type: String,
        },

        /**
         * Default value used when `position` property is not set.
         * @protected
         */
        _position: {
          type: String,
          value: 'bottom',
        },

        /** @private */
        __effectivePosition: {
          type: String,
          computed: '__computePosition(position, _position)',
        },
      };
    }

    /** @protected */
    __computeHorizontalAlign(position) {
      return ['top-end', 'bottom-end', 'start-top', 'start', 'start-bottom'].includes(position) ? 'end' : 'start';
    }

    /** @protected */
    __computeNoHorizontalOverlap(position) {
      return ['start-top', 'start', 'start-bottom', 'end-top', 'end', 'end-bottom'].includes(position);
    }

    /** @protected */
    __computeNoVerticalOverlap(position) {
      return ['top-start', 'top-end', 'top', 'bottom-start', 'bottom', 'bottom-end'].includes(position);
    }

    /** @protected */
    __computeVerticalAlign(position) {
      return ['top-start', 'top-end', 'top', 'start-bottom', 'end-bottom'].includes(position) ? 'bottom' : 'top';
    }

    /** @private */
    __computePosition(position, defaultPosition) {
      return position || defaultPosition;
    }
  };
