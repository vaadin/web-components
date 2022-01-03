/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const region = document.createElement('div');

region.style.position = 'fixed';
region.style.clip = 'rect(0px, 0px, 0px, 0px)';
region.setAttribute('aria-live', 'polite');

document.body.appendChild(region);

/**
 * Cause a text string to be announced by screen readers.
 *
 * @param {string} text The text that should be announced by the screen reader.
 * @param {{mode?: string, timeout?: number}} options Additional options.
 */
export function announce(text, options = {}) {
  const mode = options.mode || 'polite';
  const timeout = options.timeout || 150;

  region.setAttribute('aria-live', mode);

  region.textContent = '';

  setTimeout(() => {
    region.textContent = text;
  }, timeout);
}
