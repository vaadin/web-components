import { executeServerCommand } from '@web/test-runner-commands';

export * from '@web/test-runner-commands';

/**
 * Extends the `sendKeys` command to support sending multiple keys
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
 **/
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
