/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
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

      if (!this._overlayOpened || this.loading) {
        this.__scrollToPendingIndex = index;
        return;
      }

      if (!this._dropdownItems || index >= this._dropdownItems.length) {
        return;
      }

      if (this._dropdownItems[index] instanceof ComboBoxPlaceholder) {
        // The target item is on a page that has not been loaded yet. Request
        // the page directly and queue the focus-index update for after the
        // page loads (see `__onDataProviderPageLoaded` →
        // `__scrollToPendingIndexIfNeeded`). Relying on `_scrollIntoView` to
        // trigger the page load via the visible-placeholder `index-requested`
        // chain is unreliable on reopen with cached data: the virtualizer
        // has just been torn down by closing the overlay and its scroll API
        // is a no-op while it rebuilds physical items.
        this.__scrollToPendingIndex = index;
        this.__dataProviderController.ensureFlatIndexLoaded(index);
        return;
      }

      delete this.__scrollToPendingIndex;
      this._focusedIndex = index;
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
