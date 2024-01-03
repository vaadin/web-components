/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { loginFormWrapperStyles } from './vaadin-login-form-wrapper-styles.js';

registerStyles('vaadin-login-form-wrapper', loginFormWrapperStyles, {
  moduleId: 'vaadin-login-form-wrapper-styles',
});

/**
 * An element used internally by `<vaadin-login-form>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
class LoginFormWrapper extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
      <section part="form">
        <h2 part="form-title">[[i18n.form.title]]</h2>
        <div part="error-message" hidden$="[[!error]]">
          <h5 part="error-message-title">[[i18n.errorMessage.title]]</h5>
          <p part="error-message-description">[[i18n.errorMessage.message]]</p>
        </div>

        <slot name="form"></slot>

        <slot name="custom-form-area"></slot>

        <slot name="submit"></slot>

        <slot name="forgot-password"></slot>

        <div part="footer">
          <slot name="footer"></slot>
          <p>[[i18n.additionalInformation]]</p>
        </div>
      </section>
    `;
  }

  static get is() {
    return 'vaadin-login-form-wrapper';
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
}

defineCustomElement(LoginFormWrapper);

export { LoginFormWrapper };
