/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { loginOverlayWrapperStyles } from './styles/vaadin-login-overlay-wrapper-base-styles.js';

/**
 * An element used internally by `<vaadin-login-overlay>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class LoginOverlayWrapper extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-login-overlay-wrapper';
  }

  static get styles() {
    return loginOverlayWrapperStyles;
  }

  static get properties() {
    return {
      /**
       * Application description. Displayed under the title.
       */
      description: {
        type: String,
      },
    };
  }

  /**
   * Override method from OverlayFocusMixin to use owner as focus trap root
   * @protected
   * @override
   */
  get _focusTrapRoot() {
    return this.owner;
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <div part="content" id="content">
          <section part="card">
            <div part="brand">
              <slot name="title"></slot>
              <div part="description">${this.description}</div>
            </div>
            <div part="form-wrapper">
              <slot></slot>
            </div>
          </section>
        </div>
      </div>
    `;
  }
}

defineCustomElement(LoginOverlayWrapper);
