/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { loginFormWrapperStyles } from './styles/vaadin-login-form-wrapper-base-styles.js';

/**
 * An element used internally by `<vaadin-login-form>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
class LoginFormWrapper extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-login-form-wrapper';
  }

  static get styles() {
    return loginFormWrapperStyles;
  }

  static get properties() {
    return {
      /**
       * If set, the error message is shown. The message is hidden by default.
       * When set, it changes the disabled state of the submit button.
       * @type {boolean}
       */
      error: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * The object used to localize this component.
       */
      i18n: {
        type: Object,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <slot name="form-title"></slot>
      <div part="error-message" ?hidden="${!this.error}">
        <strong part="error-message-title">${this.i18n.errorMessage.title}</strong>
        <div part="error-message-description">${this.i18n.errorMessage.message}</div>
      </div>

      <slot name="form"></slot>

      <slot name="custom-form-area"></slot>

      <slot name="submit"></slot>

      <slot name="forgot-password"></slot>

      <div part="footer">
        <slot name="footer"></slot>
        <div>${this.i18n.additionalInformation}</div>
      </div>
    `;
  }
}

defineCustomElement(LoginFormWrapper);

export { LoginFormWrapper };
