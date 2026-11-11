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

      const { key, code } = event;
      const path = event.composedPath();
      const target = path[0];
      if ((key === 'Home' || key === 'End') && path.includes(this.$.content)) {
        this._scrollToPage(key === 'Home' ? 1 : this.pageCount);
      } else if (target.matches('input, textarea') || target.isContentEditable) {
        // Text fields keep the browser zoom, which low vision users may rely on.
        return;
      } else if (key === '+' || key === '=' || code === 'NumpadAdd') {
        // Check the key code too, for keyboard layouts that need Shift for these keys.
        this._stepZoom(1);
      } else if (key === '-' || code === 'NumpadSubtract') {
        this._stepZoom(-1);
      } else if (key === '0' || code === 'Digit0' || code === 'Numpad0') {
        this._resetZoom();
      } else {
        return;
      }
      event.preventDefault();
    }
  };
