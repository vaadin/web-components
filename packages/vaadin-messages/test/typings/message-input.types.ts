import '../../vaadin-message-input.js';

import { MessageInputSubmit } from '../../vaadin-message-input.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const input = document.createElement('vaadin-message-input');

input.addEventListener('submit', (event) => {
  assertType<MessageInputSubmit>(event);
  assertType<string>(event.detail.value);
});
