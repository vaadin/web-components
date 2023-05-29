/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { AriaModalController } from '@vaadin/a11y-base/src/aria-modal-controller.js';
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';

/**
 * @polymerMixin
 * @mixes ControllerMixin
 */
export const OverlayFocusMixin = (superClass) =>
  class OverlayFocusMixin extends ControllerMixin(superClass) {
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

      this.__ariaModalController = new AriaModalController(this);
      this.__focusTrapController = new FocusTrapController(this);
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(this.__ariaModalController);
      this.addController(this.__focusTrapController);
    }

    /**
     * Release focus and restore focus after the overlay is closed.
     *
     * @protected
     */
    _resetFocus() {
      if (this.focusTrap) {
        this.__ariaModalController.close();
        this.__focusTrapController.releaseFocus();
      }

      if (this.restoreFocusOnClose && this._shouldRestoreFocus()) {
        this.__restoreFocus();
      }
    }

    /**
     * Store previously focused node when the overlay starts to open.
     *
     * @protected
     */
    _storeFocus() {
      if (this.restoreFocusOnClose) {
        this.__storeFocus();
      }
    }

    /**
     * Trap focus within the overlay after opening has completed.
     *
     * @protected
     */
    _trapFocus() {
      if (this.focusTrap) {
        this.__ariaModalController.showModal();
        this.__focusTrapController.trapFocus(this.$.overlay);
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
      if (this.contains(node)) {
        return true;
      }
      let n = node;
      const doc = node.ownerDocument;
      // Walk from node to `this` or `document`
      while (n && n !== doc && n !== this) {
        n = n.parentNode || n.host;
      }
      return n === this;
    }

    /** @private */
    __storeFocus() {
      // Store the focused node.
      this.__restoreFocusNode = getDeepActiveElement();

      // Determine and store the node that has the `focus-ring` attribute
      // in order to restore the attribute when the overlay closes.
      const restoreFocusNode = this.restoreFocusNode || this.__restoreFocusNode;
      if (restoreFocusNode) {
        const restoreFocusNodeHost = (restoreFocusNode.assignedSlot || restoreFocusNode).getRootNode().host;
        this.__restoreFocusRingNode = [restoreFocusNode, restoreFocusNodeHost].find((node) => {
          return node && node.hasAttribute('focus-ring');
        });
      }
    }

    /** @private */
    __restoreFocus() {
      // Use restoreFocusNode if specified, otherwise fallback to the node
      // which was focused before opening the overlay.
      const restoreFocusNode = this.restoreFocusNode || this.__restoreFocusNode;
      if (restoreFocusNode) {
        if (getDeepActiveElement() === document.body) {
          // In Firefox and Safari, focusing the restoreFocusNode synchronously
          // doesn't work as expected when the overlay is closing on outside click.
          // These browsers force focus to move to the body element and retain it
          // there until the next event loop iteration.
          setTimeout(() => restoreFocusNode.focus());
        } else {
          // In other cases, restore focus synchronously to allow tabbing outside
          // the overlay when no focus trap is present.
          restoreFocusNode.focus();
        }

        this.__restoreFocusNode = null;
      }

      // Restore the `focus-ring` attribute if it was present
      // when the overlay was opening.
      if (this.__restoreFocusRingNode) {
        this.__restoreFocusRingNode.setAttribute('focus-ring', '');
        this.__restoreFocusRingNode = null;
      }
    }
  };
