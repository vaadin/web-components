/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { eventInWindow, getMouseOrFirstTouchEvent } from './vaadin-dialog-utils.js';
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
      this._originalBounds = {};
      this._originalMouseCoords = {};
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

        this._originalBounds = this.$.overlay.getBounds();
        const event = getMouseOrFirstTouchEvent(e);
        this._originalMouseCoords = { top: event.pageY, left: event.pageX };
        window.addEventListener('mousemove', this._resizeListeners.resize[direction]);
        window.addEventListener('touchmove', this._resizeListeners.resize[direction]);
        window.addEventListener('mouseup', this._resizeListeners.stop[direction]);
        window.addEventListener('touchend', this._resizeListeners.stop[direction]);
        if (this.$.overlay.$.overlay.style.position !== 'absolute' || this.width || this.height) {
          this.$.overlay.setBounds(this._originalBounds);
        }
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
        resizer.split('').forEach((direction) => {
          switch (direction) {
            case 'n': {
              const height = this._originalBounds.height - (event.pageY - this._originalMouseCoords.top);
              const top = this._originalBounds.top + (event.pageY - this._originalMouseCoords.top);
              if (height > minimumSize) {
                this.top = top;
                this.height = height;
              }
              break;
            }
            case 'e': {
              const width = this._originalBounds.width + (event.pageX - this._originalMouseCoords.left);
              if (width > minimumSize) {
                this.width = width;
              }
              break;
            }
            case 's': {
              const height = this._originalBounds.height + (event.pageY - this._originalMouseCoords.top);
              if (height > minimumSize) {
                this.height = height;
              }
              break;
            }
            case 'w': {
              const width = this._originalBounds.width - (event.pageX - this._originalMouseCoords.left);
              const left = this._originalBounds.left + (event.pageX - this._originalMouseCoords.left);
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
      const scrollPosition = this.$.overlay.$.resizerContainer.scrollTop;
      const { width, height, top, left } = getComputedStyle(this.$.overlay.$.overlay);
      const content = this.$.overlay.$.content;
      content.setAttribute(
        'style',
        'position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: content-box; height: auto;',
      );
      const { width: contentWidth, height: contentHeight } = getComputedStyle(content);
      content.removeAttribute('style');
      this.$.overlay.$.resizerContainer.scrollTop = scrollPosition;
      return { width, height, contentWidth, contentHeight, top, left };
    }

    /**
     * Fired when the dialog resize is finished.
     *
     * @event resize
     */
  };
