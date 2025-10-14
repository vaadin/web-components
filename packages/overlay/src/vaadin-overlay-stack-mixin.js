/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
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
 * Returns true if all the instances on top of the overlay are nested overlays.
 * @private
 */
export const hasOnlyNestedOverlays = (overlay) => {
  const instances = getAttachedInstances();
  const next = instances[instances.indexOf(overlay) + 1];
  if (!next) {
    return true;
  }

  if (!overlay._deepContains(next)) {
    return false;
  }

  return hasOnlyNestedOverlays(next);
};

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

/**
 * @polymerMixin
 */
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
      // If the overlay is the last one, or if all other overlays shown above
      // are nested overlays (e.g. date-picker inside a dialog), do not call
      // `showPopover()` unnecessarily to avoid scroll position being reset.
      if (isLastOverlay(this) || hasOnlyNestedOverlays(this)) {
        return;
      }

      // Update stacking order of native popover-based overlays
      if (this.matches(':popover-open')) {
        this.hidePopover();
        this.showPopover();
      }

      // Update order of attached instances
      this._removeAttachedInstance();
      this._appendAttachedInstance();
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
