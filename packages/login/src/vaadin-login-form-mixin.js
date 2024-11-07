/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
    static get observers() {
      return ['_errorChanged(error)'];
    }

    get _customFields() {
      return [...this.$.vaadinLoginFormWrapper.children].filter((node) => {
        return node.getAttribute('slot') === 'custom-form-area' && node.hasAttribute('name');
      });
    }

    /** @protected */
    async connectedCallback() {
      super.connectedCallback();

      if (!this.noAutofocus) {
        // Wait for the form to fully render.
        await new Promise(requestAnimationFrame);
        this.$.vaadinLoginUsername.focus();
      }
    }

    /** @private */
    _errorChanged() {
      if (this.error && !this._preventAutoEnable) {
        this.disabled = false;
      }
    }

    /**
     * Submits the form.
     */
    submit() {
      const userName = this.$.vaadinLoginUsername;
      const password = this.$.vaadinLoginPassword;

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
          this.$.csrf.name = csrfMetaName.content;
          this.$.csrf.value = csrfMetaValue.content;
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
        const nextInput =
          inputActive.id === 'vaadinLoginUsername' ? this.$.vaadinLoginPassword : this.$.vaadinLoginUsername;
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
