/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * A controller which prevents the virtual keyboard from showing up on mobile devices
 * when the field's overlay is closed.
 */
export class VirtualKeyboardController {
  /**
   * @param {{ inputElement?: HTMLElement; opened: boolean } & HTMLElement} host
   * @param {boolean} keepWhenFocused
   */
  constructor(host, keepWhenFocused = false) {
    this.host = host;

    host.addEventListener('opened-changed', () => {
      if (!host.opened) {
        // When the input has kept focus on close, the user was typing and the keyboard
        // is genuinely open, so it stays open instead of leaving a focused input with
        // a hidden keyboard. Only used by hosts that do not focus the input on close.
        if (keepWhenFocused && host.inputElement && isElementFocused(host.inputElement)) {
          return;
        }

        // Prevent opening the virtual keyboard when the input gets re-focused on dropdown close
        this.#setVirtualKeyboardEnabled(false);
      }
    });

    // Re-enable virtual keyboard on blur, so it gets opened when the field is focused again
    host.addEventListener('blur', () => this.#setVirtualKeyboardEnabled(true));

    // Re-enable the virtual keyboard whenever the field is touched
    host.addEventListener('touchstart', () => this.#setVirtualKeyboardEnabled(true));
  }

  #setVirtualKeyboardEnabled(value) {
    if (this.host.inputElement) {
      this.host.inputElement.inputMode = value ? '' : 'none';
    }
  }
}
