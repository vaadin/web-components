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

let ariaSnapshotId = 0;

/**
 * Returns the Playwright aria snapshot of an element as YAML: the roles,
 * accessible names and states of the element and its descendants, including
 * shadow DOM and slotted content.
 *
 * @param {Element} element
 * @return {Promise<string>}
 *
 * @example
 * const yaml = await ariaSnapshot(document.querySelector('vaadin-button'));
 */
export async function ariaSnapshot(element) {
  ariaSnapshotId += 1;
  const id = `${ariaSnapshotId}`;
  // Commands can only receive JSON, so mark the element to find it by a selector.
  element.setAttribute('data-aria-snapshot', id);
  try {
    return await executeServerCommand('aria-snapshot', { selector: `[data-aria-snapshot="${id}"]` });
  } finally {
    element.removeAttribute('data-aria-snapshot');
  }
}
