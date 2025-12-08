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

      // Center the overlay horizontally
      if (this.position === 'bottom' || this.position === 'top') {
        const targetRect = this.positionTarget.getBoundingClientRect();
        const overlayRect = this.$.overlay.getBoundingClientRect();
        const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

        const offset = targetRect.width / 2 - overlayRect.width / 2;

        if (this.style.left) {
          const centeredLeft = overlayRect.left + offset;

          // Constrain to viewport bounds
          let finalLeft = centeredLeft;
          let isCentered = true;

          if (centeredLeft < 0) {
            finalLeft = 0;
            isCentered = false;
          } else if (centeredLeft + overlayRect.width > viewportWidth) {
            finalLeft = viewportWidth - overlayRect.width;
            isCentered = false;
          }

          if (finalLeft >= 0) {
            this.style.left = `${finalLeft}px`;
            if (isCentered) {
              this.setAttribute('arrow-centered', '');
            }
          }
        }

        if (this.style.right) {
          const centeredRight = parseFloat(this.style.right) + offset;
          const centeredOverlayLeft = overlayRect.left - offset;

          let finalRight = centeredRight;
          let isCentered = true;

          if (centeredOverlayLeft < 0) {
            finalRight = centeredRight + centeredOverlayLeft;
            isCentered = false;
          } else if (centeredOverlayLeft + overlayRect.width > viewportWidth) {
            finalRight = centeredRight + (centeredOverlayLeft + overlayRect.width - viewportWidth);
            isCentered = false;
          }

          if (finalRight >= 0) {
            this.style.right = `${finalRight}px`;
            if (isCentered) {
              this.setAttribute('arrow-centered', '');
            }
          }
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
  };
