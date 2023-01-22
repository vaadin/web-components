/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { isElementFocused } from '@vaadin/component-base/src/focus-utils.js';

/**
 * A controller to manage the combo-box DOM elements state.
 */
export class ComboBoxController {
  constructor(host, tagNamePrefix) {
    /** @type {HTMLElement} */
    this.host = host;

    /** @type {string} */
    this.tagNamePrefix = tagNamePrefix;

    /** @type {boolean} */
    this.opened = false;

    this._boundOnPointerDown = this._onPointerDown.bind(this);
  }

  hostConnected() {
    if (!this.initialized) {
      this.initialized = true;

      const { host } = this;

      host.addEventListener('mousedown', this._boundOnPointerDown);
      host.addEventListener('touchstart', this._boundOnPointerDown);
    }
  }

  /**
   * Request an update for the content of item elements.
   */
  requestContentUpdate() {
    if (!this.scroller) {
      return;
    }

    this.scroller.requestContentUpdate();

    this._getItemElements().forEach((item) => {
      item.requestContentUpdate();
    });
  }

  /**
   * Set and initialize the native input element.
   * @param {HTMLElement} input
   */
  setInputElement(input) {
    this.inputElement = input;

    if (input) {
      input.autocomplete = 'off';
      input.autocapitalize = 'off';

      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', !!this.opened);

      // Disable the macOS Safari spell check auto corrections.
      input.setAttribute('spellcheck', 'false');

      // Disable iOS autocorrect suggestions.
      input.setAttribute('autocorrect', 'off');
    }
  }

  /**
   * Set and initialize the overlay element.
   * @param {HTMLElement} overlay
   */
  setOverlay(overlay) {
    this.overlay = overlay;
  }

  /**
   * Update opened state of the combo-box.
   * @param {boolean} opened
   */
  setOpened(opened) {
    this.opened = opened;

    const hasFocus = this._isInputFocused();
    const { host } = this;

    if (opened) {
      this._openedWithFocusRing = host.hasAttribute('focus-ring');
      // For touch devices, we don't want to popup virtual keyboard
      // unless input element is explicitly focused by the user.
      if (!hasFocus && !isTouch) {
        host.focus();
      }

      this.overlay.restoreFocusOnClose = true;
    } else if (this._openedWithFocusRing && hasFocus) {
      host.setAttribute('focus-ring', '');
    }

    const input = this.inputElement;
    if (input) {
      input.setAttribute('aria-expanded', !!opened);

      if (opened) {
        input.setAttribute('aria-controls', this.scroller.id);
      } else {
        input.removeAttribute('aria-controls');
      }
    }
  }

  /**
   * Set and initialize the scroller element.
   * @param {HTMLElement} scroller
   */
  setScroller(scroller) {
    this.scroller = scroller;
  }

  /** @private */
  _getItemElements() {
    return [...this.scroller.querySelectorAll(`${this.tagNamePrefix}-item`)];
  }

  /** @private */
  _isInputFocused() {
    return this.inputElement && isElementFocused(this.inputElement);
  }

  /** @private */
  _onPointerDown() {
    requestAnimationFrame(() => {
      this.overlay.bringToFront();
    });
  }
}
