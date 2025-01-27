import { executeServerCommand } from '@web/test-runner-commands';

export * from '@web/test-runner-commands';

/**
 * Extends the `sendMouse` command to support moving the mouse
 * to the center of an element.
 *
 * Remember to call `resetMouse()` after the test to reset
 * the mouse position to avoid affecting other tests.
 *
 * @param {Element} element
 */
export async function sendMouse({ element, position, ...options }) {
  if (element) {
    const rect = element.getBoundingClientRect();
    const x = Math.floor(rect.x + rect.width / 2);
    const y = Math.floor(rect.y + rect.height / 2);
    position = [x, y];
  }

  await executeServerCommand('send-mouse', { ...options, position });
}
