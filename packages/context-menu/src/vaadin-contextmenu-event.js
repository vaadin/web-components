/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { isFirefox, isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { prevent, register } from '@vaadin/component-base/src/gestures.js';

register({
  name: 'vaadin-contextmenu',
  deps: ['touchstart', 'touchmove', 'touchend', 'contextmenu'],
  flow: {
    start: ['touchstart', 'contextmenu'],
    end: ['contextmenu'],
  },

  emits: ['vaadin-contextmenu'],

  info: {
    sourceEvent: null,
  },

  reset() {
    this.info.sourceEvent = null;
    this._cancelTimer();
    this.info.touchJob = null;
    this.info.touchStartCoords = null;
  },

  _cancelTimer() {
    if (this._timerId) {
      clearTimeout(this._timerId);
      delete this._fired;
    }
  },

  _setSourceEvent(e) {
    this.info.sourceEvent = e;

    const path = e.composedPath();

    // Calling `sourceEvent.composedPath()` after a timeout would return an empty array.
    // This is especially problematic on iOS where we configure the timer on touchstart.
    // Store the composed path to be used by `grid.getEventContext(event)` so it works.
    this.info.sourceEvent.__composedPath = path;
  },

  touchstart(e) {
    this._setSourceEvent(e);

    this.info.touchStartCoords = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    // After timeout event is already retargeted to the parent element in case there is one.
    // So we are assigning the target synchronously on event dispatched.
    const t = e.composedPath()[0] || e.target;

    this._timerId = setTimeout(() => {
      const ct = e.changedTouches[0];
      if (!e.shiftKey) {
        if (isIOS) {
          this._fired = true;
          this.fire(t, ct.clientX, ct.clientY);
        }

        // Needed to prevent any 'tap' gesture events from firing
        // which could potentially cancel/close the overlay.
        prevent('tap');
      }
    }, 500); // Default setting for Android and iOS.
  },

  touchmove(e) {
    const moveThreshold = 15;
    const touchStartCoords = this.info.touchStartCoords;
    if (
      Math.abs(touchStartCoords.x - e.changedTouches[0].clientX) > moveThreshold ||
      Math.abs(touchStartCoords.y - e.changedTouches[0].clientY) > moveThreshold
    ) {
      this._cancelTimer();
    }
  },

  touchend(e) {
    if (this._fired) {
      e.preventDefault();
    }
    this._cancelTimer();
  },

  contextmenu(e) {
    if (!e.shiftKey) {
      this._setSourceEvent(e);
      if (isFirefox && isKeyboardActive()) {
        // When using the context menu key on the keyboard in Windows, Firefox
        // does not always return the correct coordinates for the focused
        // element. Instead, calculate the coordinates manually based on the
        // context menu target. Need to use composed path here as the target for
        // synthetic contextmenu events seems to be the host element.
        // See https://github.com/vaadin/flow-components/issues/7153
        const keyboardTarget = e.composedPath()[0];
        const targetRect = keyboardTarget.getBoundingClientRect();
        this.fire(keyboardTarget, targetRect.left, targetRect.bottom);
      } else {
        // Otherwise use mouse coordinates reported in pointer event
        this.fire(e.target, e.clientX, e.clientY);
      }
      prevent('tap');
    }
  },

  fire(target, x, y) {
    // NOTE(web-padawan): the code below is copied from `Polymer.Gestures._fire`,
    // which is not exported from `gestures.js` module for Polymer 3.
    const sourceEvent = this.info.sourceEvent;
    const ev = new Event('vaadin-contextmenu', { bubbles: true, cancelable: true, composed: true });
    ev.detail = { x, y, sourceEvent };
    target.dispatchEvent(ev);
    // Forward `preventDefault` in a clean way
    if (ev.defaultPrevented && sourceEvent && sourceEvent.preventDefault) {
      sourceEvent.preventDefault();
    }
  },
});
