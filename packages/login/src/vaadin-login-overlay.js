/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-login-form.js';
import './vaadin-login-overlay-wrapper.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
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
 * @mixes LoginOverlayMixin
 */
class LoginOverlay extends LoginOverlayMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-login-overlay';
  }

  /** @protected */
  render() {
    return html`
      <vaadin-login-overlay-wrapper
        id="vaadinLoginOverlayWrapper"
        .opened="${this.opened}"
        .title="${this.title}"
        .description="${this.description}"
        .headingLevel="${this.headingLevel}"
        role="dialog"
        focus-trap
        with-backdrop
        theme="${ifDefined(this._theme)}"
        @vaadin-overlay-escape-press="${this._preventClosingLogin}"
        @vaadin-overlay-outside-click="${this._preventClosingLogin}"
        @opened-changed="${this._onOpenedChanged}"
      >
        <vaadin-login-form
          theme="with-overlay"
          id="vaadinLoginForm"
          .action="${this.action}"
          .disabled="${this.disabled}"
          .error="${this.error}"
          .noAutofocus="${this.noAutofocus}"
          .noForgotPassword="${this.noForgotPassword}"
          .headingLevel="${this.__computeHeadingLevel(this.headingLevel)}"
          .i18n="${this.__effectiveI18n}"
          @login="${this._retargetEvent}"
          @forgot-password="${this._retargetEvent}"
          @disabled-changed="${this._onDisabledChanged}"
        ></vaadin-login-form>
      </vaadin-login-overlay-wrapper>

      <div hidden>
        <slot name="custom-form-area"></slot>
        <slot name="footer"></slot>
      </div>
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
