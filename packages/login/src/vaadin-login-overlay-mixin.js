/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TitleController } from './title-controller.js';

/**
 * @polymerMixin
 */
export const LoginOverlayMixin = (superClass) =>
  class LoginOverlayMixin extends superClass {
    static get properties() {
      return {
        /**
         * Defines the application description
         * @type {string}
         */
        description: {
          type: String,
          value: 'Application description',
          notify: true,
        },

        /**
         * True if the overlay is currently displayed.
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * Defines the application title
         * @type {string}
         */
        title: {
          type: String,
          value: 'App name',
        },
      };
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.setAttribute('role', 'dialog');
      this.setAttribute('aria-modal', 'true');
      this.setAttribute('tabindex', '0');

      this.__titleController = new TitleController(this);
      this.addController(this.__titleController);

      this._overlayElement = this.$.overlay;
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('__effectiveI18n') && this.__effectiveI18n.header) {
        this.title = this.__effectiveI18n.header.title;
        this.description = this.__effectiveI18n.header.description;
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('title') || props.has('__effectiveI18n')) {
        this.__titleController.setTitle(this.title);
      }

      if (props.has('headingLevel')) {
        this.__titleController.setLevel(this.headingLevel);
      }

      if (props.has('opened')) {
        this._openedChanged(this.opened);
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Restore opened state if overlay was open when disconnecting
      if (this.__restoreOpened) {
        this.opened = true;
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Using a timeout to avoid toggling opened state
      // when just moving the overlay in the DOM
      setTimeout(() => {
        if (!this.isConnected) {
          this.__restoreOpened = this.opened;
          this.opened = false;
        }
      });
    }

    /** @protected */
    _preventClosingLogin(e) {
      e.preventDefault();
    }

    /** @private */
    __handleOverlayClosed() {
      this.dispatchEvent(new CustomEvent('closed'));
    }

    /** @private */
    _openedChanged(opened, oldOpened) {
      if (oldOpened) {
        this._userNameField.value = '';
        this._passwordField.value = '';
        this.disabled = false;
      } else if (opened) {
        // Overlay sets pointerEvents on body to `none`, which breaks LastPass popup
        // Reverting it back to the previous state
        // https://github.com/vaadin/vaadin-overlay/blob/041cde4481b6262eac68d3a699f700216d897373/src/vaadin-overlay.html#L660
        document.body.style.pointerEvents = this.$.overlay._previousDocumentPointerEvents;
      }
    }

    /**
     * Fired when the overlay is closed.
     *
     * @event closed
     */
  };
