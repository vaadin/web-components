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
 * @param {Element | MovePayload | ClickPayload} payload
 * @return {Promise<void>}
 *
 * @example
 * // Move the mouse to the center of an element
 * await sendMouseToElement(document.querySelector('#my-element'));
 *
 * // Click the left mouse button on an element
 * await sendMouseToElement({ type: 'click', element: document.querySelector('#my-element') });
 */
export async function sendMouseToElement(payload) {
  let element;
  if (payload instanceof Element) {
    element = payload;
    payload = { type: 'move' };
  } else {
    element = payload.element;
  }

  const rect = element.getBoundingClientRect();
  const x = Math.floor(rect.x + rect.width / 2);
  const y = Math.floor(rect.y + rect.height / 2);
  await executeServerCommand('send-mouse', { ...payload, position: [x, y] });
}
