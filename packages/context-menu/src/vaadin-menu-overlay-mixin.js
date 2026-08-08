/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayFocusMixin } from '@vaadin/overlay/src/vaadin-overlay-focus-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { isLastOverlay } from '@vaadin/overlay/src/vaadin-overlay-stack-mixin.js';

export const MenuOverlayMixin = (superClass) =>
  class MenuOverlayMixin extends OverlayFocusMixin(PositionMixin(superClass)) {
    static get properties() {
      return {
        /**
         * @protected
         */
        parentOverlay: {
          type: Object,
          readOnly: true,
        },

        /**
         * @protected
         */
        _theme: {
          type: String,
          readOnly: true,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_themeChanged(_theme)'];
    }

    /**
     * Override method from OverlayFocusMixin to use slotted div as content root.
     * @protected
     * @override
     */
    get _contentRoot() {
      return this._rendererRoot;
    }

    /**
     * Override method from OverlayMixin to use slotted div as the renderer root.
     * @protected
     * @override
     */
    get _rendererRoot() {
      if (!this.__savedRoot) {
        const root = document.createElement('div');
        root.setAttribute('slot', 'overlay');
        root.style.display = 'contents';
        this.owner.appendChild(root);
        this.__savedRoot = root;
      }

      return this.__savedRoot;
    }

    /** @protected */
    ready() {
      super.ready();

      this.restoreFocusOnClose = true;

      this.addEventListener('keydown', (e) => {
        if (!e.defaultPrevented && e.composedPath()[0] === this.$.overlay && [38, 40].indexOf(e.keyCode) > -1) {
          const child = this.owner._menuListBox ?? this._contentRoot.firstElementChild;
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

    /** @private */
    _themeChanged() {
      this.close();
    }

    /**
     * Override method from `OverlayMixin` to always add global listeners,
     * so that outside click also works for modeless sub-menu overlays.
     *
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldAddGlobalListeners() {
      return true;
    }

    /**
     * The overlay of the root menu in the menu chain.
     * @private
     */
    get __rootOverlay() {
      return this.parentOverlay ? this.parentOverlay.__rootOverlay : this;
    }

    /**
     * Override method from `OverlayMixin` so that a click inside any overlay
     * of the same menu (e.g. an item with a sub-menu or `keepOpen` set) is not
     * an outside click, and only the topmost menu overlay closes the menu.
     * Overlays of other types (e.g. a tooltip shown for a menu item) may be
     * on top of the stack and must not block closing.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldCloseOnOutsideClick(event) {
      // All menu overlay content is slotted through the root menu element,
      // so clicks inside any overlay of the same menu pass through it.
      if (event.composedPath().includes(this.__rootOverlay.owner)) {
        return false;
      }

      return isLastOverlay(this, (overlay) => overlay.localName === this.localName);
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
      if (parent?.hasAttribute('bottom-aligned')) {
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

      if (this.positionTarget && this.parentOverlay && this.opened) {
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

    /**
     * Override method inherited from `OverlayFocusMixin` to disable
     * focus restoration on sub-menu overlay close. Focus should
     * be only restored when the root menu closes.
     *
     * @protected
     * @override
     * @return {boolean}
     */
    _shouldRestoreFocus() {
      if (this.parentOverlay) {
        // Do not restore focus on sub-menu close.
        return false;
      }

      return super._shouldRestoreFocus();
    }

    /**
     * Override method inherited from `OverlayFocusMixin` to check if the
     * node is contained within the overlay's owner element (the menu),
     * where all content (overlay content, sub-menus, etc.) is slotted.
     *
     * @protected
     * @override
     * @param {Node} node
     * @return {boolean}
     */
    _deepContains(node) {
      return this.owner.contains(node);
    }
  };
