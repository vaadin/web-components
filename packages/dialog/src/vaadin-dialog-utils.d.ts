/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
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
 */
declare function getMouseOrFirstTouchEvent(e: MouseEvent | TouchEvent): MouseEvent | Touch;

export { getMouseOrFirstTouchEvent };

/**
 * Checks whether a mouse or touch event is in window.
 */
declare function eventInWindow(e: MouseEvent | TouchEvent): boolean;

export { eventInWindow };
