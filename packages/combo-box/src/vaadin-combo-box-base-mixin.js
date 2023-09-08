/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { get } from '@vaadin/component-base/src/path-utils.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';

/**
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes DisabledMixin
 * @mixes InputMixin
 * @mixes KeyboardMixin
 * @mixes FocusMixin
 * @mixes OverlayClassMixin
 */
export const ComboBoxBaseMixin = (subclass) =>
  class ComboBoxBaseMixinClass extends OverlayClassMixin(
    FocusMixin(KeyboardMixin(InputMixin(DisabledMixin(ControllerMixin(subclass))))),
  ) {
    static get properties() {
      return {
        /**
         * True if the dropdown is open, false otherwise.
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          notify: true,
          value: false,
          reflectToAttribute: true,
          observer: '_openedChanged',
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: {
          type: Boolean,
        },

        /**
         * When present, it specifies that the field is read-only.
         * @type {boolean}
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /** @protected */
        _scroller: {
          type: Object,
        },

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _toggleElement: {
          type: Object,
          observer: '_toggleElementChanged',
        },
      };
    }

    constructor() {
      super();
      this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this);
      this._boundOnClick = this._onClick.bind(this);
      this._boundOnTouchend = this._onTouchend.bind(this);
    }

    /**
     * Get a reference to the native `<input>` element.
     * Override to provide a custom input.
     * @protected
     * @return {HTMLInputElement | undefined}
     */
    get _nativeInput() {
      return this.inputElement;
    }

    /**
     * Tag name prefix used by internal elements.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-combo-box';
    }

    /** @protected */
    ready() {
      super.ready();

      this._initOverlay();
      this._initScroller();

      this.addEventListener('click', this._boundOnClick);
      this.addEventListener('touchend', this._boundOnTouchend);

      const bringToFrontListener = () => {
        requestAnimationFrame(() => {
          this._overlayElement.bringToFront();
        });
      };

      this.addEventListener('mousedown', bringToFrontListener);
      this.addEventListener('touchstart', bringToFrontListener);

      this.addController(new VirtualKeyboardController(this));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Close the overlay on detach
      this.close();
    }

    /**
     * Opens the dropdown list.
     */
    open() {
      // Prevent _open() being called when input is disabled or read-only
      if (!this.disabled && !this.readonly) {
        this.opened = true;
      }
    }

    /**
     * Closes the dropdown list.
     */
    close() {
      this.opened = false;
    }

    /** @protected */
    _initOverlay() {
      const overlay = this.$.overlay;

      // Store instance for detecting "dir" attribute on opening
      overlay._comboBox = this;

      // Prevent blurring the input when clicking inside the overlay
      overlay.addEventListener('mousedown', (e) => e.preventDefault());

      this._overlayElement = overlay;
    }

    /**
     * Create and initialize the scroller element.
     * Override to provide custom host reference.
     *
     * @protected
     */
    _initScroller(host) {
      const scrollerTag = `${this._tagNamePrefix}-scroller`;

      const overlay = this._overlayElement;

      overlay.renderer = (root) => {
        if (!root.firstChild) {
          root.appendChild(document.createElement(scrollerTag));
        }
      };

      // Ensure the scroller is rendered
      overlay.requestContentUpdate();

      const scroller = overlay.querySelector(scrollerTag);
      scroller.owner = host || this;
      scroller.getItemLabel = this._getItemLabel.bind(this);

      // Trigger the observer to set properties
      this._scroller = scroller;
    }

    /**
     * Override method inherited from `InputMixin`
     * to customize the input element.
     * @protected
     * @override
     */
    _inputElementChanged(inputElement) {
      super._inputElementChanged(inputElement);

      const input = this._nativeInput;

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

        if (this.clearElement) {
          this.clearElement.addEventListener('mousedown', this._boundOnClearButtonMouseDown);
        }
      }
    }

    /** @protected */
    _openedChanged(opened, wasOpened) {
      // Prevent _close() being called when opened is set to its default value (false).
      if (wasOpened === undefined) {
        return;
      }

      if (opened) {
        this._openedWithFocusRing = this.hasAttribute('focus-ring');
        // For touch devices, we don't want to popup virtual keyboard
        // unless input element is explicitly focused by the user.
        if (!this._isInputFocused() && !isTouch) {
          if (this.inputElement) {
            this.inputElement.focus();
          }
        }

        this._overlayElement.restoreFocusOnClose = true;
      } else if (this._openedWithFocusRing && this._isInputFocused()) {
        this.setAttribute('focus-ring', '');
      }

      const input = this._nativeInput;
      if (input) {
        input.setAttribute('aria-expanded', !!opened);

        if (opened) {
          input.setAttribute('aria-controls', this._scroller.id);
        } else {
          input.removeAttribute('aria-controls');
        }
      }
    }

    /** @private */
    _toggleElementChanged(toggleElement) {
      if (toggleElement) {
        // Don't blur the input on toggle mousedown
        toggleElement.addEventListener('mousedown', (e) => e.preventDefault());
        // Unfocus previously focused element if focus is not inside combo box (on touch devices)
        toggleElement.addEventListener('click', () => {
          if (isTouch && !this._isInputFocused()) {
            document.activeElement.blur();
          }
        });
      }
    }

    /** @protected */
    _getItemLabel(item, labelPath = 'label') {
      let label = item && labelPath ? get(labelPath, item) : undefined;
      if (label === undefined || label === null) {
        label = item ? item.toString() : '';
      }
      return label;
    }

    /** @protected */
    _isClearButton(event) {
      return event.composedPath()[0] === this.clearElement;
    }

    /** @protected */
    _isInputFocused() {
      return this.inputElement && isElementFocused(this.inputElement);
    }

    /** @private */
    __onClearButtonMouseDown(event) {
      event.preventDefault(); // Prevent native focusout event
      this.inputElement.focus();
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this._onClearAction();
    }

    /**
     * @param {Event} event
     * @private
     */
    _onToggleButtonClick(event) {
      // Prevent parent components such as `vaadin-grid`
      // from handling the click event after it bubbles.
      event.preventDefault();

      if (this.opened) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onHostClick(event) {
      if (!this.autoOpenDisabled) {
        event.preventDefault();
        this.open();
      }
    }

    /** @private */
    _onClick(event) {
      if (this._isClearButton(event)) {
        this._onClearButtonClick(event);
      } else if (event.composedPath().includes(this._toggleElement)) {
        this._onToggleButtonClick(event);
      } else {
        this._onHostClick(event);
      }
    }

    /** @private */
    _onTouchend(event) {
      if (!this.clearElement || event.composedPath()[0] !== this.clearElement) {
        return;
      }

      event.preventDefault();
      this._onClearAction();
    }
  };
