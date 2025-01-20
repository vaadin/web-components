import { sendKeys } from '@vaadin/test-runner-commands';

export async function esc() {
  await sendKeys({ press: 'Escape' });
}

export async function tab() {
  await sendKeys({ press: 'Tab' });
}

export async function shiftTab() {
  await sendKeys({ press: 'Shift+Tab' });
}
