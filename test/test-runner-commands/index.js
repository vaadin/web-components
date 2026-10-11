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

let a11yTreeId = 0;

/**
 * Returns the Chromium accessibility tree of an element: the roles, names,
 * descriptions, values, states and relations of the element and its
 * descendants, including shadow DOM and slotted content.
 *
 * @param {Element} element
 * @return {Promise<Array<object>>}
 *
 * @example
 * const tree = await getA11yTree(document.querySelector('vaadin-text-field'));
 */
export async function getA11yTree(element) {
  a11yTreeId += 1;
  const id = `${a11yTreeId}`;
  // Commands can only receive JSON, so the server reads the element from a global map.
  globalThis.__a11yTreeTargets ||= new Map();
  globalThis.__a11yTreeTargets.set(id, element);
  try {
    return await executeServerCommand('get-a11y-tree', { id });
  } finally {
    globalThis.__a11yTreeTargets.delete(id);
  }
}
