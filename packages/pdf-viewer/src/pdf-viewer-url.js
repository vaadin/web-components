/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/** The protocols of external links that the viewer opens. Links with other URLs are left out. */
const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'];

/**
 * Returns whether the URL of a link is safe to open.
 * @param {string} url
 * @return {boolean}
 */
export function isAllowedLinkUrl(url) {
  try {
    return ALLOWED_LINK_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
}
