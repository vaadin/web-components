/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * A mixin providing common tooltip overlay functionality.
 *
 * @polymerMixin
 * @mixes PositionMixin
 * @mixes OverlayMixin
 */
export const TooltipOverlayMixin = (superClass) =>
  class TooltipOverlayMixinClass extends PositionMixin(OverlayMixin(superClass)) {
    static get properties() {
      return {
        position: {
          type: String,
          reflectToAttribute: true,
        },
      };
    }

    requestContentUpdate() {
      super.requestContentUpdate();

      this.toggleAttribute('hidden', this.textContent.trim() === '');

      // Copy custom properties from the tooltip
      if (this.positionTarget && this.owner) {
        const style = getComputedStyle(this.owner);
        ['top', 'bottom', 'start', 'end'].forEach((prop) => {
          this.style.setProperty(
            `--vaadin-tooltip-offset-${prop}`,
            style.getPropertyValue(`--vaadin-tooltip-offset-${prop}`),
          );
        });
      }
    }

    /**
     * @protected
     * @override
     */
    _updatePosition() {
      super._updatePosition();

      if (!this.positionTarget) {
        return;
      }

      // Center the tooltip overlay horizontally
      if (this.position === 'bottom' || this.position === 'top') {
        const targetRect = this.positionTarget.getBoundingClientRect();
        const overlayRect = this.$.overlay.getBoundingClientRect();

        const offset = targetRect.width / 2 - overlayRect.width / 2;

        if (this.style.left) {
          const left = overlayRect.left + offset;
          if (left > 0) {
            this.style.left = `${left}px`;
          }
        }

        if (this.style.right) {
          const right = parseFloat(this.style.right) + offset;
          if (right > 0) {
            this.style.right = `${right}px`;
          }
        }
      }

      // Center the tooltip overlay vertically
      if (this.position === 'start' || this.position === 'end') {
        const targetRect = this.positionTarget.getBoundingClientRect();
        const overlayRect = this.$.overlay.getBoundingClientRect();

        const offset = targetRect.height / 2 - overlayRect.height / 2;
        this.style.top = `${overlayRect.top + offset}px`;
      }
    }
  };
