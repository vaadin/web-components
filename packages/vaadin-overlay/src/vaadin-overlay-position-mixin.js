/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @polymerMixin
 */
export const _PositionMixin = (superClass) =>
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
          value: null
        },

        /**
         * When `positionTarget` is set, this property defines whether to align the overlay's
         * left or right side to the target element by default.
         * Possible values are `start` and `end`.
         * RTL is taken into account when interpreting the value.
         * The overlay is automatically flipped to the opposite side when it doesn't fit into
         * the default side defined by this property.
         */
        horizontalAlign: {
          type: String,
          value: 'start'
        },

        /**
         * When `positionTarget` is set, this property defines whether to align the overlay's
         * top or bottom side to the target element by default.
         * Possible values are `top` and `bottom`.
         * The overlay is automatically flipped to the opposite side when it doesn't fit into
         * the default side defined by this property.
         */
        verticalAlign: {
          type: String,
          value: 'top'
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the x-axis, or be positioned right next to it.
         */
        noHorizontalOverlap: {
          type: Boolean,
          value: false
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the y-axis, or be positioned right above/below it.
         */
        noVerticalOverlap: {
          type: Boolean,
          value: false
        }
      };
    }
    static get observers() {
      return [
        `__positionSettingsChanged(positionTarget, horizontalAlign, verticalAlign,
      noHorizontalOverlap, noVerticalOverlap)`
      ];
    }

    constructor() {
      super();

      const boundUpdatePosition = this._updatePosition.bind(this);

      this.addEventListener('opened-changed', (e) => {
        const func = e.detail.value ? 'addEventListener' : 'removeEventListener';
        window[func]('scroll', boundUpdatePosition);
        window[func]('resize', boundUpdatePosition);

        if (e.detail.value) {
          this._updatePosition();
        }
      });
    }

    ready() {
      super.ready();

      console.warn('PositionMixin is not considered stable and might change any time');
    }

    __positionSettingsChanged() {
      this._updatePosition();
    }

    _updatePosition() {
      if (!this.positionTarget) {
        return;
      }
      const computedStyle = getComputedStyle(this);
      if (!this.__margins) {
        this.__margins = {};
        ['top', 'bottom', 'left', 'right'].forEach((propName) => {
          this.__margins[propName] = parseInt(computedStyle[propName], 10);
        });
      }
      const rtl = computedStyle.direction === 'rtl';

      const targetRect = this.positionTarget.getBoundingClientRect();

      const horizontalProps = this.__calculateHorizontalPosition(targetRect, rtl);
      const verticalProps = this.__calculateVerticalPosition(targetRect);

      const positionProps = Object.assign({}, horizontalProps, verticalProps);
      this.__doSetPosition(positionProps, rtl);
    }

    __calculateHorizontalPosition(targetRect, rtl) {
      const propNames = {
        start: 'left',
        end: 'right'
      };

      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentWidth = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
      this.__oldContentWidth = this.$.overlay.offsetWidth;

      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      const defaultAlignLeft = (!rtl && this.horizontalAlign === 'start') || (rtl && this.horizontalAlign === 'end');
      const currentAlignLeft = !!this.style.left;
      return PositionMixin.__calculatePositionInOneDimension(
        targetRect,
        contentWidth,
        viewportWidth,
        this.__margins,
        defaultAlignLeft,
        currentAlignLeft,
        this.noHorizontalOverlap,
        propNames
      );
    }

    __calculateVerticalPosition(targetRect) {
      const propNames = {
        start: 'top',
        end: 'bottom'
      };

      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentHeight = Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
      this.__oldContentHeight = this.$.overlay.offsetHeight;

      const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
      const defaultAlignTop = this.verticalAlign === 'top';
      const currentAlignTop = !!this.style.top;
      return PositionMixin.__calculatePositionInOneDimension(
        targetRect,
        contentHeight,
        viewportHeight,
        this.__margins,
        defaultAlignTop,
        currentAlignTop,
        this.noVerticalOverlap,
        propNames
      );
    }

    /**
     * Returns an object with CSS position properties to set,
     * e.g. { top: "100px", bottom: "" }
     */
    static __calculatePositionInOneDimension(
      targetRect,
      contentSize,
      viewportSize,
      margins,
      defaultAlignStart,
      currentAlignStart,
      noOverlap,
      propNames
    ) {
      const spaceForStartAlignment =
        viewportSize - targetRect[noOverlap ? propNames.end : propNames.start] - margins[propNames.end];
      const spaceForEndAlignment = targetRect[noOverlap ? propNames.start : propNames.end] - margins[propNames.start];

      const spaceForDefaultAlignment = defaultAlignStart ? spaceForStartAlignment : spaceForEndAlignment;
      const spaceForOtherAlignment = defaultAlignStart ? spaceForEndAlignment : spaceForStartAlignment;

      const shouldGoToDefaultSide =
        spaceForDefaultAlignment > spaceForOtherAlignment || spaceForDefaultAlignment > contentSize;

      const shouldAlignStart = defaultAlignStart === shouldGoToDefaultSide;

      const cssPropNameToSet = shouldAlignStart ? propNames.start : propNames.end;
      const cssPropNameToClear = shouldAlignStart ? propNames.end : propNames.start;

      const cssPropValueToSet =
        (shouldAlignStart
          ? targetRect[noOverlap ? propNames.end : propNames.start]
          : viewportSize - targetRect[noOverlap ? propNames.start : propNames.end]) + 'px';

      const props = {};
      props[cssPropNameToSet] = cssPropValueToSet;
      props[cssPropNameToClear] = '';
      return props;
    }

    __doSetPosition(cssProps, rtl) {
      Object.assign(this.style, cssProps);

      const alignStart = (!rtl && cssProps.left) || (rtl && cssProps.right);
      this.style.alignItems = alignStart ? 'flex-start' : 'flex-end';

      this.style.justifyContent = cssProps.top ? 'flex-start' : 'flex-end';
    }
  };
