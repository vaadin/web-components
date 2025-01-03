/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-login-form.js';
import './vaadin-lit-login-overlay-wrapper.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginOverlayMixin } from './vaadin-login-overlay-mixin.js';

/**
 * LitElement based version of `<vaadin-login-overlay>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
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
          .i18n="${this.i18n}"
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
