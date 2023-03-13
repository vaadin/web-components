/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * @polymerMixin
 */
export const MenuOverlayMixin = (superClass) =>
  class MenuOverlayMixin extends PositionMixin(superClass) {
    static get properties() {
      return {
        /**
         * @protected
         */
        parentOverlay: {
          type: Object,
          readOnly: true,
        },
      };
    }

    static get observers() {
      return ['_themeChanged(_theme)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('keydown', (e) => {
        if (!e.defaultPrevented && e.composedPath()[0] === this.$.overlay && [38, 40].indexOf(e.keyCode) > -1) {
          const child = this.getFirstChild();
          if (child && Array.isArray(child.items) && child.items.length) {
            e.preventDefault();
            if (e.keyCode === 38) {
              child.items[child.items.length - 1].focus();
            } else {
              child.focus();
            }
          }
        }
      });
    }

    /**
     * Returns the first element in the overlay content.
     *
     * @returns {HTMLElement}
     */
    getFirstChild() {
      return this.querySelector(':not(style):not(slot)');
    }

    /** @private */
    _themeChanged() {
      this.close();
    }

    /**
     * Returns the adjusted boundaries of the overlay.
     *
     * @returns {object}
     */
    getBoundaries() {
      // Measure actual overlay and content sizes
      const overlayRect = this.getBoundingClientRect();
      const contentRect = this.$.overlay.getBoundingClientRect();

      // Maximum x and y values are imposed by content size and overlay limits.
      let yMax = overlayRect.bottom - contentRect.height;

      // Adjust constraints to ensure bottom-aligned applies to sub-menu.
      const parent = this.parentOverlay;
      if (parent && parent.hasAttribute('bottom-aligned')) {
        const parentStyle = getComputedStyle(parent);
        yMax = yMax - parseFloat(parentStyle.bottom) - parseFloat(parentStyle.height);
      }

      return {
        xMax: overlayRect.right - contentRect.width,
        xMin: overlayRect.left + contentRect.width,
        yMax,
      };
    }

    /**
     * @protected
     * @override
     */
    _updatePosition() {
      super._updatePosition();

      if (this.positionTarget && this.parentOverlay) {
        // This overlay is positioned by a parent menu item,
        // adjust the position by the overlay content paddings
        const content = this.$.content;
        const style = getComputedStyle(content);

        // Horizontal adjustment
        const isLeftAligned = !!this.style.left;
        if (isLeftAligned) {
          this.style.left = `${parseFloat(this.style.left) + parseFloat(style.paddingLeft)}px`;
        } else {
          this.style.right = `${parseFloat(this.style.right) + parseFloat(style.paddingRight)}px`;
        }

        // Vertical adjustment
        const isBottomAligned = !!this.style.bottom;
        if (isBottomAligned) {
          this.style.bottom = `${parseFloat(this.style.bottom) - parseFloat(style.paddingBottom)}px`;
        } else {
          this.style.top = `${parseFloat(this.style.top) - parseFloat(style.paddingTop)}px`;
        }
      }
    }
  };
