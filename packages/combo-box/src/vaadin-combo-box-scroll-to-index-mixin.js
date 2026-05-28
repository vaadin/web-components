/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export const ComboBoxScrollToIndexMixin = (superClass) =>
  class ScrollToIndexMixin extends superClass {
    static get observers() {
      return ['__clearPendingScrollOnFilter(filter)'];
    }

    /**
     * Scrolls the dropdown to the item at the given index and sets it as the
     * focused (highlighted) item. Safe to call before the dropdown is opened
     * or while the data provider is loading: the call is queued and executed
     * once the overlay is open and not loading.
     *
     * Because this sets the focused item, closing the dropdown without an
     * explicit selection change (e.g. via outside click or blur) will commit
     * the focused item as `selectedItem`. In the typical use case (scroll to
     * the currently selected item) this is a no-op; callers scrolling to a
     * different index should be aware of this behavior.
     *
     * @param {number} index Index of the item to scroll to
     */
    scrollToIndex(index) {
      if (typeof index !== 'number' || Number.isNaN(index) || index < 0) {
        return;
      }

      // Defer until the dropdown is open and the items array has been
      // populated. `_onOpened` and `__onDataProviderPageLoaded` re-fire
      // the queued call once those conditions hold.
      if (!this._overlayOpened || !this._dropdownItems || this._dropdownItems.length === 0) {
        this.__scrollToPendingIndex = index;
        return;
      }

      if (index >= this.size - 1) {
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
        this.__scrollToPendingIndex = index;
        return;
      }

      delete this.__scrollToPendingIndex;
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this._updateActiveDescendant(index);
        }
      });
    }

    /** @private */
    __scrollToPendingIndexIfNeeded() {
      if (this.__scrollToPendingIndex !== undefined && !this.loading) {
        this.scrollToIndex(this.__scrollToPendingIndex);
      }
    }

    /** @private */
    __clearPendingScrollOnFilter() {
      delete this.__scrollToPendingIndex;
    }

    /**
     * Override method from `ComboBoxBaseMixin` to flush any pending
     * `scrollToIndex` call after the overlay opens.
     *
     * @protected
     * @override
     */
    _onOpened() {
      super._onOpened();
      this.__scrollToPendingIndexIfNeeded();
    }

    /**
     * Override method from `ComboBoxDataProviderMixin` to flush any pending
     * `scrollToIndex` call after a data-provider page lands.
     *
     * @private
     * @override
     */
    __onDataProviderPageLoaded() {
      super.__onDataProviderPageLoaded();
      this.__scrollToPendingIndexIfNeeded();
    }
  };
