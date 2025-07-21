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

        const offset = targetRect.width / 2 - overlayRect.width / 2;

        if (this.style.left) {
          const left = overlayRect.left + offset;
          if (left > 0) {
            this.style.left = `${left}px`;
            // Center the pointer arrow horizontally
            this.setAttribute('arrow-centered', '');
          }
        }

        if (this.style.right) {
          const right = parseFloat(this.style.right) + offset;
          if (right > 0) {
            this.style.right = `${right}px`;
            // Center the pointer arrow horizontally
            this.setAttribute('arrow-centered', '');
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
