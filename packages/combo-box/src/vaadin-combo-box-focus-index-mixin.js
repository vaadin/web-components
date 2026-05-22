/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export const ComboBoxFocusIndexMixin = (superClass) =>
  class FocusIndexMixin extends superClass {
    static get observers() {
      return ['__clearPendingFocusOnFilter(filter)'];
    }

    /**
     * Scrolls the dropdown to the item at the given index and sets it as the
     * focused (highlighted) item. Closing the dropdown without an explicit
     * selection change (e.g. via outside click or blur) will commit the
     * focused item as `selectedItem` — callers focusing an index other than
     * the current selection should be aware of this side effect.
     *
     * @private
     * @param {number} index
     */
    __focusIndex(index) {
      if (typeof index !== 'number' || Number.isNaN(index) || index < 0) {
        return;
      }

      // Defer until the dropdown is open and the items array has been
      // populated. `_onOpened` and `__onDataProviderPageLoaded` re-fire
      // the queued call once those conditions hold.
      if (!this._overlayOpened || !this._dropdownItems || this._dropdownItems.length === 0) {
        this.__pendingFocusIndex = index;
        return;
      }

      if (index >= this._dropdownItems.length) {
        return;
      }

      // Move the viewport and set the focused row. Rendering rows
      // around `index` lets placeholder rows fire `index-requested`,
      // which loads any missing pages via the data-provider chain.
      this._scrollIntoView(index);
      this._focusedIndex = index;

      // A page-load may have kicked in during the scroll (placeholder
      // rows in the new viewport requested their pages). Re-fire after
      // the page lands so the viewport can settle around real items.
      if (this.loading) {
        this.__pendingFocusIndex = index;
        return;
      }

      delete this.__pendingFocusIndex;
      requestAnimationFrame(() => {
        if (!this.isConnected) {
          return;
        }
        this._updateActiveDescendant(index);
        this.__correctScrollPosition(index);
      });
    }

    /**
     * After `_focusedIndex` triggered the scroller's `scrollIntoView`, the
     * row may still extend past the viewport when items above (or below)
     * have variable heights — iron-list's index-counting heuristic in
     * `scrollIntoView` counts items, not pixels, so taller-than-average
     * neighbors push the target outside the viewport. Measure the target's
     * actual rect after iron-list has settled and nudge `scrollTop` until
     * the row fits.
     *
     * @private
     */
    __correctScrollPosition(index) {
      const scroller = this._scroller;
      if (!scroller || !this._overlayOpened) {
        return;
      }
      const target = [...scroller.children].find((el) => !el.hidden && el.index === index);
      if (!target) {
        return;
      }
      const targetRect = target.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const bottomOvershoot = targetRect.bottom - scrollerRect.bottom + scroller._viewportTotalPaddingBottom;
      if (bottomOvershoot > 0) {
        scroller.scrollTop += bottomOvershoot;
        return;
      }
      const topUndershoot = scrollerRect.top - targetRect.top;
      if (topUndershoot > 0) {
        scroller.scrollTop -= topUndershoot;
      }
    }

    /** @private */
    __focusPendingIndexIfNeeded() {
      if (this.__pendingFocusIndex !== undefined && !this.loading) {
        this.__focusIndex(this.__pendingFocusIndex);
      }
    }

    /** @private */
    __clearPendingFocusOnFilter() {
      delete this.__pendingFocusIndex;
    }

    /**
     * Override method from `ComboBoxBaseMixin` to flush any pending
     * `__focusIndex` call after the overlay opens.
     *
     * @protected
     * @override
     */
    _onOpened() {
      super._onOpened();
      this.__focusPendingIndexIfNeeded();
    }

    /**
     * Override method from `ComboBoxDataProviderMixin` to flush any pending
     * `__focusIndex` call after a data-provider page lands.
     *
     * @private
     * @override
     */
    __onDataProviderPageLoaded() {
      super.__onDataProviderPageLoaded();
      this.__focusPendingIndexIfNeeded();
    }
  };
