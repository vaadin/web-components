/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Checks if the argument is a touch event and if so, returns a first touch.
 * On `touchend`, `touches` is empty and the released point is in `changedTouches`.
 * Otherwise, if the mouse event was passed, returns it as is.
 * @param {!MouseEvent | !TouchEvent} e
 * @return {!MouseEvent | !Touch}
 * @protected
 */
export function getMouseOrFirstTouchEvent(e) {
  return e.touches ? e.touches[0] || e.changedTouches[0] : e;
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

// Pointer movement in pixels above which a gesture is a drag, not a click.
// Same value as `TRACK_DISTANCE` in `@vaadin/component-base/src/gestures.js`.
const DRAG_DISTANCE = 5;

/**
 * Remembers where a pointer gesture started, to tell a click from a drag once it ends.
 */
export class ClickTracker {
  /** @type {{ x: number, y: number }} */
  #start;

  /**
   * Stores the position where the gesture started.
   * @param {!MouseEvent | !TouchEvent} e
   */
  start(e) {
    // Viewport coordinates, so scrolling during the gesture doesn't count as movement
    const { clientX, clientY } = getMouseOrFirstTouchEvent(e);
    this.#start = { x: clientX, y: clientY };
  }

  /**
   * Returns true if the pointer hasn't moved since the gesture started.
   * @param {!MouseEvent | !TouchEvent} e
   * @return {boolean}
   */
  isClick(e) {
    const { clientX, clientY } = getMouseOrFirstTouchEvent(e);
    return Math.abs(clientX - this.#start.x) < DRAG_DISTANCE && Math.abs(clientY - this.#start.y) < DRAG_DISTANCE;
  }
}
