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
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CookieConsentMixin } from './vaadin-cookie-consent-mixin.js';

/**
 * `<vaadin-cookie-consent>` is used to show a cookie consent banner the first
 *  time a user visits the application.
 *
 * By default, the banner is shown attached to the top of the screen and with a
 * predefined text, a link to https://cookiesandyou.com/ describing cookies and a consent button.
 *
 * The texts, link and position can be configured using attributes/properties, e.g.
 * ```
 * <vaadin-cookie-consent learn-more-link="https://mysite.com/cookies.html"></vaadin-cookie-consent>
 * ```
 *
 * ### Styling
 *
 * To change the look of the cookie consent banner, a `style` node should be attached
 * to the document's head with the following style names overridden:
 *
 * Style name      | Description
 * ----------------|-------------------------------------------------------|
 * `cc-window`     | Banner container
 * `cc-message`    | Message container
 * `cc-compliance` | Dismiss cookie button container
 * `cc-dismiss`    | Dismiss cookie button
 * `cc-btn`        | Dismiss cookie button
 * `cc-link`       | Learn more link element
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes CookieConsentMixin
 */
class CookieConsent extends CookieConsentMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: none !important;
        }
      </style>
    `;
  }

  static get is() {
    return 'vaadin-cookie-consent';
  }

  static get cvdlName() {
    return 'vaadin-cookie-consent';
  }
}

defineCustomElement(CookieConsent);

export { CookieConsent };
