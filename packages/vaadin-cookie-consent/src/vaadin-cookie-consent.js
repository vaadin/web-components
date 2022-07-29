/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
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
