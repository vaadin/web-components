import { a11ySnapshot, executeServerCommand } from '@web/test-runner-commands';

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
 * Returns an accessibility snapshot of the page that lists only the nodes of
 * an element. The format is the same as for `a11ySnapshot()`: the root node
 * is the page, and its children are the nodes of the element.
 *
 * `a11ySnapshot({ selector })` fails for an element that the snapshot does not
 * include, such as a custom element with no role. This function sets
 * `aria-hidden` on other page content while the command runs instead.
 *
 * The element must be in the light DOM, such as a test fixture.
 *
 * @param {Element} element
 * @return {Promise<A11ySnapshotNode>}
 *
 * @example
 * const snapshot = await a11ySnapshotOfElement(document.querySelector('vaadin-text-field'));
 */
export async function a11ySnapshotOfElement(element) {
  const { body } = element.ownerDocument;
  const hidden = [];
  for (let node = element; node !== body; node = node.parentElement) {
    [...node.parentElement.children].forEach((sibling) => {
      if (sibling !== node && !sibling.hasAttribute('aria-hidden')) {
        sibling.setAttribute('aria-hidden', 'true');
        hidden.push(sibling);
      }
    });
  }
  try {
    return await a11ySnapshot({});
  } finally {
    hidden.forEach((sibling) => sibling.removeAttribute('aria-hidden'));
  }
}
