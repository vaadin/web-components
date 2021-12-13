/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export { deepTargetFind };

/**
 * Finds the element rendered on the screen at the provided coordinates.
 *
 * Similar to `document.elementFromPoint`, but pierces through
 * shadow roots.
 *
 * @returns Returns the deepest shadowRoot inclusive element
 * found at the screen position given.
 */
declare function deepTargetFind(x: number, y: number): Element | null;

export { addListener };

/**
 * Adds an event listener to a node for the given gesture type.
 *
 * @returns Returns true if a gesture event listener was added.
 */
declare function addListener(node: EventTarget, evType: string, handler: (p0: Event) => void): boolean;

export { removeListener };

/**
 * Removes an event listener from a node for the given gesture type.
 *
 * @returns Returns true if a gesture event listener was removed.
 */
declare function removeListener(node: EventTarget, evType: string, handler: (p0: Event) => void): boolean;

export { register };

/**
 * Registers a new gesture event recognizer for adding new custom
 * gesture event types.
 */
declare function register(recog: GestureRecognizer): void;

export { setTouchAction };

/**
 * Sets scrolling direction on node.
 *
 * This value is checked on first move, thus it should be called prior to
 * adding event listeners.
 */
declare function setTouchAction(node: EventTarget, value: string): void;

export { prevent };

/**
 * Prevents the dispatch and default action of the given event name.
 */
declare function prevent(evName: string): void;

export interface GestureRecognizer {
  reset: () => void;
  mousedown?: (e: MouseEvent) => void;
  mousemove?: (e: MouseEvent) => void;
  mouseup?: (e: MouseEvent) => void;
  touchstart?: (e: TouchEvent) => void;
  touchmove?: (e: TouchEvent) => void;
  touchend?: (e: TouchEvent) => void;
  click?: (e: MouseEvent) => void;
}
