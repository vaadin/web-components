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
