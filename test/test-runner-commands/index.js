import { executeServerCommand } from '@web/test-runner-commands';

export * from '@web/test-runner-commands';

export async function sendKeys(options) {
  const { press } = options;
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

  await executeServerCommand('send-keys', options);
}
