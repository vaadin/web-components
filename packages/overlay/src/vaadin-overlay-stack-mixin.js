/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/** @type {Set<HTMLElement>} */
const attachedInstances = new Set();

/**
 * Returns all attached overlays in visual stacking order.
 * @private
 */
const getAttachedInstances = () => [...attachedInstances].filter((el) => !el.hasAttribute('closing'));

/**
 * Returns overlays shown on top of the given overlay.
 * @param {HTMLElement} overlay
 * @return {HTMLElement[]}
 * @protected
 */
export const getOverlaysOnTop = (overlay) => {
  const instances = getAttachedInstances();
  const index = instances.indexOf(overlay);
  // The overlay is not in the visible stack (closing), so nothing is "on top" of it.
  return index === -1 ? [] : instances.slice(index + 1);
};

/**
 * Returns true if the given overlay is a child of a parent overlay.
 * @param {HTMLElement} parent
 * @param {HTMLElement} overlay
 * @return {boolean}
 * @protected
 */
export const isNestedOverlay = (parent, overlay) => parent._deepContains(overlay);

/**
 * Returns true if the overlay is the last one in the opened overlays stack.
 * @param {HTMLElement} overlay
 * @param {function(HTMLElement): boolean} filter
 * @return {boolean}
 * @protected
 */
export const isLastOverlay = (overlay, filter = (_overlay) => true) => {
  const filteredOverlays = getAttachedInstances().filter(filter);
  return overlay === filteredOverlays.pop();
};

export const OverlayStackMixin = (superClass) =>
  class OverlayStackMixin extends superClass {
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
     * Returns true if this is overlay is attached.
     *
     * @return {boolean}
     * @protected
     */
    get _isAttached() {
      return attachedInstances.has(this);
    }

    /**
     * Brings the overlay as visually the frontmost one.
     */
    bringToFront() {
      if (isLastOverlay(this)) {
        return;
      }

      const overlays = getOverlaysOnTop(this);
      // Nested positioned overlays anchored must stay visually on top.
      const nestedOverlays = overlays.filter((el) => el._hasOverlayPositionMixin && isNestedOverlay(this, el));

      // If the only overlays on top are nested positioned overlays, this overlay is already
      // effectively frontmost. Skip to avoid resetting scroll position via `showPopover()`.
      if (nestedOverlays.length === overlays.length) {
        return;
      }

      [this, ...nestedOverlays].forEach((overlay) => {
        if (overlay.matches(':popover-open')) {
          overlay.hidePopover();
          overlay.showPopover();
        }
        overlay._removeAttachedInstance();
        overlay._appendAttachedInstance();
      });
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

    /** @protected */
    _appendAttachedInstance() {
      attachedInstances.add(this);
    }

    /** @protected */
    _removeAttachedInstance() {
      if (this._isAttached) {
        attachedInstances.delete(this);
      }
    }
  };
