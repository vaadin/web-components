/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { LoginMixin } from './vaadin-login-mixin.js';

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

      // Ensure both fields have error message
      this.__setErrorMessage(userName);
      this.__setErrorMessage(password);

      if (this.disabled || !(userName.validate() && password.validate())) {
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
          formData.append(field.name, field.value);
        });
      }
    }

    /** @private */
    __setErrorMessage(field, shouldClear) {
      const errorKey = field.id === 'vaadinLoginUsername' ? 'username' : 'password';
      field.errorMessage = shouldClear ? '' : this.i18n.errorMessage[errorKey];
    }

    /** @protected */
    _handleInputFocusOut(event) {
      const { currentTarget: field } = event;

      // Focus moved outside the browser tab, do nothing.
      if (!document.hasFocus()) {
        return;
      }

      if (isKeyboardActive()) {
        this.__setErrorMessage(field);
      } else {
        // Postpone setting error message until global click since setting it
        // will affect field height and might affect click on other elements
        // located below it, including the "forgot password" button.
        document.addEventListener(
          'click',
          () => {
            this.__setErrorMessage(field);
          },
          { once: true },
        );
      }
    }

    /** @protected */
    _handleInputKeydown(e) {
      if (e.key === 'Enter') {
        const { currentTarget: inputActive } = e;
        this.__setErrorMessage(inputActive);
        const nextInput =
          inputActive.id === 'vaadinLoginUsername' ? this.$.vaadinLoginPassword : this.$.vaadinLoginUsername;
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
      } else if (e.key !== 'Enter' && input.parentElement.errorMessage) {
        // Reset error message when typing anything (including Backspace)
        // to prevent click issues handled by the focusout event listener.
        this.__setErrorMessage(input.parentElement, true);
      }
    }

    /** @protected */
    _onForgotPasswordClick() {
      this.dispatchEvent(new CustomEvent('forgot-password'));
    }
  };
