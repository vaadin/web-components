/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const DialogBaseMixin = (superClass) =>
  class DialogBaseMixin extends superClass {
    static get properties() {
      return {
        /**
         * True if the overlay is currently displayed.
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          value: false,
          notify: true,
        },

        /**
         * Set to true to disable closing dialog on outside click
         * @attr {boolean} no-close-on-outside-click
         * @type {boolean}
         */
        noCloseOnOutsideClick: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to disable closing dialog on Escape press
         * @attr {boolean} no-close-on-esc
         * @type {boolean}
         */
        noCloseOnEsc: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to remove backdrop and allow click events on background elements.
         * @type {boolean}
         */
        modeless: {
          type: Boolean,
          value: false,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();

      const overlay = this.$.overlay;

      overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
      overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));

      this._overlayElement = overlay;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // Restore opened state if overlay was opened when disconnecting
      if (this.__restoreOpened) {
        this.opened = true;
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      // Automatically close the overlay when dialog is removed from DOM
      // Using a timeout to avoid toggling opened state, and dispatching change
      // events, when just moving the dialog in the DOM
      setTimeout(() => {
        if (!this.isConnected) {
          this.__restoreOpened = this.opened;
          this.opened = false;
        }
      });
    }

    /** @protected */
    _onOverlayOpened(e) {
      if (e.detail.value === false) {
        this.opened = false;
      }
    }

    /**
     * Close the dialog if `noCloseOnOutsideClick` isn't set to true
     * @private
     */
    _handleOutsideClick(e) {
      if (this.noCloseOnOutsideClick) {
        e.preventDefault();
      }
    }

    /**
     * Close the dialog if `noCloseOnEsc` isn't set to true
     * @private
     */
    _handleEscPress(e) {
      if (this.noCloseOnEsc) {
        e.preventDefault();
      }
    }

    /** @private */
    _bringOverlayToFront() {
      if (this.modeless) {
        this._overlayElement.bringToFront();
      }
    }
  };
