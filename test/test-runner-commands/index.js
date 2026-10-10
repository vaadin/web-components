import { executeServerCommand } from '@web/test-runner-commands';

export * from '@web/test-runner-commands';

/**
 * Moves the mouse to the center of an element and optionally clicks
 * a mouse button on it.
 *
 * After using this function, remember to call `resetMouse` to reset
 * the mouse position and avoid affecting other tests.
 *
 * @typedef {{ type: 'move', element: Element }} MovePayload
 * @typedef {{ type: 'click', element: Element, button?: 'left' | 'middle' | 'right' }} ClickPayload
 * @param {MovePayload | ClickPayload} payload
 * @return {Promise<void>}
 *
 * @example
 * // Move the mouse to the center of an element
 * await sendMouseToElement({ type: 'move', element: document.querySelector('#my-element') });
 *
 * @example
 * // Click the left mouse button on an element
 * await sendMouseToElement({ type: 'click', element: document.querySelector('#my-element') });
 */
export async function sendMouseToElement(payload) {
  const { element, type } = payload;
  const rect = element.getBoundingClientRect();
  const x = Math.floor(rect.x + rect.width / 2);
  const y = Math.floor(rect.y + rect.height / 2);
  await executeServerCommand('send-mouse', { type, position: [x, y] });
}

/**
 * Returns the accessibility tree that the browser computes for the page, as
 * a list of the nodes that are not ignored, in tree order. Each node has its
 * role, its accessible name, its depth in the tree, and its properties, e.g.
 * `level` for headings. Returns null in browsers that don't support it, which
 * is currently all but Chromium.
 *
 * @return {Promise<Array<{ role: string, name: string, depth: number, properties: Record<string, unknown> }> | null>}
 */
export async function getAccessibilityTree() {
  const tree = await executeServerCommand('accessibility-tree');
  return tree || null;
}

/**
 * Makes the browser emulate a touch device, so that e.g. the `(pointer: coarse)`
 * media query matches. Remember to turn it off again after the test. Returns
 * false in browsers that don't support it, which is currently all but Chromium.
 *
 * @param {boolean} enabled
 * @return {Promise<boolean>}
 */
export function setTouchEmulation(enabled) {
  return executeServerCommand('emulate-touch', { enabled });
}

/**
 * Sends real touch input to the browser, which the browser also uses for
 * scrolling and zooming, unlike synthetic events. The points are in CSS
 * pixels of the page. Returns false in browsers that don't support it, which
 * is currently all but Chromium.
 *
 * @param {'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel'} type
 * @param {Array<{ x: number, y: number, id: number }>} touchPoints all touches that are down after the event
 * @return {Promise<boolean>}
 */
export function dispatchTouch(type, touchPoints) {
  return executeServerCommand('dispatch-touch', { type, touchPoints });
}
