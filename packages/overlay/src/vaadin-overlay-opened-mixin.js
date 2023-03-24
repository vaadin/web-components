/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusTrapController } from '@vaadin/a11y-base/src/focus-trap-controller.js';

/**
 * @polymerMixin
 */
export const OpenedMixin = (superClass) =>
  class OpenedMixin extends superClass {
    static get properties() {
      return {
        /**
         * When true, the overlay is visible and attached to body.
         */
        opened: {
          type: Boolean,
          notify: true,
          observer: '_openedChanged',
          reflectToAttribute: true,
        },

        /** @protected */
        _overlay: {
          type: Object,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();

      this._overlay = this.$.overlay;
    }

    /**
     * Closes the overlay.
     */
    close() {
      this._close();
    }

    /** @protected */
    _attachOverlay() {
      this._placeholder = document.createComment('vaadin-overlay-placeholder');
      this.parentNode.insertBefore(this._placeholder, this);
      document.body.appendChild(this);
      this.bringToFront();
    }

    /**
     * @param {Event=} sourceEvent
     * @protected
     */
    _close(sourceEvent) {
      const evt = new CustomEvent('vaadin-overlay-close', {
        bubbles: true,
        cancelable: true,
        detail: { sourceEvent },
      });
      this.dispatchEvent(evt);
      if (!evt.defaultPrevented) {
        this.opened = false;
      }
    }

    /** @protected */
    _detachOverlay() {
      this._placeholder.parentNode.insertBefore(this, this._placeholder);
      this._placeholder.parentNode.removeChild(this._placeholder);
    }
  };
