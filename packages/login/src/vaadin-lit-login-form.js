/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-lit-button.js';
import '@vaadin/text-field/src/vaadin-lit-text-field.js';
import '@vaadin/password-field/src/vaadin-lit-password-field.js';
import './vaadin-lit-login-form-wrapper.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginFormMixin } from './vaadin-login-form-mixin.js';

/**
 * LitElement based version of `<vaadin-login-form>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
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
      <style>
        vaadin-login-form-wrapper > form > * {
          width: 100%;
        }
      </style>
      <vaadin-login-form-wrapper
        id="vaadinLoginFormWrapper"
        theme="${ifDefined(this._theme)}"
        .error="${this.error}"
        .i18n="${this.i18n}"
      >
        <form method="POST" action="${this.action}" @formdata="${this._onFormData}" slot="form">
          <input id="csrf" type="hidden" />
          <vaadin-text-field
            name="username"
            label="${this.i18n.form.username}"
            .errorMessage="${this.i18n.errorMessage.username}"
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
            .label="${this.i18n.form.password}"
            .errorMessage="${this.i18n.errorMessage.password}"
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

        <vaadin-button
          slot="submit"
          theme="primary contained submit"
          @click="${this.submit}"
          .disabled="${this.disabled}"
        >
          ${this.i18n.form.submit}
        </vaadin-button>

        <vaadin-button
          slot="forgot-password"
          theme="tertiary small"
          @click="${this._onForgotPasswordClick}"
          ?hidden="${this.noForgotPassword}"
        >
          ${this.i18n.form.forgotPassword}
        </vaadin-button>
      </vaadin-login-form-wrapper>
    `;
  }
}

defineCustomElement(LoginForm);

export { LoginForm };
