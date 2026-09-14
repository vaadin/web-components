/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { getMouseOrFirstTouchEvent } from './vaadin-dialog-utils.js';

// Pointer movement in pixels above which a gesture is a drag, not a click.
// Same value as `TRACK_DISTANCE` in `@vaadin/component-base/src/gestures.js`.
const DRAG_DISTANCE = 5;

export const DialogBaseMixin = (superClass) =>
  class DialogBaseMixin extends superClass {
    /** Pointer position where the current drag or resize gesture started */
    #gestureStart = null;

    static get properties() {
      return {
        /**
         * True if the dialog is visible and available for interaction.
         */
        opened: {
          type: Boolean,
          reflectToAttribute: true,
          value: false,
          notify: true,
          sync: true,
        },

        /**
         * Set to true to disable closing dialog on outside click
         * @attr {boolean} no-close-on-outside-click
         */
        noCloseOnOutsideClick: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to disable closing dialog on Escape press
         * @attr {boolean} no-close-on-esc
         */
        noCloseOnEsc: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to remove backdrop and allow click events on background elements.
         */
        modeless: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to prevent the dialog from receiving focus
         * on open and trapping it inside.
         *
         * @attr {boolean} no-focus-trap
         * @deprecated This property is deprecated and will be removed in Vaadin 26.
         */
        noFocusTrap: {
          type: Boolean,
          value: false,
        },

        /**
         * Set to true to prevent focus from moving into the dialog on open.
         *
         * This property only works for non-modal dialogs and is ignored
         * for modal ones, where focus must always stay inside.
         *
         * @attr {boolean} no-autofocus
         */
        noAutofocus: {
          type: Boolean,
          value: false,
        },

        /**
         * Set the distance of the dialog from the top of the viewport.
         * If a unitless number is provided, pixels are assumed.
         *
         * Note that the dialog uses an internal container that has some
         * additional spacing, which can be overridden by the theme.
         */
        top: {
          type: String,
        },

        /**
         * Set the distance of the dialog from the left of the viewport.
         * If a unitless number is provided, pixels are assumed.
         *
         * Note that the dialog uses an internal container that has some
         * additional spacing, which can be overridden by the theme.
         */
        left: {
          type: String,
        },

        /**
         * The `role` attribute value to be set on the dialog. Defaults to "dialog".
         *
         * @attr {string} overlay-role
         * @deprecated Use standard `role` attribute on the dialog instead
         */
        overlayRole: {
          type: String,
        },

        /**
         * Set to true to prevent the dialog from moving outside the viewport bounds.
         * When enabled, all four edges of the dialog will remain visible, for example
         * when dragging the dialog or when the viewport is resized. Note that the
         * dialog will also adjust any programmatically configured size and position
         * so that it stays within the viewport.
         * @attr {boolean} keep-in-viewport
         */
        keepInViewport: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    static get observers() {
      return ['__positionChanged(top, left)'];
    }

    /** @protected */
    ready() {
      super.ready();

      const overlay = this.$.overlay;

      overlay.addEventListener('vaadin-overlay-outside-click', this._handleOutsideClick.bind(this));
      overlay.addEventListener('vaadin-overlay-escape-press', this._handleEscPress.bind(this));
      overlay.addEventListener('vaadin-overlay-closed', this.__handleOverlayClosed.bind(this));

      this._overlayElement = overlay;

      if (!this.hasAttribute('role')) {
        this.role = 'dialog';
      }

      this.setAttribute('tabindex', '0');
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('overlayRole')) {
        this.role = this.overlayRole || 'dialog';
      }

      if (props.has('modeless')) {
        setOrRemoveAttribute(this, 'aria-modal', !this.modeless);
      }
    }

    /** @private */
    __handleOverlayClosed() {
      this.dispatchEvent(new CustomEvent('closed'));
    }

    /**
     * Remembers where a drag or resize gesture started, so that `_focusOnGestureEnd()`
     * can tell a click from a drag. Does nothing when the dialog already contains focus.
     *
     * @param {!MouseEvent | !TouchEvent} event
     * @protected
     */
    _saveGestureStart(event) {
      const hasFocus = this.$.overlay._deepContains(getDeepActiveElement());
      const { clientX, clientY } = getMouseOrFirstTouchEvent(event);
      this.#gestureStart = hasFocus ? null : { x: clientX, y: clientY };
    }

    /**
     * Focuses the dialog when a drag or resize gesture ends without the pointer moving,
     * so that a modeless dialog responds to Esc after being clicked. A real drag leaves
     * focus alone, to not interrupt editing elsewhere.
     *
     * @param {!MouseEvent | !TouchEvent} event
     * @protected
     */
    _focusOnGestureEnd(event) {
      const start = this.#gestureStart;
      this.#gestureStart = null;

      if (!start) {
        return;
      }

      // Viewport coordinates, so scrolling during the gesture doesn't count as movement
      const { clientX, clientY } = getMouseOrFirstTouchEvent(event);
      if (Math.abs(clientX - start.x) < DRAG_DISTANCE && Math.abs(clientY - start.y) < DRAG_DISTANCE) {
        this.focus({ preventScroll: true, focusVisible: isKeyboardActive() });
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // Restore opened state if overlay was opened when disconnecting
      if (this.__restoreOpened) {
        this.opened = true;
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      // Automatically close the overlay when dialog is removed from DOM
      // Using a timeout to avoid toggling opened state, and dispatching change
      // events, when just moving the dialog in the DOM
      setTimeout(() => {
        if (!this.isConnected) {
          this.__restoreOpened = this.opened;
          this.opened = false;
        }
      });
    }

    /** @protected */
    _onOverlayOpened(e) {
      if (e.detail.value === false) {
        this.opened = false;
      }
    }

    /**
     * Close the dialog if `noCloseOnOutsideClick` isn't set to true
     * @private
     */
    _handleOutsideClick(e) {
      if (this.noCloseOnOutsideClick) {
        e.preventDefault();
      }
    }

    /**
     * Close the dialog if `noCloseOnEsc` isn't set to true
     * @private
     */
    _handleEscPress(e) {
      if (this.noCloseOnEsc) {
        e.preventDefault();
      }
    }

    /** @private */
    _bringOverlayToFront(event) {
      if (!this.modeless) {
        return;
      }
      this._overlayElement.bringToFront(event);
    }

    /** @private */
    __positionChanged(top, left) {
      requestAnimationFrame(() => this.$.overlay.setBounds({ top, left }));
    }

    /** @private */
    __sizeChanged(width, height) {
      requestAnimationFrame(() => this.$.overlay.setBounds({ width, height }, false));
    }
  };
