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
 * @example
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

/**
 * Extends the `sendKeys` command to support pressing multiple keys
 * simultaneously when provided in the format "Shift+Tab". This format
 * is natively supported by Playwright but not by Puppeteer. This wrapper
 * enables the same syntax to be used in Puppeteer.
 *
 * In WebDriver, this functionality is still unavailable because
 * web-test-runner does not provide an API for holding keys down.
 *
 * For more documentation on the original command, please see
 * https://modern-web.dev/docs/test-runner/commands/#send-keys
 *
 * @typedef {{ type: string }} TypePayload
 * @typedef {{ press: string }} PressPayload
 * @typedef {{ down: string }} DownPayload
 * @typedef {{ up: string }} UpPayload
 * @param payload {TypePayload | PressPayload | DownPayload | UpPayload}
 *
 * @example
 * // Tab to the next element
 * await sendKeys({ press: 'Tab' });
 *
 * @example
 * // Tab to the previous element
 * await sendKeys({ press: 'Shift+Tab' });
 *
 * @example
 * await sendKeys({ down: 'Shift' });
 * // Do something while holding Shift
 * await sendKeys({ up: 'Shift' });
 */
export async function sendKeys(payload) {
  const { press } = payload;
  if (press && press.includes('+')) {
    const keys = press.split('+').map((key) => key.trim());

    for (const key of keys) {
      await executeServerCommand('send-keys', { down: key });
    }

    for (const key of keys.reverse()) {
      await executeServerCommand('send-keys', { up: key });
    }

    return;
  }

  await executeServerCommand('send-keys', payload);
}
