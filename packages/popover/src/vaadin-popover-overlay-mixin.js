/**
 * @license
 * Copyright (c) 2022 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { setNestedOverlay } from '@vaadin/overlay/src/vaadin-overlay-stack-mixin.js';

/**
 * Returns the closest parent overlay for given node, if any.
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */
const getClosestOverlay = (node) => {
  let n = node;

  while (n && n !== node.ownerDocument) {
    n = n.parentNode || n.host;

    if (n && n._hasOverlayStackMixin) {
      return n;
    }
  }

  return null;
};

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

    static get observers() {
      return ['__openedOrTargetChanged(opened, positionTarget)'];
    }

    /**
     * Tag name prefix used by custom properties.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-popover';
    }

    requestContentUpdate() {
      super.requestContentUpdate();

      // Copy custom properties from the owner
      if (this.positionTarget && this.owner) {
        const style = getComputedStyle(this.owner);
        ['top', 'bottom', 'start', 'end'].forEach((prop) => {
          this.style.setProperty(
            `--${this._tagNamePrefix}-offset-${prop}`,
            style.getPropertyValue(`--${this._tagNamePrefix}-offset-${prop}`),
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

    /** @private */
    __openedOrTargetChanged(opened, target) {
      if (target) {
        const parent = getClosestOverlay(target);
        if (parent) {
          setNestedOverlay(parent, opened ? this : null);
        }
      }
    }
  };
