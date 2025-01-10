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
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function CookieConsentMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<CookieConsentMixinClass> & T;

export declare class CookieConsentMixinClass {
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
