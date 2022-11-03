/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-login-form.js';
import './vaadin-login-overlay-wrapper.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginMixin } from './vaadin-login-mixin.js';

/**
 * `<vaadin-login-overlay>` is a wrapper of the `<vaadin-login-form>` which opens a login form in an overlay and
 * having an additional `brand` part for application title and description. Using `<vaadin-login-overlay>` allows
 * password managers to work with login form.
 *
 * ```
 * <vaadin-login-overlay opened></vaadin-login-overlay>
 * ```
 *
 * ### Styling
 *
 * The component doesn't have a shadowRoot, so the `<form>` and input fields can be styled from a global scope.
 * Use `<vaadin-login-overlay-wrapper>` and `<vaadin-login-form-wrapper>` to apply styles.
 *
 * The following shadow DOM parts of the `<vaadin-login-overlay-wrapper>` are available for styling:
 *
 * Part name       | Description
 * ----------------|---------------------------------------------------------|
 * `card`          | Container for the entire component's content
 * `brand`         | Container for application title and description
 * `form`          | Container for the `<vaadin-login-form>` component
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * See [`<vaadin-login-form>`](#/elements/vaadin-login-form)
 * documentation for  `<vaadin-login-form-wrapper>` stylable parts.
 *
 * @fires {CustomEvent} description-changed - Fired when the `description` property changes.
 * @fires {CustomEvent} disabled-changed - Fired when the `disabled` property changes.
 * @fires {CustomEvent} error-changed - Fired when the `error` property changes.
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes LoginMixin
 */
class LoginOverlay extends LoginMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <vaadin-login-overlay-wrapper
        id="vaadinLoginOverlayWrapper"
        opened="{{opened}}"
        focus-trap
        with-backdrop
        title="[[title]]"
        description="[[description]]"
        theme$="[[_theme]]"
      >
        <vaadin-login-form
          theme="with-overlay"
          id="vaadinLoginForm"
          action="{{action}}"
          disabled="{{disabled}}"
          error="{{error}}"
          no-autofocus="[[noAutofocus]]"
          no-forgot-password="{{noForgotPassword}}"
          i18n="{{i18n}}"
          on-login="_retargetEvent"
          on-forgot-password="_retargetEvent"
        ></vaadin-login-form>
      </vaadin-login-overlay-wrapper>
    `;
  }

  static get is() {
    return 'vaadin-login-overlay';
  }

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
    return ['__i18nChanged(i18n.header.*)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this._preventClosingLogin = this._preventClosingLogin.bind(this);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.$.vaadinLoginOverlayWrapper.addEventListener('vaadin-overlay-outside-click', this._preventClosingLogin);
    this.$.vaadinLoginOverlayWrapper.addEventListener('vaadin-overlay-escape-press', this._preventClosingLogin);

    // Restore opened state if overlay was open when disconnecting
    if (this.__restoreOpened) {
      this.$.vaadinLoginOverlayWrapper.opened = true;
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    this.$.vaadinLoginOverlayWrapper.removeEventListener('vaadin-overlay-outside-click', this._preventClosingLogin);
    this.$.vaadinLoginOverlayWrapper.removeEventListener('vaadin-overlay-escape-press', this._preventClosingLogin);

    // Close overlay and memorize opened state
    this.__restoreOpened = this.$.vaadinLoginOverlayWrapper.opened;
    this.$.vaadinLoginOverlayWrapper.opened = false;
  }

  /** @private */
  __i18nChanged(i18n) {
    const header = i18n.base;
    if (!header) {
      return;
    }
    this.title = header.title;
    this.description = header.description;
  }

  /** @private */
  _preventClosingLogin(e) {
    e.preventDefault();
  }

  /** @private */
  _onOpenedChange() {
    if (!this.opened) {
      this.$.vaadinLoginForm.$.vaadinLoginUsername.value = '';
      this.$.vaadinLoginForm.$.vaadinLoginPassword.value = '';
      this.disabled = false;

      if (this._undoTeleport) {
        this._undoTeleport();
      }
    } else {
      this._undoTeleport = this._teleport(this._getElementsToTeleport());

      // Overlay sets pointerEvents on body to `none`, which breaks LastPass popup
      // Reverting it back to the previous state
      // https://github.com/vaadin/vaadin-overlay/blob/041cde4481b6262eac68d3a699f700216d897373/src/vaadin-overlay.html#L660
      document.body.style.pointerEvents = this.$.vaadinLoginOverlayWrapper._previousDocumentPointerEvents;
    }
  }

  /** @private */
  _teleport(elements) {
    const teleported = Array.from(elements).map((e) => {
      return this.$.vaadinLoginOverlayWrapper.appendChild(e);
    });
    // Function to undo the teleport
    return () => {
      while (teleported.length > 0) {
        this.appendChild(teleported.shift());
      }
    };
  }

  /** @private */
  _getElementsToTeleport() {
    return this.querySelectorAll('[slot=title]');
  }
}

customElements.define(LoginOverlay.is, LoginOverlay);

export { LoginOverlay };
