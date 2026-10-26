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
import { isSafari } from '@vaadin/component-base/src/browser-utils.js';

/**
 * A mixin that handles the keyboard shortcuts of the viewer, and scrolls
 * the pages with the keyboard in Safari.
 */
export const PdfViewerKeyboardMixin = (superClass) =>
  class PdfViewerKeyboardMixinClass extends superClass {
    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.$.content.addEventListener('keydown', (event) => this.#onContentKeyDown(event));
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

    /**
     * Scrolls the pages with the keyboard in Safari, which does not do it for
     * a focused scroll container.
     * @private
     */
    #onContentKeyDown(event) {
      // Other browsers scroll natively, which also keeps caret browsing (F7) working.
      if (!isSafari) {
        return;
      }
      // Shift with the arrow keys extends a text selection.
      const isSelecting = event.shiftKey && event.key !== ' ';
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isSelecting) {
        return;
      }

      const { content } = this.$;
      const lineHeight = 40;
      const pageHeight = content.clientHeight * 0.9;
      const scrolls = {
        ArrowDown: { top: lineHeight },
        ArrowUp: { top: -lineHeight },
        ArrowRight: { left: lineHeight },
        ArrowLeft: { left: -lineHeight },
        PageDown: { top: pageHeight },
        PageUp: { top: -pageHeight },
        ' ': { top: event.shiftKey ? -pageHeight : pageHeight },
      };
      if (event.key === 'Home' || event.key === 'End') {
        content.scrollTop = event.key === 'Home' ? 0 : content.scrollHeight;
      } else if (scrolls[event.key]) {
        content.scrollBy(scrolls[event.key]);
      } else {
        return;
      }
      event.preventDefault();
    }
  };
