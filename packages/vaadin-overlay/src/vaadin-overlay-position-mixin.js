/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { getAncestorRootNodes } from '@vaadin/component-base/src/dom-utils.js';

const PROP_NAMES_VERTICAL = {
  start: 'top',
  end: 'bottom',
};

const PROP_NAMES_HORIZONTAL = {
  start: 'left',
  end: 'right',
};

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
          value: 'start',
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
          value: 'top',
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the x-axis, or be positioned right next to it.
         */
        noHorizontalOverlap: {
          type: Boolean,
          value: false,
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the y-axis, or be positioned right above/below it.
         */
        noVerticalOverlap: {
          type: Boolean,
          value: false,
        },
      };
    }

    static get observers() {
      return [
        '__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap)',
        '__overlayOpenedChanged(opened, positionTarget)',
      ];
    }

    constructor() {
      super();

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

    /** @private */
    __addUpdatePositionEventListeners() {
      window.addEventListener('resize', this._updatePosition);

      this.__positionTargetAncestorRootNodes = getAncestorRootNodes(this.positionTarget);
      this.__positionTargetAncestorRootNodes.forEach((node) => {
        node.addEventListener('scroll', this.__onScroll, true);
      });
    }

    /** @private */
    __removeUpdatePositionEventListeners() {
      window.removeEventListener('resize', this._updatePosition);

      if (this.__positionTargetAncestorRootNodes) {
        this.__positionTargetAncestorRootNodes.forEach((node) => {
          node.removeEventListener('scroll', this.__onScroll, true);
        });
        this.__positionTargetAncestorRootNodes = null;
      }
    }

    /** @private */
    __overlayOpenedChanged(opened, positionTarget) {
      this.__removeUpdatePositionEventListeners();

      if (opened && positionTarget) {
        this.__addUpdatePositionEventListeners();
      }

      if (opened) {
        const computedStyle = getComputedStyle(this);
        if (!this.__margins) {
          this.__margins = {};
          ['top', 'bottom', 'left', 'right'].forEach((propName) => {
            this.__margins[propName] = parseInt(computedStyle[propName], 10);
          });
        }
        this.setAttribute('dir', computedStyle.direction);

        this._updatePosition();
        // Schedule another position update (to cover virtual keyboard opening for example)
        requestAnimationFrame(() => this._updatePosition());
      }
    }

    get __isRTL() {
      return this.getAttribute('dir') === 'rtl';
    }

    __positionSettingsChanged() {
      this._updatePosition();
    }

    /** @private */
    __onScroll(e) {
      // If the scroll event occurred inside the overlay, ignore it.
      if (!this.contains(e.target)) {
        this._updatePosition();
      }
    }

    _updatePosition() {
      if (!this.positionTarget || !this.opened) {
        return;
      }

      const targetRect = this.positionTarget.getBoundingClientRect();

      // Detect the desired alignment and update the layout accordingly
      const shouldAlignStartVertically = this.__shouldAlignStartVertically(targetRect);
      this.style.justifyContent = shouldAlignStartVertically ? 'flex-start' : 'flex-end';

      const shouldAlignStartHorizontally = this.__shouldAlignStartHorizontally(targetRect, this.__isRTL);
      const flexStart =
        (!this.__isRTL && shouldAlignStartHorizontally) || (this.__isRTL && !shouldAlignStartHorizontally);
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

      this.toggleAttribute('bottom-aligned', !shouldAlignStartVertically);
      this.toggleAttribute('top-aligned', shouldAlignStartVertically);

      this.toggleAttribute('end-aligned', !flexStart);
      this.toggleAttribute('start-aligned', flexStart);
    }

    __shouldAlignStartHorizontally(targetRect, rtl) {
      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentWidth = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
      this.__oldContentWidth = this.$.overlay.offsetWidth;

      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
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
      const contentHeight = Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
      this.__oldContentHeight = this.$.overlay.offsetHeight;

      const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
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

    // eslint-disable-next-line max-params
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
     * Returns an object with CSS position properties to set,
     * e.g. { top: "100px", bottom: "" }
     */
    // eslint-disable-next-line max-params
    __calculatePositionInOneDimension(targetRect, overlayRect, noOverlap, propNames, overlay, shouldAlignStart) {
      const cssPropNameToSet = shouldAlignStart ? propNames.start : propNames.end;
      const cssPropNameToClear = shouldAlignStart ? propNames.end : propNames.start;

      const currentValue = parseFloat(overlay.style[cssPropNameToSet] || getComputedStyle(overlay)[cssPropNameToSet]);

      const diff =
        overlayRect[shouldAlignStart ? propNames.start : propNames.end] -
        targetRect[noOverlap === shouldAlignStart ? propNames.end : propNames.start];

      return {
        [cssPropNameToSet]: `${currentValue + diff * (shouldAlignStart ? -1 : 1)}px`,
        [cssPropNameToClear]: '',
      };
    }
  };
