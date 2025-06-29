/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/password-field/src/vaadin-password-field.js';
import './vaadin-login-form-wrapper.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginFormMixin } from './vaadin-login-form-mixin.js';

/**
 * `<vaadin-login-form>` is a Web Component providing an easy way to require users
 * to log in into an application. Note that component has no shadowRoot.
 *
 * ```html
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} disabled-changed - Fired when the `disabled` property changes.
 * @fires {CustomEvent} error-changed - Fired when the `error` property changes.
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes LoginFormMixin
 */
class LoginForm extends LoginFormMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-login-form';
  }

  /**
   * @protected
   * @override
   */
  createRenderRoot() {
    return this;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-login-form-wrapper
        id="vaadinLoginFormWrapper"
        theme="${ifDefined(this._theme)}"
        .error="${this.error}"
        .i18n="${this.__effectiveI18n}"
        .headingLevel="${this.headingLevel}"
      >
        <form method="POST" action="${ifDefined(this.action)}" @formdata="${this._onFormData}" slot="form">
          <input id="csrf" type="hidden" />
          <vaadin-text-field
            name="username"
            .label="${this.__effectiveI18n.form.username}"
            .errorMessage="${this.__effectiveI18n.errorMessage.username}"
            id="vaadinLoginUsername"
            required
            @keydown="${this._handleInputKeydown}"
            autocapitalize="none"
            autocorrect="off"
            spellcheck="false"
            autocomplete="username"
            manual-validation
          >
            <input type="text" slot="input" @keyup="${this._handleInputKeyup}" />
          </vaadin-text-field>

          <vaadin-password-field
            name="password"
            .label="${this.__effectiveI18n.form.password}"
            .errorMessage="${this.__effectiveI18n.errorMessage.password}"
            id="vaadinLoginPassword"
            required
            @keydown="${this._handleInputKeydown}"
            spellcheck="false"
            autocomplete="current-password"
            manual-validation
          >
            <input type="password" slot="input" @keyup="${this._handleInputKeyup}" />
          </vaadin-password-field>
        </form>

        <vaadin-button slot="submit" theme="primary submit" @click="${this.submit}" .disabled="${this.disabled}">
          ${this.__effectiveI18n.form.submit}
        </vaadin-button>

        <vaadin-button
          slot="forgot-password"
          theme="tertiary small"
          @click="${this._onForgotPasswordClick}"
          ?hidden="${this.noForgotPassword}"
        >
          ${this.__effectiveI18n.form.forgotPassword}
        </vaadin-button>
      </vaadin-login-form-wrapper>
    `;
  }
}

defineCustomElement(LoginForm);

export { LoginForm };
