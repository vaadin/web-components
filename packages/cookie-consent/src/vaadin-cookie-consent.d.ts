/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

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
 */
declare class CookieConsent extends ElementMixin(HTMLElement) {
  /**
   * The message to show in the popup.
   */
  message: string;

  /**
   * The text to show on the dismiss/consent button.
   */
  dismiss: string;

  /**
   * The text to show on the 'learn more' link.
   * @attr {string} learn-more
   */
  learnMore: string;

  /**
   * The URL the 'learn more' link should open.
   * @attr {string} learn-more-link
   */
  learnMoreLink: string;

  /**
   * Determines the position of the banner.
   *
   * Possible values are: `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right`
   * For `top` and `bottom`, the banner is shown with full width. For the corner positions,
   * it is shown as a smaller popup.
   */
  position: 'bottom-left' | 'bottom-right' | 'bottom' | 'top-left' | 'top-right' | 'top';

  /**
   * The name of the cookie to set to remember that the user has consented.
   *
   * This rarely needs to be changed.
   * @attr {string} cookie-name
   */
  cookieName: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-cookie-consent': CookieConsent;
  }
}

export { CookieConsent };
