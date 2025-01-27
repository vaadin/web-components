import { executeServerCommand } from '@web/test-runner-commands';

export * from '@web/test-runner-commands';

/**
 * Moves the mouse to the center of an element and
 *
 * Remember to call `resetMouse()` after the test to reset
 * the mouse position to avoid affecting other tests.
 *
 * @param {Element} element
 */
export async function sendMouseToElement(options) {
  let element;

  if (options instanceof Element) {
    element = options;
    options = {};
  } else {
    element = options.element;
  }

  const rect = element.getBoundingClientRect();
  const x = Math.floor(rect.x + rect.width / 2);
  const y = Math.floor(rect.y + rect.height / 2);
  const position = [x, y];

  await executeServerCommand('send-mouse', { type: 'move', position, ...options });
}
