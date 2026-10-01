/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusRestorationController } from '@vaadin/a11y-base/src/focus-restoration-controller.js';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import {
  getDeepActiveElement,
  getFocusableElements,
  isElementFocused,
  isElementHidden,
  isKeyboardActive,
} from '@vaadin/a11y-base/src/focus-utils.js';

export const OverlayFocusMixin = (superClass) =>
  class OverlayFocusMixin extends superClass {
    static get properties() {
      return {
        /**
         * When true, opening the overlay moves focus to the first focusable child,
         * or to the overlay part with tabindex if there are no focusable children.
         *
         * An element inside the overlay that has `autofocus` set, such as
         * `<vaadin-text-field autofocus>`, receives focus on open instead.
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

    /**
     * Whether the overlay moves, traps and restores focus. Override to return
     * false in overlays that never do: focus properties are then ignored and
     * the focus controllers are not created.
     * @protected
     */
    static get manageFocus() {
      return true;
    }

    constructor() {
      super();

      this.__manageFocus = this.constructor.manageFocus;

      if (this.__manageFocus) {
        this.__focusTrapController = new FocusTrapController(this);
        this.__focusRestorationController = new FocusRestorationController();
      }
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

      if (this.__manageFocus) {
        this.addController(this.__focusTrapController);
        this.addController(this.__focusRestorationController);
      }
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
      if (!this.__manageFocus) {
        return;
      }

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
      if (!this.__manageFocus) {
        return;
      }

      if (this.restoreFocusOnClose) {
        this.__focusRestorationController.saveFocus(this.restoreFocusNode);
      }
    }

    /**
     * Trap focus within the overlay after opening has completed. Focus moves
     * to the first element with `autofocus` inside the overlay, otherwise to
     * the first focusable element.
     *
     * @protected
     */
    _trapFocus() {
      if (!this.__manageFocus) {
        return;
      }

      if (this.focusTrap && !isElementHidden(this._focusTrapRoot)) {
        const focusables = getFocusableElements(this._focusTrapRoot);
        if (!focusables.some(isElementFocused)) {
          const target = focusables.find((el) => this.#hasAutofocus(el));
          target?.focus({ focusVisible: isKeyboardActive() });
        }

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

    /**
     * Returns true if the element has `autofocus`, or belongs to a custom
     * element that has it (e.g. the input of `<vaadin-text-field autofocus>`).
     * As with native `autofocus`, a plain `<div autofocus>` does not apply to
     * its children. Stops at the focus trap root, whose `autofocus` refers to the overlay.
     * Walks the flat tree, the same way focusable elements are collected from the
     * focus trap root, so it never leaves the overlay when content is slotted from the owner.
     *
     * @param {HTMLElement} element
     * @return {boolean}
     */
    #hasAutofocus(element) {
      const focusTrapRoot = this._focusTrapRoot;
      let node = element;
      while (node && node !== focusTrapRoot && node !== this) {
        if (node.autofocus && (node === element || customElements.get(node.localName))) {
          return true;
        }
        node = node.assignedSlot || node.parentNode || node.host;
      }
      return false;
    }
  };
