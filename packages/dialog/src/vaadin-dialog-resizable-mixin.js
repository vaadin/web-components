/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DialogManager, eventInWindow, getMouseOrFirstTouchEvent } from './vaadin-dialog-utils.js';

/**
 * @polymerMixin
 */
export const DialogResizableMixin = (superClass) =>
  class VaadinDialogResizableMixin extends superClass {
    static get properties() {
      return {
        /**
         * Set to true to enable resizing the dialog by dragging the corners and edges.
         * @type {boolean}
         */
        resizable: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();

      // Get or create an instance of manager
      this.__manager = DialogManager.create(this);

      this._resizeListeners = { start: {}, resize: {}, stop: {} };
      this._addResizeListeners();
    }

    /** @private */
    _addResizeListeners() {
      // Note: edge controls added before corners
      ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'].forEach((direction) => {
        const resizer = document.createElement('div');
        this._resizeListeners.start[direction] = (e) => this._startResize(e, direction);
        this._resizeListeners.resize[direction] = (e) => this._resize(e, direction);
        this._resizeListeners.stop[direction] = () => this._stopResize(direction);
        if (direction.length === 1) {
          resizer.classList.add('edge');
        }
        resizer.classList.add('resizer');
        resizer.classList.add(direction);
        resizer.addEventListener('mousedown', this._resizeListeners.start[direction]);
        resizer.addEventListener('touchstart', this._resizeListeners.start[direction]);
        this.$.overlay.$.resizerContainer.appendChild(resizer);
      });
    }

    /**
     * @param {!MouseEvent | !TouchEvent} e
     * @param {!DialogResizableDirection} direction
     * @protected
     */
    _startResize(e, direction) {
      // Don't initiate when there's more than 1 touch (pinch zoom)
      if (e.type === 'touchstart' && e.touches.length > 1) {
        return;
      }

      if (e.button === 0 || e.touches) {
        e.preventDefault();

        window.addEventListener('mousemove', this._resizeListeners.resize[direction]);
        window.addEventListener('touchmove', this._resizeListeners.resize[direction]);
        window.addEventListener('mouseup', this._resizeListeners.stop[direction]);
        window.addEventListener('touchend', this._resizeListeners.stop[direction]);

        this.__manager.handleEvent(e);
      }
    }

    /**
     * @param {!MouseEvent | !TouchEvent} e
     * @param {!DialogResizableDirection} resizer
     * @protected
     */
    _resize(e, resizer) {
      const event = getMouseOrFirstTouchEvent(e);
      if (eventInWindow(event)) {
        const minimumSize = 40;
        const { height: boundsHeight, width: boundsWidth, top: boundsTop, left: boundsLeft } = this.__manager.bounds;
        const { x: eventX, y: eventY } = this.__manager.getEventXY(event);

        resizer.split('').forEach((direction) => {
          switch (direction) {
            case 'n': {
              const height = boundsHeight - eventY;
              const top = boundsTop + eventY;
              if (height > minimumSize) {
                this.top = top;
                this.height = height;
              }
              break;
            }
            case 'e': {
              const width = boundsWidth + eventX;
              if (width > minimumSize) {
                this.width = width;
              }
              break;
            }
            case 's': {
              const height = boundsHeight + eventY;
              if (height > minimumSize) {
                this.height = height;
              }
              break;
            }
            case 'w': {
              const width = boundsWidth - eventX;
              const left = boundsLeft + eventX;
              if (width > minimumSize) {
                this.left = left;
                this.width = width;
              }
              break;
            }
            default:
              break;
          }
        });
      }
    }

    /**
     * @param {!DialogResizableDirection} direction
     * @protected
     */
    _stopResize(direction) {
      window.removeEventListener('mousemove', this._resizeListeners.resize[direction]);
      window.removeEventListener('touchmove', this._resizeListeners.resize[direction]);
      window.removeEventListener('mouseup', this._resizeListeners.stop[direction]);
      window.removeEventListener('touchend', this._resizeListeners.stop[direction]);
      this.dispatchEvent(new CustomEvent('resize', { detail: this._getResizeDimensions() }));
    }

    /**
     * @return {!DialogResizeDimensions}
     * @protected
     */
    _getResizeDimensions() {
      const { width, height, top, left } = getComputedStyle(this.$.overlay.$.overlay);
      return { width, height, top, left };
    }

    /**
     * Fired when the dialog resize is finished.
     *
     * @event resize
     */
  };
