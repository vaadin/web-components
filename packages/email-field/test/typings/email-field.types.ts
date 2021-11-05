import '../../vaadin-email-field.js';
import { EmailFieldInvalidChangedEvent, EmailFieldValueChangedEvent } from '../../vaadin-email-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-email-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<EmailFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<EmailFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
