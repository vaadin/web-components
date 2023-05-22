/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Returns all attached overlays in visual stacking order.
 * @private
 */
const getAttachedInstances = () =>
  Array.from(document.body.children)
    .filter((el) => el instanceof HTMLElement && el._hasOverlayStackMixin && !el.hasAttribute('closing'))
    .sort((a, b) => a.__zIndex - b.__zIndex || 0);

/**
 * Returns true if the overlay is the last one in the opened overlays stack.
 * @param {HTMLElement} overlay
 * @return {boolean}
 * @protected
 */
export const isLastOverlay = (overlay) => overlay === getAttachedInstances().pop();

/**
 * @polymerMixin
 */
export const OverlayStackMixin = (superClass) =>
  class OverlayStackMixin extends superClass {
    constructor() {
      super();

      this._hasOverlayStackMixin = true;
    }

    /**
     * Returns true if this is the last one in the opened overlays stack.
     *
     * @return {boolean}
     * @protected
     */
    get _last() {
      return isLastOverlay(this);
    }

    /**
     * Brings the overlay as visually the frontmost one.
     */
    bringToFront() {
      let zIndex = '';
      const frontmost = getAttachedInstances()
        .filter((o) => o !== this)
        .pop();
      if (frontmost) {
        const frontmostZIndex = frontmost.__zIndex;
        zIndex = frontmostZIndex + 1;
      }
      this.style.zIndex = zIndex;
      this.__zIndex = zIndex || parseFloat(getComputedStyle(this).zIndex);
    }

    /** @protected */
    _enterModalState() {
      if (document.body.style.pointerEvents !== 'none') {
        // Set body pointer-events to 'none' to disable mouse interactions with
        // other document nodes.
        this._previousDocumentPointerEvents = document.body.style.pointerEvents;
        document.body.style.pointerEvents = 'none';
      }

      // Disable pointer events in other attached overlays
      getAttachedInstances().forEach((el) => {
        if (el !== this) {
          el.$.overlay.style.pointerEvents = 'none';
        }
      });
    }

    /** @protected */
    _exitModalState() {
      if (this._previousDocumentPointerEvents !== undefined) {
        // Restore body pointer-events
        document.body.style.pointerEvents = this._previousDocumentPointerEvents;
        delete this._previousDocumentPointerEvents;
      }

      // Restore pointer events in the previous overlay(s)
      const instances = getAttachedInstances();

      let el;
      // Use instances.pop() to ensure the reverse order
      while ((el = instances.pop())) {
        if (el === this) {
          // Skip the current instance
          continue;
        }
        el.$.overlay.style.removeProperty('pointer-events');
        if (!el.modeless) {
          // Stop after the last modal
          break;
        }
      }
    }
  };
