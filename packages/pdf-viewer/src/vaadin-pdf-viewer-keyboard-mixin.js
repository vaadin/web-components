/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/**
 * A mixin that handles the keyboard shortcuts of the viewer.
 */
export const PdfViewerKeyboardMixin = (superClass) =>
  class PdfViewerKeyboardMixinClass extends superClass {
    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    /**
     * Handles the keyboard shortcuts of the viewer.
     * @private
     */
    #onKeyDown(event) {
      const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
      if (!isShortcut || !this.pageCount) {
        return;
      }

      if ((event.key === 'Home' || event.key === 'End') && event.composedPath().includes(this.$.content)) {
        this._goToPage(event.key === 'Home' ? 1 : this.pageCount);
        event.preventDefault();
      }
    }
  };
