/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
      <style>
        :host {
          overflow: hidden;
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='form'] {
          flex: 1;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        [part='form-title'] {
          margin: 0;
        }

        [part='error-message'] {
          position: relative;
        }
      </style>
      <section part="form">
        <h2 part="form-title">[[i18n.form.title]]</h2>
        <div part="error-message" hidden$="[[!error]]">
          <h5 part="error-message-title">[[i18n.errorMessage.title]]</h5>
          <p part="error-message-description">[[i18n.errorMessage.message]]</p>
        </div>

        <slot name="form"></slot>

        <slot name="forgot-password"></slot>

        <div part="footer">
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

customElements.define(LoginFormWrapper.is, LoginFormWrapper);

export { LoginFormWrapper };
