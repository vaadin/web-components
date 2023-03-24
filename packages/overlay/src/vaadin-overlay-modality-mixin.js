/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';

/**
 * @polymerMixin
 */
export const ModalityMixin = (superClass) =>
  class ModalityMixin extends superClass {
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
         * @type {boolean}
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
    }

    /**
     * Override method from `OverlayMixin` to trap focus.
     *
     * @protected
     * @override
     */
    _onOverlayOpened() {
      if (this.focusTrap) {
        this.__focusTrapController.trapFocus(this.$.overlay);
      }
    }
  };
