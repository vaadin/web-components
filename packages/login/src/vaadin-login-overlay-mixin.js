/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { LoginMixin } from './vaadin-login-mixin.js';

/**
 * @polymerMixin
 * @mixes LoginMixin
 * @mixes OverlayClassMixin
 */
export const LoginOverlayMixin = (superClass) =>
  class LoginOverlayMixin extends OverlayClassMixin(LoginMixin(superClass)) {
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
          observer: '_onOpenedChange',
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

    static get observers() {
      return ['__i18nChanged(i18n)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this._overlayElement = this.$.vaadinLoginOverlayWrapper;
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
    __i18nChanged(i18n) {
      const header = i18n && i18n.header;
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

    /**
     * @param {!Event} e
     * @protected
     */
    _retargetEvent(e) {
      e.stopPropagation();
      const { detail, composed, cancelable, bubbles } = e;

      const firedEvent = this.dispatchEvent(new CustomEvent(e.type, { bubbles, cancelable, composed, detail }));
      // Check if `eventTarget.preventDefault()` was called to prevent default in the original event
      if (!firedEvent) {
        e.preventDefault();
      }
    }

    /** @private */
    async _onOpenedChange() {
      const form = this.$.vaadinLoginForm;

      // Wait for initial render on overlay initialization
      if (!form.$ && this.updateComplete) {
        await this.updateComplete;
      }

      if (!this.opened) {
        form.$.vaadinLoginUsername.value = '';
        form.$.vaadinLoginPassword.value = '';
        this.disabled = false;

        if (this._undoTitleTeleport) {
          this._undoTitleTeleport();
        }

        if (this._undoFieldsTeleport) {
          this._undoFieldsTeleport();
        }

        if (this._undoFooterTeleport) {
          this._undoFooterTeleport();
        }
      } else {
        this._undoTitleTeleport = this._teleport('title', this.$.vaadinLoginOverlayWrapper);

        this._undoFieldsTeleport = this._teleport(
          'custom-form-area',
          form.$.vaadinLoginFormWrapper,
          form.querySelector('vaadin-button'),
        );

        this._undoFooterTeleport = this._teleport('footer', form.$.vaadinLoginFormWrapper);

        // Overlay sets pointerEvents on body to `none`, which breaks LastPass popup
        // Reverting it back to the previous state
        // https://github.com/vaadin/vaadin-overlay/blob/041cde4481b6262eac68d3a699f700216d897373/src/vaadin-overlay.html#L660
        document.body.style.pointerEvents = this.$.vaadinLoginOverlayWrapper._previousDocumentPointerEvents;
      }
    }

    /** @private */
    _teleport(slot, target, refNode) {
      const teleported = [...this.querySelectorAll(`[slot="${slot}"]`)].map((el) => {
        if (refNode) {
          target.insertBefore(el, refNode);
        } else {
          target.appendChild(el);
        }
        return el;
      });
      // Function to undo the teleport
      return () => {
        this.append(...teleported);
      };
    }
  };
