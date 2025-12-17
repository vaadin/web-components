/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import '@vaadin/password-field/src/vaadin-password-field.js';
import './vaadin-login-form-wrapper.js';
import './vaadin-login-overlay-wrapper.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginFormMixin } from './vaadin-login-form-mixin.js';
import { LoginOverlayMixin } from './vaadin-login-overlay-mixin.js';

/**
 * `<vaadin-login-overlay>` is a web component which renders a login form in an overlay and
 * provides an additional `brand` part for application title and description.
 *
 * ```html
 * <vaadin-login-overlay opened></vaadin-login-overlay>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name                    | Description
 * -----------------------------|--------------------------------
 * `backdrop`                   | Backdrop of the overlay
 * `overlay`                    | The overlay container element
 * `content`                    | The overlay content element
 * `card`                       | Container for the brand and form wrapper
 * `brand`                      | Container for application title and description
 * `description`                | The application description
 * `form-wrapper`               | The login form wrapper element
 * `form`                       | The login form element
 * `form-title`                 | Title of the login form
 * `error-message`              | Container for error message
 * `error-message-title`        | Container for error message title
 * `error-message-description`  | Container for error message description
 * `footer`                     | Container for the footer element
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} description-changed - Fired when the `description` property changes.
 * @fires {CustomEvent} disabled-changed - Fired when the `disabled` property changes.
 * @fires {CustomEvent} error-changed - Fired when the `error` property changes.
 * @fires {CustomEvent} forgot-password - Fired when user clicks on the "Forgot password" button.
 * @fires {CustomEvent} login - Fired when a user submits the login.
 * @fires {CustomEvent} closed - Fired when the overlay is closed.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes LoginFormMixin
 * @mixes LoginOverlayMixin
 */
class LoginOverlay extends LoginFormMixin(LoginOverlayMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-login-overlay';
  }

  static get styles() {
    return css`
      :host([opened]),
      :host([opening]),
      :host([closing]) {
        display: block !important;
        position: fixed;
        outline: none;
      }

      :host,
      :host([hidden]) {
        display: none !important;
      }

      :host(:focus-visible) ::part(overlay) {
        outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-login-overlay-wrapper
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .description="${this.description}"
        focus-trap
        with-backdrop
        theme="${ifDefined(this._theme)}"
        @vaadin-overlay-escape-press="${this._preventClosingLogin}"
        @vaadin-overlay-outside-click="${this._preventClosingLogin}"
        @vaadin-overlay-closed="${this.__handleOverlayClosed}"
        @opened-changed="${this._onOpenedChanged}"
        exportparts="backdrop, overlay, content, card, brand, description, form-wrapper"
      >
        <slot name="title" slot="title"></slot>
        <vaadin-login-form-wrapper
          id="form"
          .error="${this.error}"
          .i18n="${this.__effectiveI18n}"
          part="form"
          role="region"
          aria-labelledby="title"
          exportparts="error-message, error-message-title, error-message-description, footer"
        >
          <div id="title" slot="form-title" part="form-title" role="heading" aria-level="${this.headingLevel + 1}">
            ${this.__effectiveI18n.form.title}
          </div>
          <slot name="form" slot="form"></slot>
          <slot name="custom-form-area" slot="custom-form-area"></slot>
          <slot name="submit" slot="submit"></slot>
          <slot name="forgot-password" slot="forgot-password"></slot>
          <slot name="footer" slot="footer"></slot>
        </vaadin-login-form-wrapper>
      </vaadin-login-overlay-wrapper>
    `;
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }
}

defineCustomElement(LoginOverlay);

export { LoginOverlay };
