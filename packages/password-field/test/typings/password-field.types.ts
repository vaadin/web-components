import '../../vaadin-password-field.js';

import { PasswordFieldInvalidChangedEvent, PasswordFieldValueChangedEvent } from '../../vaadin-password-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-password-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<PasswordFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<PasswordFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
