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

/**
 * A controller which prevents the virtual keyboard from showing up on mobile devices
 * when the field's overlay is closed.
 */
export class VirtualKeyboardController {
  /**
   * @param {{ inputElement?: HTMLElement; opened: boolean } & HTMLElement} host
   */
  constructor(host) {
    this.host = host;

    host.addEventListener('opened-changed', () => {
      if (!host.opened) {
        // Prevent opening the virtual keyboard when the input gets re-focused on dropdown close
        this.__setVirtualKeyboardEnabled(false);
      }
    });

    // Re-enable virtual keyboard on blur, so it gets opened when the field is focused again
    host.addEventListener('blur', () => this.__setVirtualKeyboardEnabled(true));

    // Re-enable the virtual keyboard whenever the field is touched
    host.addEventListener('touchstart', () => this.__setVirtualKeyboardEnabled(true));
  }

  /** @private */
  __setVirtualKeyboardEnabled(value) {
    if (this.host.inputElement) {
      this.host.inputElement.inputMode = value ? '' : 'none';
    }
  }
}
