/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { eventInWindow, getMouseOrFirstTouchEvent } from './vaadin-dialog-utils.js';

/**
 * @polymerMixin
 */
export const DialogDraggableMixin = (superClass) =>
  class VaadinDialogDraggableMixin extends superClass {
    static get properties() {
      return {
        /**
         * Set to true to enable repositioning the dialog by clicking and dragging.
         *
         * By default, only the overlay area can be used to drag the element. But,
         * a child element can be marked as a draggable area by adding a
         * "`draggable`" class to it, this will by default make all of its children draggable also.
         * If you want a child element to be draggable
         * but still have its children non-draggable (by default), mark it with
         * "`draggable-leaf-only`" class name.
         *
         * @type {boolean}
         */
        draggable: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /** @private */
        _touchDevice: {
          type: Boolean,
          value: isTouch,
        },

        /* TODO: Expose as a public property (check naming) */
        __dragHandleClassName: {
          type: String,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this._originalBounds = {};
      this._originalMouseCoords = {};
      this._startDrag = this._startDrag.bind(this);
      this._drag = this._drag.bind(this);
      this._stopDrag = this._stopDrag.bind(this);

      this.$.overlay.$.overlay.addEventListener('mousedown', this._startDrag);
      this.$.overlay.$.overlay.addEventListener('touchstart', this._startDrag);
    }

    /** @private */
    _startDrag(e) {
      // Don't initiate when there's more than 1 touch (pinch zoom)
      if (e.type === 'touchstart' && e.touches.length > 1) {
        return;
      }

      if (this.draggable && (e.button === 0 || e.touches)) {
        const resizerContainer = this.$.overlay.$.resizerContainer;
        const isResizerContainer = e.target === resizerContainer;
        const isResizerContainerScrollbar =
          e.offsetX > resizerContainer.clientWidth || e.offsetY > resizerContainer.clientHeight;
        const isContentPart = e.target === this.$.overlay.$.content;

        const isDraggable = e.composedPath().some((node, index) => {
          if (!node.classList) {
            return false;
          }

          const isDraggableNode = node.classList.contains(this.__dragHandleClassName || 'draggable');
          const isDraggableLeafOnly = node.classList.contains('draggable-leaf-only');
          const isLeafNode = index === 0;
          return (isDraggableLeafOnly && isLeafNode) || (isDraggableNode && (!isDraggableLeafOnly || isLeafNode));
        });

        if ((isResizerContainer && !isResizerContainerScrollbar) || isContentPart || isDraggable) {
          if (!isDraggable) {
            e.preventDefault();
          }
          this._originalBounds = this.$.overlay.getBounds();
          const event = getMouseOrFirstTouchEvent(e);
          this._originalMouseCoords = { top: event.pageY, left: event.pageX };
          window.addEventListener('mouseup', this._stopDrag);
          window.addEventListener('touchend', this._stopDrag);
          window.addEventListener('mousemove', this._drag);
          window.addEventListener('touchmove', this._drag);
          if (this.$.overlay.$.overlay.style.position !== 'absolute') {
            const { top, left } = this._originalBounds;
            this.$.overlay.setBounds({ top, left });
          }
        }
      }
    }

    /** @private */
    _drag(e) {
      const event = getMouseOrFirstTouchEvent(e);
      if (eventInWindow(event)) {
        const top = this._originalBounds.top + (event.pageY - this._originalMouseCoords.top);
        const left = this._originalBounds.left + (event.pageX - this._originalMouseCoords.left);
        this.top = top;
        this.left = left;
      }
    }

    /** @private */
    _stopDrag() {
      this.dispatchEvent(
        new CustomEvent('dragged', { bubbles: true, composed: true, detail: { top: this.top, left: this.left } }),
      );
      window.removeEventListener('mouseup', this._stopDrag);
      window.removeEventListener('touchend', this._stopDrag);
      window.removeEventListener('mousemove', this._drag);
      window.removeEventListener('touchmove', this._drag);
    }

    /**
     * Fired when the dialog drag is finished.
     *
     * @event dragged
     */
  };
