/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { TitleController } from './title-controller.js';

/**
 * @polymerMixin
 * @mixes LoginMixin
 * @mixes OverlayClassMixin
 */
export const LoginOverlayMixin = (superClass) =>
  class LoginOverlayMixin extends OverlayClassMixin(superClass) {
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

      this.__titleController = new TitleController(this);
      this.addController(this.__titleController);

      this._overlayElement = this.$.vaadinLoginOverlayWrapper;
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('title')) {
        this.__titleController.setTitle(this.title);
      }

      if (props.has('opened')) {
        this._openedChanged(this.opened);
      }

      if (props.has('__effectiveI18n')) {
        this.__i18nChanged(this.__effectiveI18n);
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

      // Close overlay and memorize opened state
      this.__restoreOpened = this.opened;
      this.opened = false;
    }

    /** @private */
    __i18nChanged(effectiveI18n) {
      const header = effectiveI18n && effectiveI18n.header;
      if (!header) {
        return;
      }
      this.title = header.title;
      this.description = header.description;
    }

    /** @protected */
    _preventClosingLogin(e) {
      e.preventDefault();
    }

    /** @private */
    _openedChanged(opened) {
      if (!opened) {
        this._userNameField.value = '';
        this._passwordField.value = '';
        this.disabled = false;
      } else {
        // Overlay sets pointerEvents on body to `none`, which breaks LastPass popup
        // Reverting it back to the previous state
        // https://github.com/vaadin/vaadin-overlay/blob/041cde4481b6262eac68d3a699f700216d897373/src/vaadin-overlay.html#L660
        document.body.style.pointerEvents = this.$.vaadinLoginOverlayWrapper._previousDocumentPointerEvents;
      }
    }
  };
