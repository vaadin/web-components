import { sendKeys as _sendKeys } from '@web/test-runner-commands';

export * from '@web/test-runner-commands';

export async function sendKeys(options) {
  if (options.press && options.press.includes('+')) {
    const [key, ...modifiers] = options.press
      .split('+')
      .map((modifier) => modifier.trim())
      .reverse();

    for (const modifier of modifiers.reverse()) {
      await _sendKeys({ down: modifier });
    }

    await _sendKeys({ press: key });

    for (const modifier of modifiers) {
      await _sendKeys({ up: modifier });
    }
    return;
  }

  await _sendKeys(options);
}
