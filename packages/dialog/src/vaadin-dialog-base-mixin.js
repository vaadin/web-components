/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
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
          sync: true,
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

        /**
         * Set the distance of the overlay from the top of its container.
         * If a unitless number is provided, pixels are assumed.
         *
         * Note that the overlay top edge may not be the same as the viewport
         * top edge (e.g. the Lumo theme defines some spacing to prevent the
         * overlay from stretching all the way to the top of the viewport).
         */
        top: {
          type: String,
        },

        /**
         * Set the distance of the overlay from the left of its container.
         * If a unitless number is provided, pixels are assumed.
         *
         * Note that the overlay left edge may not be the same as the viewport
         * left edge (e.g. the Lumo theme defines some spacing to prevent the
         * overlay from stretching all the way to the left of the viewport).
         */
        left: {
          type: String,
        },

        /**
         * Set the width of the overlay.
         * If a unitless number is provided, pixels are assumed.
         */
        width: {
          type: String,
        },

        /**
         * Set the height of the overlay.
         * If a unitless number is provided, pixels are assumed.
         */
        height: {
          type: String,
        },

        /**
         * The `role` attribute value to be set on the overlay. Defaults to "dialog".
         *
         * @attr {string} overlay-role
         */
        overlayRole: {
          type: String,
          value: 'dialog',
        },
      };
    }

    static get observers() {
      return ['__positionChanged(top, left)', '__sizeChanged(width, height)'];
    }

    /** @protected */
    ready() {
      super.ready();

      const overlay = this.$.overlay;

      overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
      overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));
      overlay.addEventListener('vaadin-overlay-closed', this.__handleOverlayClosed.bind(this));

      this._overlayElement = overlay;
    }

    /** @private */
    __handleOverlayClosed() {
      this.dispatchEvent(new CustomEvent('closed'));
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

    /** @private */
    __positionChanged(top, left) {
      requestAnimationFrame(() => this.$.overlay.setBounds({ top, left }));
    }

    /** @private */
    __sizeChanged(width, height) {
      requestAnimationFrame(() => this.$.overlay.setBounds({ width, height }, false));
    }

    /**
     * Fired when the dialog is closed.
     *
     * @event closed
     */
  };
