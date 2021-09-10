/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
      noHorizontalOverlap, noVerticalOverlap)`,
        `__overlayOpenedChanged(opened)`
      ];
    }

    constructor() {
      super();

      this.__boundUpdatePosition = this._updatePosition.bind(this);
    }

    __overlayOpenedChanged(opened) {
      if (opened) {
        window.addEventListener('scroll', this.__boundUpdatePosition);
        window.addEventListener('resize', this.__boundUpdatePosition);
      } else {
        window.removeEventListener('scroll', this.__boundUpdatePosition);
        window.removeEventListener('resize', this.__boundUpdatePosition);
      }

      if (opened) {
        const computedStyle = getComputedStyle(this);
        if (!this.__margins) {
          this.__margins = {};
          ['top', 'bottom', 'left', 'right'].forEach((propName) => {
            this.__margins[propName] = parseInt(computedStyle[propName], 10);
          });
        }
        this.__isRTL = computedStyle.direction === 'rtl';

        this._updatePosition();
        requestAnimationFrame(() => {
          this._updatePosition();
        });
      }
    }

    __positionSettingsChanged() {
      this._updatePosition();
    }

    _updatePosition() {
      if (!this.positionTarget || !this.opened) {
        return;
      }

      const overlayRect = this.$.overlay.getBoundingClientRect();
      const targetRect = this.positionTarget.getBoundingClientRect();

      const horizontalProps = this.__calculateHorizontalPosition(overlayRect, targetRect, this.__isRTL);
      const verticalProps = this.__calculateVerticalPosition(overlayRect, targetRect);

      const positionProps = Object.assign({}, verticalProps, horizontalProps);

      const alignItemsBefore = this.style.alignItems;
      const justifyContentBefore = this.style.justifyContent;

      this.__doSetPosition(positionProps, this.__isRTL);

      if (alignItemsBefore !== this.style.alignItems || justifyContentBefore !== this.style.justifyContent) {
        // TODO: Unclean. Preferably 1. detect and apply the desired align/justify 2. calculate the position for overlay
        this._updatePosition();
      }
    }

    __calculateHorizontalPosition(overlayRect, targetRect, rtl) {
      const propNames = {
        start: 'left',
        end: 'right'
      };

      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentWidth = Math.max(this.__oldContentWidth || 0, overlayRect.width);
      this.__oldContentWidth = overlayRect.width;

      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      const defaultAlignLeft = (!rtl && this.horizontalAlign === 'start') || (rtl && this.horizontalAlign === 'end');
      const currentAlignLeft = !!this.style.left;
      return PositionMixin.__calculatePositionInOneDimension(
        targetRect,
        overlayRect,
        contentWidth,
        viewportWidth,
        this.__margins,
        defaultAlignLeft,
        currentAlignLeft,
        this.noHorizontalOverlap,
        propNames,
        this
      );
    }

    __calculateVerticalPosition(overlayRect, targetRect) {
      const propNames = {
        start: 'top',
        end: 'bottom'
      };

      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentHeight = Math.max(this.__oldContentHeight || 0, overlayRect.height);
      this.__oldContentHeight = overlayRect.height;

      const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
      const defaultAlignTop = this.verticalAlign === 'top';
      const currentAlignTop = !!this.style.top;
      return PositionMixin.__calculatePositionInOneDimension(
        targetRect,
        overlayRect,
        contentHeight,
        viewportHeight,
        this.__margins,
        defaultAlignTop,
        currentAlignTop,
        this.noVerticalOverlap,
        propNames,
        this
      );
    }

    /**
     * Returns an object with CSS position properties to set,
     * e.g. { top: "100px", bottom: "" }
     */
    static __calculatePositionInOneDimension(
      targetRect,
      overlayRect,
      contentSize,
      viewportSize,
      margins,
      defaultAlignStart,
      currentAlignStart,
      noOverlap,
      propNames,
      overlay
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

      const currentValue = parseFloat(overlay.style[cssPropNameToSet] || getComputedStyle(overlay)[cssPropNameToSet]);

      const diff =
        overlayRect[shouldAlignStart ? propNames.start : propNames.end] -
        targetRect[noOverlap === shouldAlignStart ? propNames.end : propNames.start];

      const props = {};
      props[cssPropNameToSet] = currentValue + diff * (shouldAlignStart ? -1 : 1) + 'px';
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
