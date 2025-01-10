/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CookieConsentMixin } from './vaadin-cookie-consent-mixin.js';

/**
 * LitElement based version of `<vaadin-cookie-consent>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class CookieConsent extends CookieConsentMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-cookie-consent';
  }

  static get cvdlName() {
    return 'vaadin-cookie-consent';
  }

  static get styles() {
    return css`
      :host {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(CookieConsent);

export { CookieConsent };
