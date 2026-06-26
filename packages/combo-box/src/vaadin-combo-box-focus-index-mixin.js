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

      // Set the focused row first: this synchronously runs the scroller's
      // `__focusedIndexChanged` observer, which scrolls the row into view
      // (bottom-aligned). Then scroll again to center it so the final position
      // wins. Rendering rows around `index` also lets placeholder rows fire
      // `index-requested`, loading any missing pages via the data-provider
      // chain.
      this._focusedIndex = index;
      this._scrollIntoView(index, true);

      // A page-load may have kicked in during the scroll (placeholder
      // rows in the new viewport requested their pages). Re-fire after
      // the page lands so the viewport can settle around real items.
      if (this.loading) {
        this.__pendingFocusIndex = index;
        return;
      }

      delete this.__pendingFocusIndex;
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this._updateActiveDescendant(index);
        }
      });
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
