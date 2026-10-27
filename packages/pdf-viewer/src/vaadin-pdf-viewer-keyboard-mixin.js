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
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';

/**
 * A mixin that handles the keyboard shortcuts of the viewer.
 */
export const PdfViewerKeyboardMixin = (superClass) =>
  class PdfViewerKeyboardMixinClass extends KeyboardMixin(superClass) {
    /**
     * Override method from `KeyboardMixin` to handle the keyboard shortcuts of the viewer.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
      if (!isShortcut || !this.pageCount) {
        return;
      }

      if ((event.key === 'Home' || event.key === 'End') && event.composedPath().includes(this.$.content)) {
        this._scrollToPage(event.key === 'Home' ? 1 : this.pageCount);
        event.preventDefault();
      }
    }
  };
