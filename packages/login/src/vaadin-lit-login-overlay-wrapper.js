/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { LoginOverlayWrapperMixin } from './vaadin-login-overlay-wrapper-mixin.js';
import { loginOverlayWrapperStyles } from './vaadin-login-overlay-wrapper-styles.js';

/**
 * An element used internally by `<vaadin-login-overlay>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @private
 */
class LoginOverlayWrapper extends LoginOverlayWrapperMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-login-overlay-wrapper';
  }

  static get styles() {
    return [overlayStyles, loginOverlayWrapperStyles];
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <section part="card">
            <div part="brand">
              <slot name="title">
                <div part="title" role="heading" aria-level="${this.headingLevel}">${this.title}</div>
              </slot>
              <p part="description">${this.description}</p>
            </div>
            <div part="form">
              <slot></slot>
            </div>
          </section>
        </div>
      </div>
    `;
  }
}

defineCustomElement(LoginOverlayWrapper);
