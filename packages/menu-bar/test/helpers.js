import { sendKeys } from '@web/test-runner-commands';

export async function tab() {
  await sendKeys({ press: 'Tab' });
}

export async function shiftTab() {
  await sendKeys({ down: 'Shift' });
  await sendKeys({ press: 'Tab' });
  await sendKeys({ up: 'Shift' });
}
