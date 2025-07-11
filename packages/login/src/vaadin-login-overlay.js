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
 * `<vaadin-login-overlay>` is a wrapper of the `<vaadin-login-form>` which opens a login form in an overlay and
 * having an additional `brand` part for application title and description. Using `<vaadin-login-overlay>` allows
 * password managers to work with login form.
 *
 * ```html
 * <vaadin-login-overlay opened></vaadin-login-overlay>
 * ```
 *
 * ### Styling
 *
 * The component doesn't have a shadowRoot, so the `<form>` and input fields can be styled from a global scope.
 * Use `<vaadin-login-overlay-wrapper>` and `<vaadin-login-form-wrapper>` to apply styles.
 *
 * The following shadow DOM parts of the `<vaadin-login-overlay-wrapper>` are available for styling:
 *
 * Part name       | Description
 * ----------------|---------------------------------------------------------|
 * `card`          | Container for the entire component's content
 * `brand`         | Container for application title and description
 * `form`          | Container for the `<vaadin-login-form>` component
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * See [`<vaadin-login-form>`](#/elements/vaadin-login-form)
 * documentation for  `<vaadin-login-form-wrapper>` stylable parts.
 *
 * @fires {CustomEvent} description-changed - Fired when the `description` property changes.
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
 * @mixes LoginOverlayMixin
 */
class LoginOverlay extends LoginFormMixin(LoginOverlayMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-login-overlay';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-login-overlay-wrapper
        id="vaadinLoginOverlayWrapper"
        .owner="${this}"
        .opened="${this.opened}"
        .description="${this.description}"
        popover="manual"
        focus-trap
        with-backdrop
        theme="${ifDefined(this._theme)}"
        @vaadin-overlay-escape-press="${this._preventClosingLogin}"
        @vaadin-overlay-outside-click="${this._preventClosingLogin}"
        @opened-changed="${this._onOpenedChanged}"
        exportparts="backdrop, overlay, content, card, brand, description, form:form-container"
      >
        <slot name="title" slot="title"></slot>
        <vaadin-login-form-wrapper
          id="vaadinLoginFormWrapper"
          theme="with-overlay"
          .error="${this.error}"
          .i18n="${this.__effectiveI18n}"
          .headingLevel="${this.headingLevel + 1}"
          part="form-wrapper"
          exportparts="form, form-title, error-message, error-message-title, error-message-description, footer"
        >
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

  /** @private */
  _onDisabledChanged(event) {
    this.disabled = event.detail.value;
  }
}

defineCustomElement(LoginOverlay);

export { LoginOverlay };
