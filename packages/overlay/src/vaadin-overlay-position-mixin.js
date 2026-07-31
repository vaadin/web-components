/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { getAncestorRootNodes } from '@vaadin/component-base/src/dom-utils.js';
import { observeMove, setOverlayStateAttribute } from './vaadin-overlay-utils.js';

const PROP_NAMES_VERTICAL = {
  start: 'top',
  end: 'bottom',
};

const PROP_NAMES_HORIZONTAL = {
  start: 'left',
  end: 'right',
};

/**
 * Returns the width of the layout viewport, which is the containing block used
 * for resolving the `left` and `right` CSS properties of the fixed positioned overlay.
 */
function getLayoutViewportWidth() {
  return Math.min(window.innerWidth, document.documentElement.clientWidth);
}

/**
 * Returns the height of the layout viewport, which is the containing block used
 * for resolving the `top` and `bottom` CSS properties of the fixed positioned overlay.
 */
function getLayoutViewportHeight() {
  return Math.min(window.innerHeight, document.documentElement.clientHeight);
}

/**
 * Returns whether the page is pinch-zoomed. The browser shrinks the visual viewport when
 * zooming in as well, but the area outside of it is only panned away instead of being
 * hidden, so the overlay should keep using the layout viewport in that case.
 */
function isPinchZoomed() {
  return window.visualViewport.scale > 1;
}

/**
 * Returns the height of the area that is visible to the user, in the same coordinate
 * space as the values returned by `getBoundingClientRect()`.
 *
 * On iOS Safari, the on-screen keyboard shifts the page up and shrinks the visual
 * viewport, while the layout viewport keeps its full height. Both `window.innerHeight`
 * and `document.documentElement.clientHeight` then describe an area that reaches below
 * the keyboard, so measuring against them treats the space behind the keyboard as free.
 *
 * The visual viewport offset is deliberately not added: client rectangles already
 * account for the shift, so adding it would cancel out the shrinking again.
 */
function getVisibleViewportHeight() {
  if (isPinchZoomed()) {
    return getLayoutViewportHeight();
  }

  return Math.min(getLayoutViewportHeight(), window.visualViewport.height);
}

/**
 * Returns the heights of the areas that are not visible to the user above and below the
 * visual viewport, e.g. covered by the on-screen keyboard, measured in the coordinate
 * space of the layout viewport.
 *
 * Unlike `getVisibleViewportHeight`, these take the visual viewport offset into account:
 * iOS Safari shifts the page to reveal the focused field, but leaves the layout viewport
 * in place, so the offset is the distance between the two coordinate spaces. The area
 * above the offset is scrolled out of view, and the one below the visual viewport is
 * covered by the keyboard.
 */
function getViewportOcclusion() {
  if (isPinchZoomed()) {
    return { top: 0, bottom: 0 };
  }

  const { height, offsetTop } = window.visualViewport;
  return {
    top: Math.max(0, offsetTop),
    bottom: Math.max(0, document.documentElement.clientHeight - (height + offsetTop)),
  };
}

const targetResizeObserver = new ResizeObserver((entries) => {
  setTimeout(() => {
    entries.forEach((entry) => {
      if (entry.target.__overlay) {
        entry.target.__overlay._updatePosition();
      }
    });
  });
});

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

        /**
         * When true, the overlay content is limited to the part of the viewport that is
         * visible to the user, so that it shrinks instead of extending into an area that
         * is covered by the on-screen keyboard.
         *
         * @attr {boolean} limit-to-visual-viewport
         */
        limitToVisualViewport: {
          type: Boolean,
          value: false,
          sync: true,
        },
      };
    }

    constructor() {
      super();

      /**
       * Used for mixin detection because `instanceof` does not work with mixins.
       */
      this._hasOverlayPositionMixin = true;

      this.__onScroll = this.__onScroll.bind(this);
      this._updatePosition = this._updatePosition.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this.opened) {
        this.__addUpdatePositionEventListeners();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__removeUpdatePositionEventListeners();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('positionTarget')) {
        const oldTarget = props.get('positionTarget');

        // Invalidate the cached content size so the next `_updatePosition` call
        // measures the overlay against the new target instead of carrying over
        // a larger size from the previous one.
        this.__oldContentWidth = undefined;
        this.__oldContentHeight = undefined;

        // 1. When position target is removed, always reset position settings
        // 2. When position target is set, reset if overlay was opened before
        if ((!this.positionTarget && oldTarget) || (this.positionTarget && !oldTarget && !!this.__margins)) {
          this.__resetPosition();
        }
      }

      if (props.has('opened') || props.has('positionTarget')) {
        this.__updatePositionSettings(this.opened, this.positionTarget);
      }

      const positionProps = [
        'horizontalAlign',
        'verticalAlign',
        'noHorizontalOverlap',
        'noVerticalOverlap',
        'requiredVerticalSpace',
        'limitToVisualViewport',
      ];
      if (positionProps.some((prop) => props.has(prop))) {
        this._updatePosition();
      }
    }

    /** @private */
    __addUpdatePositionEventListeners() {
      window.visualViewport.addEventListener('resize', this._updatePosition);
      window.visualViewport.addEventListener('scroll', this.__onScroll, true);

      this.__positionTargetAncestorRootNodes = getAncestorRootNodes(this.positionTarget);
      this.__positionTargetAncestorRootNodes.forEach((node) => {
        node.addEventListener('scroll', this.__onScroll, true);
      });

      if (this.positionTarget) {
        this.__observePositionTargetMove = observeMove(this.positionTarget, () => {
          this._updatePosition();
        });
      }
    }

    /** @private */
    __removeUpdatePositionEventListeners() {
      window.visualViewport.removeEventListener('resize', this._updatePosition);
      window.visualViewport.removeEventListener('scroll', this.__onScroll, true);

      if (this.__positionTargetAncestorRootNodes) {
        this.__positionTargetAncestorRootNodes.forEach((node) => {
          node.removeEventListener('scroll', this.__onScroll, true);
        });
        this.__positionTargetAncestorRootNodes = null;
      }

      if (this.__observePositionTargetMove) {
        this.__observePositionTargetMove();
        this.__observePositionTargetMove = null;
      }
    }

    /** @private */
    __updatePositionSettings(opened, positionTarget) {
      this.__removeUpdatePositionEventListeners();

      if (positionTarget) {
        positionTarget.__overlay = null;
        targetResizeObserver.unobserve(positionTarget);

        if (opened) {
          this.__addUpdatePositionEventListeners();
          positionTarget.__overlay = this;
          targetResizeObserver.observe(positionTarget);
        }
      }

      if (opened) {
        const computedStyle = getComputedStyle(this);
        if (!this.__margins) {
          this.__margins = {};
          ['top', 'bottom', 'left', 'right'].forEach((propName) => {
            this.__margins[propName] = parseInt(computedStyle[propName], 10);
          });
        }

        this._updatePosition();
        // Schedule another position update (to cover virtual keyboard opening for example)
        requestAnimationFrame(() => this._updatePosition());
      }
    }

    /** @private */
    __onScroll(e) {
      // If the scroll event occurred inside the overlay, ignore it.
      if (e.target instanceof Node && this._deepContains(e.target)) {
        return;
      }

      this._updatePosition();
    }

    /** @private */
    __resetPosition() {
      this.__margins = null;

      Object.assign(this.style, {
        justifyContent: '',
        alignItems: '',
        top: '',
        bottom: '',
        left: '',
        right: '',
      });

      this.style.removeProperty('--_vaadin-overlay-viewport-occlusion-top');
      this.style.removeProperty('--_vaadin-overlay-viewport-occlusion-bottom');

      setOverlayStateAttribute(this, 'bottom-aligned', false);
      setOverlayStateAttribute(this, 'top-aligned', false);
      setOverlayStateAttribute(this, 'end-aligned', false);
      setOverlayStateAttribute(this, 'start-aligned', false);
    }

    /**
     * Reduces the space available to the overlay by the height of the area that is not
     * visible to the user, so that the content shrinks instead of extending into it.
     * @private
     */
    __updateViewportOcclusion() {
      if (this.limitToVisualViewport) {
        const { top, bottom } = getViewportOcclusion();
        this.style.setProperty('--_vaadin-overlay-viewport-occlusion-top', `${top}px`);
        this.style.setProperty('--_vaadin-overlay-viewport-occlusion-bottom', `${bottom}px`);
      } else {
        this.style.removeProperty('--_vaadin-overlay-viewport-occlusion-top');
        this.style.removeProperty('--_vaadin-overlay-viewport-occlusion-bottom');
      }
    }

    _updatePosition() {
      if (!this.positionTarget || !this.opened || !this.__margins) {
        return;
      }

      const targetRect = this.positionTarget.getBoundingClientRect();

      if (targetRect.width === 0 && targetRect.height === 0 && this.opened) {
        this.opened = false;
        return;
      }

      // Apply the constraint before measuring, so that the content is measured
      // with the height it will actually get.
      this.__updateViewportOcclusion();

      // Detect the desired alignment and update the layout accordingly
      const shouldAlignStartVertically = this.__shouldAlignStartVertically(targetRect);
      this.style.justifyContent = shouldAlignStartVertically ? 'flex-start' : 'flex-end';

      const isRTL = this.__isRTL;
      const shouldAlignStartHorizontally = this.__shouldAlignStartHorizontally(targetRect, isRTL);
      const flexStart = (!isRTL && shouldAlignStartHorizontally) || (isRTL && !shouldAlignStartHorizontally);
      this.style.alignItems = flexStart ? 'flex-start' : 'flex-end';

      // Get the overlay rect after possible overlay alignment changes
      const overlayRect = this.getBoundingClientRect();

      // Obtain vertical positioning properties
      const verticalProps = this.__calculatePositionInOneDimension(
        targetRect,
        overlayRect,
        this.noVerticalOverlap,
        PROP_NAMES_VERTICAL,
        this,
        shouldAlignStartVertically,
      );

      // Obtain horizontal positioning properties
      const horizontalProps = this.__calculatePositionInOneDimension(
        targetRect,
        overlayRect,
        this.noHorizontalOverlap,
        PROP_NAMES_HORIZONTAL,
        this,
        shouldAlignStartHorizontally,
      );

      // Apply the positioning properties to the overlay
      Object.assign(this.style, verticalProps, horizontalProps);

      setOverlayStateAttribute(this, 'bottom-aligned', !shouldAlignStartVertically);
      setOverlayStateAttribute(this, 'top-aligned', shouldAlignStartVertically);

      setOverlayStateAttribute(this, 'end-aligned', !flexStart);
      setOverlayStateAttribute(this, 'start-aligned', flexStart);
    }

    __shouldAlignStartHorizontally(targetRect, rtl) {
      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentWidth = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
      this.__oldContentWidth = this.$.overlay.offsetWidth;

      const viewportWidth = getLayoutViewportWidth();
      const defaultAlignLeft = (!rtl && this.horizontalAlign === 'start') || (rtl && this.horizontalAlign === 'end');

      return this.__shouldAlignStart(
        targetRect,
        contentWidth,
        viewportWidth,
        this.__margins,
        defaultAlignLeft,
        this.noHorizontalOverlap,
        PROP_NAMES_HORIZONTAL,
      );
    }

    __shouldAlignStartVertically(targetRect) {
      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentHeight =
        this.requiredVerticalSpace || Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
      this.__oldContentHeight = this.$.overlay.offsetHeight;

      const viewportHeight = getVisibleViewportHeight();
      const defaultAlignTop = this.verticalAlign === 'top';

      return this.__shouldAlignStart(
        targetRect,
        contentHeight,
        viewportHeight,
        this.__margins,
        defaultAlignTop,
        this.noVerticalOverlap,
        PROP_NAMES_VERTICAL,
      );
    }

    // eslint-disable-next-line @typescript-eslint/max-params
    __shouldAlignStart(targetRect, contentSize, viewportSize, margins, defaultAlignStart, noOverlap, propNames) {
      const spaceForStartAlignment =
        viewportSize - targetRect[noOverlap ? propNames.end : propNames.start] - margins[propNames.end];
      const spaceForEndAlignment = targetRect[noOverlap ? propNames.start : propNames.end] - margins[propNames.start];

      const spaceForDefaultAlignment = defaultAlignStart ? spaceForStartAlignment : spaceForEndAlignment;
      const spaceForOtherAlignment = defaultAlignStart ? spaceForEndAlignment : spaceForStartAlignment;

      const shouldGoToDefaultSide =
        spaceForDefaultAlignment > spaceForOtherAlignment || spaceForDefaultAlignment > contentSize;

      return defaultAlignStart === shouldGoToDefaultSide;
    }

    /**
     * Returns an adjusted value after resizing the browser window,
     * to avoid wrong calculations when e.g. previously set `bottom`
     * CSS property value is larger than the updated viewport height.
     * See https://github.com/vaadin/web-components/issues/4604
     */
    __adjustBottomProperty(cssPropNameToSet, propNames, currentValue) {
      let adjustedProp;

      if (cssPropNameToSet === propNames.end) {
        // Adjust vertically
        if (propNames.end === PROP_NAMES_VERTICAL.end) {
          // The `bottom` property is resolved against the layout viewport, so the
          // adjustment must only compensate for changes of the layout viewport.
          const viewportHeight = getLayoutViewportHeight();

          if (currentValue > viewportHeight && this.__oldViewportHeight) {
            const heightDiff = this.__oldViewportHeight - viewportHeight;
            adjustedProp = currentValue - heightDiff;
          }

          this.__oldViewportHeight = viewportHeight;
        }

        // Adjust horizontally
        if (propNames.end === PROP_NAMES_HORIZONTAL.end) {
          const viewportWidth = getLayoutViewportWidth();

          if (currentValue > viewportWidth && this.__oldViewportWidth) {
            const widthDiff = this.__oldViewportWidth - viewportWidth;
            adjustedProp = currentValue - widthDiff;
          }

          this.__oldViewportWidth = viewportWidth;
        }
      }

      return adjustedProp;
    }

    /**
     * Returns an object with CSS position properties to set,
     * e.g. { top: "100px" }
     */
    // eslint-disable-next-line @typescript-eslint/max-params
    __calculatePositionInOneDimension(targetRect, overlayRect, noOverlap, propNames, overlay, shouldAlignStart) {
      const cssPropNameToSet = shouldAlignStart ? propNames.start : propNames.end;
      const cssPropNameToClear = shouldAlignStart ? propNames.end : propNames.start;

      const currentValue = parseFloat(overlay.style[cssPropNameToSet] || getComputedStyle(overlay)[cssPropNameToSet]);
      const adjustedValue = this.__adjustBottomProperty(cssPropNameToSet, propNames, currentValue);

      const diff =
        overlayRect[shouldAlignStart ? propNames.start : propNames.end] -
        targetRect[noOverlap === shouldAlignStart ? propNames.end : propNames.start];

      const valueToSet = adjustedValue
        ? `${adjustedValue}px`
        : `${currentValue + diff * (shouldAlignStart ? -1 : 1)}px`;

      return {
        [cssPropNameToSet]: valueToSet,
        [cssPropNameToClear]: '',
      };
    }
  };
