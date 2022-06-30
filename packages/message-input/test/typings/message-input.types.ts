import '../../vaadin-message-input.js';
import type { MessageInputSubmitEvent } from '../../vaadin-message-input.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const input = document.createElement('vaadin-message-input');

input.addEventListener('submit', (event) => {
  assertType<MessageInputSubmitEvent>(event);
  assertType<string>(event.detail.value);
});
