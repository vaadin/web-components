/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

const testUserAgent = (regexp) => regexp.test(navigator.userAgent);

const testPlatform = (regexp) => regexp.test(navigator.platform);

const testVendor = (regexp) => regexp.test(navigator.vendor);

export const isAndroid = testUserAgent(/Android/);

export const isChrome = testUserAgent(/Chrome/) && testVendor(/Google Inc/);

export const isFirefox = testUserAgent(/Firefox/);

// IPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
export const isIPad = testPlatform(/^iPad/) || (testPlatform(/^Mac/) && navigator.maxTouchPoints > 1);

export const isIPhone = testPlatform(/^iPhone/);

export const isIOS = isIPhone || isIPad;

export const isSafari = testUserAgent(/^((?!chrome|android).)*safari/i);

export const isTouch = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();
