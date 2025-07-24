/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LoginMixin } from './vaadin-login-mixin.js';

function isCheckbox(field) {
  return (field.inputElement || field).type === 'checkbox';
}

/**
 * @polymerMixin
 * @mixes LoginMixin
 */
export const LoginFormMixin = (superClass) =>
  class LoginFormMixin extends LoginMixin(superClass) {
    /** @protected */
    get _customFields() {
      return [...this.children].filter((node) => {
        return node.getAttribute('slot') === 'custom-form-area' && node.hasAttribute('name');
      });
    }

    /** @protected */
    get _userNameField() {
      return this.querySelector('#vaadinLoginUsername');
    }

    /** @protected */
    get _passwordField() {
      return this.querySelector('#vaadinLoginPassword');
    }

    /**
     * Override update to render slotted form and buttons
     * into light DOM after rendering shadow DOM.
     * @protected
     */
    update(props) {
      super.update(props);

      this.__renderSlottedForm();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('error') && this.error && !this._preventAutoEnable) {
        this.disabled = false;
      }
    }

    /** @protected */
    async connectedCallback() {
      super.connectedCallback();

      if (!this.noAutofocus) {
        // Wait for the form to fully render.
        await new Promise(requestAnimationFrame);
        this._userNameField.focus();
      }
    }

    __renderSlottedForm() {
      render(
        html`
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
        `,
        this,
        { host: this },
      );
    }

    /**
     * Submits the form.
     */
    submit() {
      const userName = this._userNameField;
      const password = this._passwordField;

      // eslint-disable-next-line no-restricted-syntax
      userName.validate();
      // eslint-disable-next-line no-restricted-syntax
      password.validate();

      if (this.disabled || userName.invalid || password.invalid) {
        return;
      }

      this.error = false;
      this.disabled = true;

      const detail = {
        username: userName.value,
        password: password.value,
      };

      const fields = this._customFields;
      if (fields.length) {
        detail.custom = {};

        fields.forEach((field) => {
          if (isCheckbox(field) && !field.checked) {
            return;
          }

          detail.custom[field.name] = field.value;
        });
      }

      const loginEventDetails = {
        bubbles: true,
        cancelable: true,
        detail,
      };

      const firedEvent = this.dispatchEvent(new CustomEvent('login', loginEventDetails));
      if (this.action && firedEvent) {
        const csrfMetaName = document.querySelector('meta[name=_csrf_parameter]');
        const csrfMetaValue = document.querySelector('meta[name=_csrf]');
        if (csrfMetaName && csrfMetaValue) {
          const csrf = this.querySelector('#csrf');
          csrf.name = csrfMetaName.content;
          csrf.value = csrfMetaValue.content;
        }
        this.querySelector('form').submit();
      }
    }

    /** @protected */
    _onFormData(event) {
      const { formData } = event;

      if (this._customFields.length) {
        this._customFields.forEach((field) => {
          if (isCheckbox(field) && !field.checked) {
            return;
          }

          formData.append(field.name, field.value);
        });
      }
    }

    /** @protected */
    _handleInputKeydown(e) {
      if (e.key === 'Enter') {
        const { currentTarget: inputActive } = e;
        const nextInput = inputActive.id === 'vaadinLoginUsername' ? this._passwordField : this._userNameField;
        // eslint-disable-next-line no-restricted-syntax
        if (inputActive.validate()) {
          if (nextInput.checkValidity()) {
            this.submit();
          } else {
            nextInput.focus();
          }
        }
      }
    }

    /** @protected */
    _handleInputKeyup(e) {
      const input = e.currentTarget;
      if (e.key === 'Tab' && input instanceof HTMLInputElement) {
        input.select();
      }
    }

    /** @protected */
    _onForgotPasswordClick() {
      this.dispatchEvent(new CustomEvent('forgot-password'));
    }
  };
