/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

// Listen for top-level keydown and mousedown events.
// Use capture phase so we detect events even if they're handled.
window.addEventListener(
  'keydown',
  () => {
    keyboardActive = true;
  },
  { capture: true }
);

window.addEventListener(
  'mousedown',
  () => {
    keyboardActive = false;
  },
  { capture: true }
);

/**
 * A private mixin to avoid problems with dynamic properties and Polymer Analyzer.
 * No need to expose these properties in the API docs.
 * @polymerMixin
 * @private
 */
const TabIndexMixin = (superClass) =>
  class VaadinTabIndexMixin extends superClass {
    static get properties() {
      return {
        /**
         * Internal property needed to listen to `tabindex` attribute changes.
         *
         * For changing the tabindex of this component use the native `tabIndex` property.
         * @private
         */
        tabindex: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
          observer: '_tabindexChanged'
        }
      };
    }
  };

/**
 * Polymer.IronControlState is not a proper 2.0 class, also, its tabindex
 * implementation fails in the shadow dom, so we have this for vaadin elements.
 * @polymerMixin
 */
export const ShadowFocusMixin = (superClass) =>
  class VaadinControlStateMixin extends TabIndexMixin(superClass) {
    static get properties() {
      return {
        /**
         * Specify that this control should have input focus when the page loads.
         */
        autofocus: {
          type: Boolean
        },

        /**
         * Stores the previous value of tabindex attribute of the disabled element
         * @private
         */
        _previousTabIndex: {
          type: Number
        },

        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          observer: '_disabledChanged',
          reflectToAttribute: true
        },

        /**
         * @private
         */
        _isShiftTabbing: {
          type: Boolean
        }
      };
    }

    /**
     * @protected
     */
    ready() {
      this.addEventListener('focusin', (e) => {
        if (e.composedPath()[0] === this) {
          // Only focus if the focus is received from somewhere outside
          if (!this.contains(e.relatedTarget)) {
            this._focus();
          }
        } else if (e.composedPath().indexOf(this.focusElement) !== -1 && !this.disabled) {
          this._setFocused(true);
        }
      });
      this.addEventListener('focusout', () => this._setFocused(false));

      // In super.ready() other 'focusin' and 'focusout' listeners might be
      // added, so we call it after our own ones to ensure they execute first.
      // Issue to watch out: when incorrect, <vaadin-combo-box> refocuses the
      // input field on iOS after “Done” is pressed.
      super.ready();

      this.addEventListener('keydown', (e) => {
        if (!e.defaultPrevented && e.keyCode === 9 && e.shiftKey) {
          // Flag is checked in _focus event handler.
          this._isShiftTabbing = true;
          HTMLElement.prototype.focus.apply(this);
          this._setFocused(false);
          // Event handling in IE is asynchronous and the flag is removed asynchronously as well
          setTimeout(() => (this._isShiftTabbing = false), 0);
        }
      });

      if (this.autofocus && !this.disabled) {
        window.requestAnimationFrame(() => {
          this._focus();
          this._setFocused(true);
          this.setAttribute('focus-ring', '');
        });
      }
    }

    /**
     * @protected
     */
    disconnectedCallback() {
      super.disconnectedCallback();

      // in non-Chrome browsers, blur does not fire on the element when it is disconnected.
      // reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
      if (this.hasAttribute('focused')) {
        this._setFocused(false);
      }
    }

    /**
     * @param {boolean} focused
     * @protected
     */
    _setFocused(focused) {
      if (focused) {
        this.setAttribute('focused', '');
      } else {
        this.removeAttribute('focused');
      }

      // focus-ring is true when the element was focused from the keyboard.
      // Focus Ring [A11ycasts]: https://youtu.be/ilj2P5-5CjI
      if (focused && keyboardActive) {
        this.setAttribute('focus-ring', '');
      } else {
        this.removeAttribute('focus-ring');
      }
    }

    /**
     * Any element extending this mixin is required to implement this getter.
     * It returns the actual focusable element in the component.
     * @return {Element | null | undefined}
     */
    get focusElement() {
      window.console.warn(`Please implement the 'focusElement' property in <${this.localName}>`);
      return this;
    }

    /**
     * @protected
     */
    _focus() {
      if (!this.focusElement || this._isShiftTabbing) {
        return;
      }

      this.focusElement.focus();
      this._setFocused(true);
    }

    /**
     * Moving the focus from the host element causes firing of the blur event what leads to problems in IE.
     * @private
     */
    focus() {
      if (!this.focusElement || this.disabled) {
        return;
      }

      this.focusElement.focus();
      this._setFocused(true);
    }

    /**
     * Native bluring in the host element does nothing because it does not have the focus.
     * In chrome it works, but not in FF.
     * @private
     */
    blur() {
      if (!this.focusElement) {
        return;
      }
      this.focusElement.blur();
      this._setFocused(false);
    }

    /**
     * @param {boolean} disabled
     * @private
     */
    _disabledChanged(disabled) {
      this.focusElement.disabled = disabled;
      if (disabled) {
        this.blur();
        this._previousTabIndex = this.tabindex;
        this.tabindex = -1;
        this.setAttribute('aria-disabled', 'true');
      } else {
        if (typeof this._previousTabIndex !== 'undefined') {
          this.tabindex = this._previousTabIndex;
        }
        this.removeAttribute('aria-disabled');
      }
    }

    /**
     * @param {number | null | undefined} tabindex
     * @private
     */
    _tabindexChanged(tabindex) {
      if (tabindex !== undefined) {
        this.focusElement.tabIndex = tabindex;
      }

      if (this.disabled && this.tabindex) {
        // If tabindex attribute was changed while checkbox was disabled
        if (this.tabindex !== -1) {
          this._previousTabIndex = this.tabindex;
        }
        this.tabindex = tabindex = undefined;
      }
    }

    /**
     * @protected
     */
    click() {
      if (!this.disabled) {
        super.click();
      }
    }
  };
