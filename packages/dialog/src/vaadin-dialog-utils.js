/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Checks if the argument is a touch event and if so, returns a first touch.
 * Otherwise, if the mouse event was passed, returns it as is.
 * @param {!MouseEvent | !TouchEvent} e
 * @return {!MouseEvent | !Touch}
 * @protected
 */
export function getMouseOrFirstTouchEvent(e) {
  return e.touches ? e.touches[0] : e;
}

/**
 * Checks whether a mouse or touch event is in window.
 * @param {!MouseEvent | !TouchEvent} e
 * @return {boolean}
 * @protected
 */
export function eventInWindow(e) {
  return e.clientX >= 0 && e.clientX <= window.innerWidth && e.clientY >= 0 && e.clientY <= window.innerHeight;
}

const instancesMap = new WeakMap();

/**
 * Internal class handling dialog bounds and coordinates.
 */
export class DialogManager {
  static create(dialog) {
    if (instancesMap.has(dialog)) {
      return instancesMap.get(dialog);
    }

    const instance = new DialogManager(dialog);
    instancesMap.set(dialog, instance);
    return instance;
  }

  constructor(dialog) {
    this.host = dialog;
    this.overlay = dialog.$.overlay;
    this._originalBounds = {};
    this._originalMouseCoords = {};
  }

  handleEvent(e) {
    const event = getMouseOrFirstTouchEvent(e);
    this._originalBounds = this.overlay.getBounds();
    this._originalMouseCoords = { top: event.pageY, left: event.pageX };
    this.overlay.setBounds(this._originalBounds);
    this.overlay.setAttribute('has-bounds-set', '');
  }

  get bounds() {
    return this._originalBounds;
  }

  getEventXY(event) {
    return {
      x: event.pageX - this._originalMouseCoords.left,
      y: event.pageY - this._originalMouseCoords.top,
    };
  }
}
