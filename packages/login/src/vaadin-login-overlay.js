/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-login-form.js';
import './vaadin-login-overlay-wrapper.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginOverlayMixin } from './vaadin-login-overlay-mixin.js';

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
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
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes LoginOverlayMixin
 */
class LoginOverlay extends LoginOverlayMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <vaadin-login-overlay-wrapper
        id="vaadinLoginOverlayWrapper"
        opened="{{opened}}"
        role="dialog"
        focus-trap
        with-backdrop
        title="[[title]]"
        description="[[description]]"
        theme$="[[_theme]]"
        on-vaadin-overlay-escape-press="_preventClosingLogin"
        on-vaadin-overlay-outside-click="_preventClosingLogin"
      >
        <vaadin-login-form
          theme="with-overlay"
          id="vaadinLoginForm"
          action="[[action]]"
          disabled="{{disabled}}"
          error="{{error}}"
          no-autofocus="[[noAutofocus]]"
          no-forgot-password="[[noForgotPassword]]"
          i18n="{{i18n}}"
          on-login="_retargetEvent"
          on-forgot-password="_retargetEvent"
        ></vaadin-login-form>
      </vaadin-login-overlay-wrapper>

      <div hidden>
        <slot name="custom-form-area"></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-login-overlay';
  }
}

defineCustomElement(LoginOverlay);

export { LoginOverlay };
