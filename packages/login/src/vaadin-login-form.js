/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/password-field/src/vaadin-password-field.js';
import './vaadin-login-form-wrapper.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginMixin } from './vaadin-login-mixin.js';

/**
 * `<vaadin-login-form>` is a Web Component providing an easy way to require users
 * to log in into an application. Note that component has no shadowRoot.
 *
 * ```
 * <vaadin-login-form></vaadin-login-form>
 * ```
 *
 * Component has to be accessible from the `document` layer in order to allow password managers to work properly with form values.
 * Using `<vaadin-login-overlay>` allows to always attach the component to the document body.
 *
 * ### Styling
 *
 * The component doesn't have a shadowRoot, so the `<form>` and input fields can be styled from a global scope.
 * Use `<vaadin-login-form-wrapper>` themable component to apply styles.
 *
 * The following shadow DOM parts of the `<vaadin-login-form-wrapper>` are available for styling:
 *
 * Part name      | Description
 * ---------------|---------------------------------------------------------|
 * `form`         | Container for the entire component's content
 * `form-title`   | Title of the login form
 * `error-message`| Container for error message, contains error-message-title and error-message-description parts. Hidden by default.
 * `error-message-title`       | Container for error message title
 * `error-message-description` | Container for error message description
 * `footer`  | Container additional information text from `i18n` object
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
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
class LoginForm extends LoginMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        [part='vaadin-login-native-form'] * {
          width: 100%;
        }
      </style>
      <vaadin-login-form-wrapper
        theme$="[[_theme]]"
        part="vaadin-login-native-form-wrapper"
        error="[[error]]"
        no-forgot-password="[[noForgotPassword]]"
        i18n="[[i18n]]"
        on-login="_retargetEvent"
        on-forgot-password="_retargetEvent"
      >
        <form part="vaadin-login-native-form" method="POST" action$="[[action]]" slot="form">
          <input id="csrf" type="hidden" />
          <vaadin-text-field
            name="username"
            label="[[i18n.form.username]]"
            id="vaadinLoginUsername"
            required
            on-keydown="_handleInputKeydown"
            autocapitalize="none"
            autocorrect="off"
            spellcheck="false"
            autocomplete="username"
          >
            <input type="text" slot="input" on-keyup="_handleInputKeyup" />
          </vaadin-text-field>

          <vaadin-password-field
            name="password"
            label="[[i18n.form.password]]"
            id="vaadinLoginPassword"
            required
            on-keydown="_handleInputKeydown"
            spellcheck="false"
            autocomplete="current-password"
          >
            <input type="password" slot="input" on-keyup="_handleInputKeyup" />
          </vaadin-password-field>

          <vaadin-button part="vaadin-login-submit" theme="primary contained" on-click="submit" disabled$="[[disabled]]"
            >[[i18n.form.submit]]</vaadin-button
          >
        </form>
      </vaadin-login-form-wrapper>
    `;
  }

  static get is() {
    return 'vaadin-login-form';
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (!this.noAutofocus) {
      this.$.vaadinLoginUsername.focus();
    }
  }

  /**
   * @param {StampedTemplate} dom
   * @return {null}
   * @protected
   */
  _attachDom(dom) {
    this.appendChild(dom);
  }

  static get observers() {
    return ['_errorChanged(error)'];
  }

  /** @private */
  _errorChanged() {
    if (this.error && !this._preventAutoEnable) {
      this.disabled = false;
    }
  }

  submit() {
    const userName = this.$.vaadinLoginUsername;
    const password = this.$.vaadinLoginPassword;

    if (this.disabled || !(userName.validate() && password.validate())) {
      return;
    }

    this.error = false;
    this.disabled = true;

    const loginEventDetails = {
      bubbles: true,
      cancelable: true,
      detail: {
        username: userName.value,
        password: password.value,
      },
    };

    const firedEvent = this.dispatchEvent(new CustomEvent('login', loginEventDetails));
    if (this.action && firedEvent) {
      const csrfMetaName = document.querySelector('meta[name=_csrf_parameter]');
      const csrfMetaValue = document.querySelector('meta[name=_csrf]');
      if (csrfMetaName && csrfMetaValue) {
        this.$.csrf.name = csrfMetaName.content;
        this.$.csrf.value = csrfMetaValue.content;
      }
      this.querySelector('[part="vaadin-login-native-form"]').submit();
    }
  }

  /** @private */
  _handleInputKeydown(e) {
    if (e.key === 'Enter') {
      const { currentTarget: inputActive } = e;
      const nextInput =
        inputActive.id === 'vaadinLoginUsername' ? this.$.vaadinLoginPassword : this.$.vaadinLoginUsername;
      if (inputActive.validate()) {
        if (nextInput.validate()) {
          this.submit();
        } else {
          nextInput.focus();
        }
      }
    }
  }

  /** @private */
  _handleInputKeyup(e) {
    const input = e.currentTarget;
    if (e.key === 'Tab' && input instanceof HTMLInputElement) {
      input.select();
    }
  }
}

customElements.define(LoginForm.is, LoginForm);

export { LoginForm };
