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
import { CookieConsent } from '@vaadin/cookie-consent/src/vaadin-cookie-consent.js';

/**
 * @deprecated Import `CookieConsent` from `@vaadin/cookie-consent` instead.
 */
export const CookieConsentElement = CookieConsent;

export * from '@vaadin/cookie-consent/src/vaadin-cookie-consent.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-cookie-consent" is deprecated. Use "@vaadin/cookie-consent" instead.',
);
