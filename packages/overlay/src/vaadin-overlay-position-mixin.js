/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayPositionManager } from './vaadin-overlay-position-manager.js';

/**
 * @polymerMixin
 */
export const PositionMixin = (superClass) =>
  class PositionMixin extends superClass {
    static get properties() {
      return {
        /**
         * The element next to which this overlay should be aligned.
         * The position of the overlay relative to the positionTarget can be adjusted
         * with properties `horizontalAlign`, `verticalAlign`, `noHorizontalOverlap`
         * and `noVerticalOverlap`.
         */
        positionTarget: {
          type: Object,
          value: null,
          sync: true,
        },

        /**
         * When `positionTarget` is set, this property defines whether to align the overlay's
         * left or right side to the target element by default.
         * Possible values are `start` and `end`.
         * RTL is taken into account when interpreting the value.
         * The overlay is automatically flipped to the opposite side when it doesn't fit into
         * the default side defined by this property.
         *
         * @attr {start|end} horizontal-align
         */
        horizontalAlign: {
          type: String,
          value: 'start',
          sync: true,
        },

        /**
         * When `positionTarget` is set, this property defines whether to align the overlay's
         * top or bottom side to the target element by default.
         * Possible values are `top` and `bottom`.
         * The overlay is automatically flipped to the opposite side when it doesn't fit into
         * the default side defined by this property.
         *
         * @attr {top|bottom} vertical-align
         */
        verticalAlign: {
          type: String,
          value: 'top',
          sync: true,
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the x-axis, or be positioned right next to it.
         *
         * @attr {boolean} no-horizontal-overlap
         */
        noHorizontalOverlap: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the y-axis, or be positioned right above/below it.
         *
         * @attr {boolean} no-vertical-overlap
         */
        noVerticalOverlap: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * If the overlay content has no intrinsic height, this property can be used to set
         * the minimum vertical space (in pixels) required by the overlay. Setting a value to
         * the property effectively disables the content measurement in favor of using this
         * fixed value for determining the open direction.
         *
         * @attr {number} required-vertical-space
         */
        requiredVerticalSpace: {
          type: Number,
          value: 0,
          sync: true,
        },
      };
    }

    static get observers() {
      return [
        '__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)',
        '__overlayOpenedChanged(opened, positionTarget)',
      ];
    }

    constructor() {
      super();

      this._manager = new OverlayPositionManager(this);
    }

    /** @private */
    __overlayOpenedChanged(opened, target) {
      this._manager.setState({ opened, target });
    }

    /** @private */
    __positionSettingsChanged(
      horizontalAlign,
      verticalAlign,
      noHorizontalOverlap,
      noVerticalOverlap,
      requiredVerticalSpace,
    ) {
      this._manager.setState({
        horizontalAlign,
        verticalAlign,
        noHorizontalOverlap,
        noVerticalOverlap,
        requiredVerticalSpace,
      });
    }
  };
