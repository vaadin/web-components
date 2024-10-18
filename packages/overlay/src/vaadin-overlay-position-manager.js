/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { getAncestorRootNodes } from '@vaadin/component-base/src/dom-utils.js';
import { observeMove } from './vaadin-overlay-utils.js';

const PROP_NAMES_VERTICAL = {
  start: 'top',
  end: 'bottom',
};

const PROP_NAMES_HORIZONTAL = {
  start: 'left',
  end: 'right',
};

const targets = new WeakMap();

const targetResizeObserver = new ResizeObserver((entries) => {
  setTimeout(() => {
    entries.forEach((entry) => {
      if (targets.has(entry.target)) {
        targets.get(entry.target).updatePosition();
      }
    });
  });
});

class OverlayPositionController {
  constructor(host, manager) {
    this.host = host;
    this.manager = manager;
  }

  /** @override */
  hostConnected() {
    if (this.manager.opened) {
      this.manager.addListeners();
    }
  }

  hostDisconnected() {
    this.manager.removeListeners();
  }
}

/**
 * Class to manage overlay position properties
 */
export class OverlayPositionManager extends EventTarget {
  constructor(overlay, host) {
    super();

    /**
     * Reference to the overlay element that will be positioned.
     *
     * @type HTMLElement
     */
    this.overlay = overlay;

    /**
     * Reference to the overlay host - either the overlay itself
     * or the DOM host when using `nativePopover` Lit directive.
     * Used to reset `opened` when target is no longer visible.
     *
     * @type HTMLElement
     */
    this.host = host || overlay;

    this.target = null;

    const controller = new OverlayPositionController(this.host, this);
    this.host.addController(controller);

    this.__boundOnScroll = this.__onScroll.bind(this);
    this.__boundOnResize = this.__onResize.bind(this);
  }

  get content() {
    // TODO: consider passing content wrapper element separately
    return this.overlay.$ ? this.overlay.$.overlay : this.overlay;
  }

  /**
   * Set properties to change overlay opened state, target or position.
   */
  setState(props) {
    const hasChanged = (key) => props[key] !== undefined && props[key] !== this[key];

    const openedOrTargetChanged = hasChanged('opened') || hasChanged('target');

    const positionPropertiesChanged =
      hasChanged('noHorizontalOverlap') ||
      hasChanged('noVerticalOverlap') ||
      hasChanged('horizontalAlign') ||
      hasChanged('verticalAlign') ||
      hasChanged('requiredVerticalSpace');

    Object.entries(props).forEach(([name, value]) => {
      this[name] = value;
    });

    if (openedOrTargetChanged) {
      this.removeListeners();

      if (this.target) {
        targets.delete(this.target);
        targetResizeObserver.unobserve(this.target);

        if (this.opened) {
          this.addListeners();
          targets.set(this.target, this);
          targetResizeObserver.observe(this.target);
        }
      }

      if (this.opened) {
        if (!this.__margins) {
          this.__margins = {};
          const computedStyle = getComputedStyle(this.overlay);
          ['top', 'bottom', 'left', 'right'].forEach((propName) => {
            this.__margins[propName] = parseInt(computedStyle[propName], 10);
          });
        }

        this.updatePosition();
        // Schedule another position update (to cover virtual keyboard opening for example)
        requestAnimationFrame(() => this.updatePosition());
      }
    }

    if (positionPropertiesChanged) {
      this.updatePosition();
    }
  }

  /**
   * Add listeners to observe scroll, resize, target resize and move.
   */
  addListeners() {
    window.visualViewport.addEventListener('resize', this.__boundOnResize);
    window.visualViewport.addEventListener('scroll', this.__boundOnScroll, true);

    this.__positionTargetAncestorRootNodes = getAncestorRootNodes(this.target);
    this.__positionTargetAncestorRootNodes.forEach((node) => {
      node.addEventListener('scroll', this.__boundOnScroll, true);
    });

    if (this.target) {
      this.__observePositionTargetMove = observeMove(this.target, () => {
        this.updatePosition();
      });
    }
  }

  /**
   * Remove listeners to observe scroll, resize, target resize and move.
   */
  removeListeners() {
    window.visualViewport.removeEventListener('resize', this.__boundOnResize);
    window.visualViewport.removeEventListener('scroll', this.__boundOnScroll, true);

    if (this.__positionTargetAncestorRootNodes) {
      this.__positionTargetAncestorRootNodes.forEach((node) => {
        node.removeEventListener('scroll', this.__boundOnScroll, true);
      });
      this.__positionTargetAncestorRootNodes = null;
    }

    if (this.__observePositionTargetMove) {
      this.__observePositionTargetMove();
      this.__observePositionTargetMove = null;
    }
  }

  /**
   * Update the overlay position to align next to the target,
   * or close the overlay if the target is no longer visible.
   */
  updatePosition() {
    const { host, opened, overlay, target } = this;

    if (!target || !opened || !this.__margins) {
      return;
    }

    const targetRect = target.getBoundingClientRect();

    if (targetRect.width === 0 && targetRect.height === 0) {
      host.opened = false;
      return;
    }

    // Detect the desired alignment and update the layout accordingly
    const shouldAlignStartVertically = this.__shouldAlignStartVertically(targetRect);
    overlay.style.justifyContent = shouldAlignStartVertically ? 'flex-start' : 'flex-end';

    const isRTL = overlay.getAttribute('dir') === 'rtl';
    const shouldAlignStartHorizontally = this.__shouldAlignStartHorizontally(targetRect, isRTL);
    const flexStart = (!isRTL && shouldAlignStartHorizontally) || (isRTL && !shouldAlignStartHorizontally);
    overlay.style.alignItems = flexStart ? 'flex-start' : 'flex-end';

    // Get the overlay rect after possible overlay alignment changes
    const overlayRect = overlay.getBoundingClientRect();

    // Obtain vertical positioning properties
    const verticalProps = this.__calculatePositionInOneDimension(
      targetRect,
      overlayRect,
      this.noVerticalOverlap,
      PROP_NAMES_VERTICAL,
      overlay,
      shouldAlignStartVertically,
    );

    // Obtain horizontal positioning properties
    const horizontalProps = this.__calculatePositionInOneDimension(
      targetRect,
      overlayRect,
      this.noHorizontalOverlap,
      PROP_NAMES_HORIZONTAL,
      overlay,
      shouldAlignStartHorizontally,
    );

    // Apply the positioning properties to the overlay
    Object.assign(overlay.style, verticalProps, horizontalProps);

    // Toggle state attributes on the host to make styling native popover easier
    host.toggleAttribute('bottom-aligned', !shouldAlignStartVertically);
    host.toggleAttribute('top-aligned', shouldAlignStartVertically);

    host.toggleAttribute('end-aligned', !flexStart);
    host.toggleAttribute('start-aligned', flexStart);

    this.dispatchEvent(new Event('position-changed'));
  }

  /** @private */
  __shouldAlignStartHorizontally(targetRect, rtl) {
    // Using previous size to fix a case where window resize may cause the overlay to be squeezed
    // smaller than its current space before the fit-calculations.
    const contentWidth = Math.max(this.__oldContentWidth || 0, this.content.offsetWidth);
    this.__oldContentWidth = this.content.offsetWidth;

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

  /** @private */
  __shouldAlignStartVertically(targetRect) {
    // Using previous size to fix a case where window resize may cause the overlay to be squeezed
    // smaller than its current space before the fit-calculations.
    const contentHeight =
      this.requiredVerticalSpace || Math.max(this.__oldContentHeight || 0, this.content.offsetHeight);
    this.__oldContentHeight = this.content.offsetHeight;

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
   * @private
   */
  __adjustBottomProperty(cssPropNameToSet, propNames, currentValue) {
    let adjustedProp;

    if (cssPropNameToSet === propNames.end) {
      // Adjust horizontally
      if (propNames.end === PROP_NAMES_VERTICAL.end) {
        const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);

        if (currentValue > viewportHeight && this.__oldViewportHeight) {
          const heightDiff = this.__oldViewportHeight - viewportHeight;
          adjustedProp = currentValue - heightDiff;
        }

        this.__oldViewportHeight = viewportHeight;
      }

      // Adjust vertically
      if (propNames.end === PROP_NAMES_HORIZONTAL.end) {
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

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
   * @private
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

    const valueToSet = adjustedValue ? `${adjustedValue}px` : `${currentValue + diff * (shouldAlignStart ? -1 : 1)}px`;

    return {
      [cssPropNameToSet]: valueToSet,
      [cssPropNameToClear]: '',
    };
  }

  /** @private */
  __onScroll(e) {
    // If the scroll event occurred inside the overlay, ignore it.
    if (e.target instanceof Node && this.overlay.contains(e.target)) {
      return;
    }

    this.updatePosition();
  }

  /** @private */
  __onResize() {
    this.updatePosition();
  }
}
