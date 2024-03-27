/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
