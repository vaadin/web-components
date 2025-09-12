/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusRestorationController } from '@vaadin/a11y-base/src/focus-restoration-controller.js';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * @polymerMixin
 */
export const OverlayFocusMixin = (superClass) =>
  class OverlayFocusMixin extends superClass {
    static get properties() {
      return {
        /**
         * When true, opening the overlay moves focus to the first focusable child,
         * or to the overlay part with tabindex if there are no focusable children.
         * @attr {boolean} focus-trap
         */
        focusTrap: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to enable restoring of focus when overlay is closed.
         * @attr {boolean} restore-focus-on-close
         */
        restoreFocusOnClose: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to specify the element which should be focused on overlay close,
         * if `restoreFocusOnClose` is set to true.
         * @type {HTMLElement}
         */
        restoreFocusNode: {
          type: HTMLElement,
        },
      };
    }

    constructor() {
      super();

      this.__focusTrapController = new FocusTrapController(this);
      this.__focusRestorationController = new FocusRestorationController();
    }

    /**
     * Override to specify another element used as a content root,
     * e.g. slotted into the overlay, rather than overlay itself.
     * @protected
     */
    get _contentRoot() {
      return this;
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(this.__focusTrapController);
      this.addController(this.__focusRestorationController);
    }

    /**
     * Override to specify another element used as a focus trap root,
     * e.g. the overlay's owner element, rather than overlay part.
     * @protected
     */
    get _focusTrapRoot() {
      return this.$.overlay;
    }

    /**
     * Release focus and restore focus after the overlay is closed.
     *
     * @protected
     */
    _resetFocus() {
      if (this.focusTrap) {
        this.__focusTrapController.releaseFocus();
      }

      if (this.restoreFocusOnClose && this._shouldRestoreFocus()) {
        const focusVisible = isKeyboardActive();
        const preventScroll = !focusVisible;
        this.__focusRestorationController.restoreFocus({ preventScroll, focusVisible });
      }
    }

    /**
     * Save the previously focused node when the overlay starts to open.
     *
     * @protected
     */
    _saveFocus() {
      if (this.restoreFocusOnClose) {
        this.__focusRestorationController.saveFocus(this.restoreFocusNode);
      }
    }

    /**
     * Trap focus within the overlay after opening has completed.
     *
     * @protected
     */
    _trapFocus() {
      if (this.focusTrap) {
        this.__focusTrapController.trapFocus(this._focusTrapRoot);
      }
    }

    /**
     * Returns true if focus is still inside the overlay or on the body element,
     * otherwise false.
     *
     * Focus shouldn't be restored if it's been moved elsewhere by another
     * component or as a result of a user interaction e.g. the user clicked
     * on a button outside the overlay while the overlay was open.
     *
     * @protected
     * @return {boolean}
     */
    _shouldRestoreFocus() {
      const activeElement = getDeepActiveElement();
      return activeElement === document.body || this._deepContains(activeElement);
    }

    /**
     * Returns true if the overlay contains the given node,
     * including those within shadow DOM trees.
     *
     * @param {Node} node
     * @return {boolean}
     * @protected
     */
    _deepContains(node) {
      if (this._contentRoot.contains(node)) {
        return true;
      }
      let n = node;
      const doc = node.ownerDocument;
      // Walk from node to content root or `document`
      while (n && n !== doc && n !== this._contentRoot) {
        n = n.parentNode || n.host;
      }
      return n === this._contentRoot;
    }
  };
