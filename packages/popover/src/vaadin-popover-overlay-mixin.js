/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * A mixin providing common popover overlay functionality.
 *
 * @polymerMixin
 * @mixes PositionMixin
 * @mixes OverlayMixin
 */
export const PopoverOverlayMixin = (superClass) =>
  class PopoverOverlayMixinClass extends PositionMixin(OverlayMixin(superClass)) {
    static get properties() {
      return {
        position: {
          type: String,
          reflectToAttribute: true,
        },
      };
    }

    /**
     * @protected
     * @override
     */
    _updatePosition() {
      super._updatePosition();

      if (!this.positionTarget || !this.opened) {
        return;
      }

      this.removeAttribute('arrow-centered');

      // Clear any previous arrow positioning
      const arrow = this.__getArrow();
      if (arrow) {
        arrow.style.insetInlineStart = '';
      }

      const targetRect = this.__getTargetRect();
      const overlayRect = this.__getOverlayRect();

      // Center the overlay horizontally
      if (this.position === 'bottom' || this.position === 'top') {
        const offset = targetRect.width / 2 - overlayRect.width / 2;
        if (this.style.left) {
          const left = overlayRect.left + offset;
          this.__updateLeft(left, targetRect, overlayRect, true);
        }
        if (this.style.right) {
          const right = parseFloat(this.style.right) + offset;
          const centeredOverlayLeft = overlayRect.left - offset;
          this.__updateRight(right, centeredOverlayLeft, targetRect, overlayRect, true);
        }
      }

      // Constrain aligned horizontal positions to viewport
      if (
        this.position === 'bottom-start' ||
        this.position === 'top-start' ||
        this.position === 'bottom-end' ||
        this.position === 'top-end'
      ) {
        if (this.style.left) {
          const left = overlayRect.left;
          this.__updateLeft(left, targetRect, overlayRect, false);
        }
        if (this.style.right) {
          const right = parseFloat(this.style.right);
          this.__updateRight(right, overlayRect.left, targetRect, overlayRect, false);
        }
      }

      // Constrain vertically centered positions (start, end)
      if (this.position === 'start' || this.position === 'end') {
        const offset = targetRect.height / 2 - overlayRect.height / 2;
        const top = overlayRect.top + offset;
        this.__updateTop(top, targetRect, overlayRect, true);
      }

      // Constrain vertically aligned positions (start-top, end-top, start-bottom, end-bottom)
      if (
        this.position === 'start-top' ||
        this.position === 'end-top' ||
        this.position === 'start-bottom' ||
        this.position === 'end-bottom'
      ) {
        const top = overlayRect.top;
        this.__updateTop(top, targetRect, overlayRect, false);
      }
    }

    /** @private */
    __updateRight(right, centeredOverlayLeft, targetRect, overlayRect, isCentered) {
      if (centeredOverlayLeft < 0) {
        right += centeredOverlayLeft;
        this.__repositionArrow(targetRect);
      } else {
        const viewportWidth = this.__getViewportWidth();
        if (centeredOverlayLeft + overlayRect.width > viewportWidth) {
          right += centeredOverlayLeft + overlayRect.width - viewportWidth;
          this.__repositionArrow(targetRect);
        } else if (isCentered) {
          this.setAttribute('arrow-centered', '');
        }
      }

      this.style.right = `${right}px`;
    }

    /** @private */
    __updateLeft(left, targetRect, overlayRect, isCentered) {
      if (left < 0) {
        left = 0;
        this.__repositionArrow(targetRect);
      } else {
        const viewportWidth = this.__getViewportWidth();
        if (left + overlayRect.width > viewportWidth) {
          left = viewportWidth - overlayRect.width;
          this.__repositionArrow(targetRect);
        } else if (isCentered) {
          this.setAttribute('arrow-centered', '');
        }
      }

      this.style.left = `${left}px`;
    }

    /** @private */
    __updateTop(top, targetRect, overlayRect, isCentered) {
      if (top < 0) {
        top = 0;
        this.__repositionArrow(targetRect);
      } else {
        const viewportHeight = this.__getViewportHeight();
        if (top + overlayRect.height > viewportHeight) {
          top = viewportHeight - overlayRect.height;
          this.__repositionArrow(targetRect);
        } else if (isCentered) {
          this.setAttribute('arrow-centered', '');
        }
      }

      this.style.top = `${top}px`;
    }

    /** @private */
    __repositionArrow(targetRect) {
      // When constrained, position arrow to point at target center
      // Use requestAnimationFrame to get fresh measurements after position is applied
      requestAnimationFrame(() => {
        if (!this.opened) {
          return;
        }
        const arrow = this.__getArrow();
        if (!arrow) {
          return;
        }
        const overlayRect = this.__getOverlayRect();
        const targetCenter = targetRect.left + targetRect.width / 2;
        const arrowOffset = targetCenter - overlayRect.left;
        arrow.style.insetInlineStart = `${arrowOffset}px`;
      });
    }

    /** @private */
    __getArrow() {
      return this.$.overlay.querySelector('[part="arrow"]');
    }

    /** @private */
    __getViewportHeight() {
      return Math.min(window.innerHeight, document.documentElement.clientHeight);
    }

    /** @private */
    __getViewportWidth() {
      return Math.min(window.innerWidth, document.documentElement.clientWidth);
    }

    /** @private */
    __getOverlayRect() {
      return this.$.overlay.getBoundingClientRect();
    }

    /** @private */
    __getTargetRect() {
      return this.positionTarget.getBoundingClientRect();
    }
  };
