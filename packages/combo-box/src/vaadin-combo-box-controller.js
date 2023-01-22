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
  constructor(host, tagNamePrefix, propertyForValue) {
    /** @type {HTMLElement} */
    this.host = host;

    /** @type {string} */
    this.tagNamePrefix = tagNamePrefix;

    /** @type {boolean} */
    this.opened = false;

    /** @type {boolean} */
    this.overlayOpened = false;

    /** @type {number} */
    this.focusedIndex = -1;

    /** @type {string} */
    this.propertyForValue = propertyForValue;

    this._boundOnPointerDown = this._onPointerDown.bind(this);
  }

  /**
   * @return {string | undefined}
   * @protected
   */
  get _inputValue() {
    return this.inputElement ? this.inputElement[this.propertyForValue] : undefined;
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
   * Set the index of the item to be marked as focused.
   * @param {number} index
   */
  setFocusedIndex(index) {
    this.focusedIndex = index;

    this._updateActiveDescendant(index);
  }

  /**
   * Set and initialize the input element.
   * @param {HTMLElement} inputElement
   */
  setInputElement(inputElement) {
    this.inputElement = inputElement;
  }

  /**
   * Set and initialize the native input element.
   * @param {HTMLInputElement} input
   */
  setNativeInput(input) {
    this.nativeInput = input;

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
   * Update opened state of the combo-box overlay.
   * @param {boolean} opened
   */
  setOverlayOpened(opened) {
    this.overlayOpened = opened;

    if (opened) {
      // Defer scroll position adjustment to improve performance.
      requestAnimationFrame(() => {
        this.scroller.scrollIntoView(this.focusedIndex);

        // Set attribute after the items are rendered when overlay is opened for the first time.
        this._updateActiveDescendant(this.focusedIndex);
      });
    }
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

    const input = this.nativeInput;
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

  /**
   * Set the element used to toggle the overlay.
   * @param {HTMLElement} toggleButton
   */
  setToggleButton(toggleButton) {
    this.toggleButton = toggleButton;

    if (toggleButton) {
      // Don't blur the input on toggle mousedown
      toggleButton.addEventListener('mousedown', (e) => e.preventDefault());
      // Unfocus previously focused element if focus is not inside combo box (on touch devices)
      toggleButton.addEventListener('click', () => {
        if (isTouch && !this._isInputFocused()) {
          document.activeElement.blur();
        }
      });
    }
  }

  /**
   * Selects or unselects a value of the native input element.
   * @param {boolean} shouldSelect
   */
  updateSelection(shouldSelect) {
    const value = this._inputValue;
    if (value !== undefined && this._isInputFocused()) {
      if (shouldSelect) {
        this.nativeInput.setSelectionRange(0, value.length);
      } else {
        const pos = value ? value.length : 0;
        this.nativeInput.setSelectionRange(pos, pos);
      }
    }
  }

  /** @private */
  _getItemElements() {
    return [...this.scroller.querySelectorAll(`${this.tagNamePrefix}-item`)];
  }

  /** @private */
  _isInputFocused() {
    return this.nativeInput && isElementFocused(this.nativeInput);
  }

  /** @private */
  _onPointerDown() {
    requestAnimationFrame(() => {
      this.overlay.bringToFront();
    });
  }

  /** @private */
  _updateActiveDescendant(index) {
    const input = this.inputElement;
    if (!input) {
      return;
    }

    const item = this._getItemElements().find((el) => el.index === index);
    if (item) {
      input.setAttribute('aria-activedescendant', item.id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }
}
