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
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';

/**
 * A mixin that handles the focus and the keyboard shortcuts of the viewer.
 */
export const PdfViewerKeyboardMixin = (superClass) =>
  class PdfViewerKeyboardMixinClass extends FocusMixin(KeyboardMixin(superClass)) {
    /**
     * Override method from `FocusMixin` to focus the page area,
     * which is only focusable once a document has loaded.
     * @param {FocusOptions=} options
     * @protected
     * @override
     */
    focus(options) {
      if (!this.pageCount) {
        return;
      }

      this.$.content.focus(options);

      super.focus(options);
    }

    /**
     * Override method from `FocusMixin` to only handle events from the page area.
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(event) {
      return event.composedPath()[0] === this.$.content;
    }

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
        this._goToPage(event.key === 'Home' ? 1 : this.pageCount);
        event.preventDefault();
      }
    }
  };
