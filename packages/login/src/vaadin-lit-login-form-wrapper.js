/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { loginFormWrapperStyles } from './vaadin-login-form-wrapper-styles.js';

/**
 * An element used internally by `<vaadin-login-form>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
class LoginFormWrapper extends ThemableMixin(PolylitMixin(LitElement)) {
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

      /**
       * Used to customize the `aria-level` attribute on the heading element.
       */
      headingLevel: {
        type: Number,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <section part="form">
        <div part="form-title" role="heading" aria-level="${this.headingLevel}">${this.i18n.form.title}</div>
        <div part="error-message" ?hidden="${!this.error}">
          <strong part="error-message-title">${this.i18n.errorMessage.title}</strong>
          <p part="error-message-description">${this.i18n.errorMessage.message}</p>
        </div>

        <slot name="form"></slot>

        <slot name="custom-form-area"></slot>

        <slot name="submit"></slot>

        <slot name="forgot-password"></slot>

        <div part="footer">
          <slot name="footer"></slot>
          <p>${this.i18n.additionalInformation}</p>
        </div>
      </section>
    `;
  }
}

defineCustomElement(LoginFormWrapper);

export { LoginFormWrapper };
