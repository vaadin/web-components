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
      const arrow = this.$.overlay.querySelector('[part="arrow"]');
      if (arrow) {
        arrow.style.insetInlineStart = '';
      }

      // Center the overlay horizontally
      if (this.position === 'bottom' || this.position === 'top') {
        const targetRect = this.positionTarget.getBoundingClientRect();
        const overlayRect = this.$.overlay.getBoundingClientRect();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        const offset = targetRect.width / 2 - overlayRect.width / 2;

        if (this.style.left) {
          let left = overlayRect.left + offset;

          // Constrain to viewport bounds
          if (left < 0) {
            left = 0;
            this.__repositionArrow(targetRect);
          } else if (left + overlayRect.width > viewportWidth) {
            left = viewportWidth - overlayRect.width;
            this.__repositionArrow(targetRect);
          } else {
            this.setAttribute('arrow-centered', '');
          }

          this.style.left = `${left}px`;
        }

        if (this.style.right) {
          let right = parseFloat(this.style.right) + offset;
          const centeredOverlayLeft = overlayRect.left - offset;

          if (centeredOverlayLeft < 0) {
            right += centeredOverlayLeft;
            this.__repositionArrow(targetRect);
          } else if (centeredOverlayLeft + overlayRect.width > viewportWidth) {
            right += centeredOverlayLeft + overlayRect.width - viewportWidth;
            this.__repositionArrow(targetRect);
          } else {
            this.setAttribute('arrow-centered', '');
          }

          this.style.right = `${right}px`;
        }
      }

      // Calculate arrow offset for aligned horizontal positions only when constrained
      if (
        this.position === 'bottom-start' ||
        this.position === 'top-start' ||
        this.position === 'bottom-end' ||
        this.position === 'top-end'
      ) {
        const targetRect = this.positionTarget.getBoundingClientRect();
        const overlayRect = this.$.overlay.getBoundingClientRect();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        // Only reposition arrow if popover is constrained to viewport edge
        const isConstrainedLeft = overlayRect.left <= 0.5;
        const isConstrainedRight = overlayRect.right >= viewportWidth - 0.5;

        if (isConstrainedLeft || isConstrainedRight) {
          this.__repositionArrow(targetRect);
        }
      }

      // Center the overlay vertically
      if (this.position === 'start' || this.position === 'end') {
        const targetRect = this.positionTarget.getBoundingClientRect();
        const overlayRect = this.$.overlay.getBoundingClientRect();

        const offset = targetRect.height / 2 - overlayRect.height / 2;
        this.style.top = `${overlayRect.top + offset}px`;
      }
    }

    /** @private */
    __repositionArrow(targetRect) {
      // When constrained, position arrow to point at target center
      // Use requestAnimationFrame to get fresh measurements after position is applied
      requestAnimationFrame(() => {
        if (!this.opened) {
          return;
        }
        const arrow = this.$.overlay.querySelector('[part="arrow"]');
        if (!arrow) {
          return;
        }
        const freshOverlayRect = this.$.overlay.getBoundingClientRect();
        const targetCenter = targetRect.left + targetRect.width / 2;
        const arrowOffset = targetCenter - freshOverlayRect.left;
        arrow.style.insetInlineStart = `${arrowOffset}px`;
      });
    }
  };
