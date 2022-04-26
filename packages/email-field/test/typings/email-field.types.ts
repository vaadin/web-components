import '../../vaadin-email-field.js';
import {
  EmailField,
  EmailFieldChangeEvent,
  EmailFieldInvalidChangedEvent,
  EmailFieldValueChangedEvent,
} from '../../vaadin-email-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-email-field');

field.addEventListener('change', (event) => {
  assertType<EmailFieldChangeEvent>(event);
  assertType<EmailField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<EmailFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<EmailFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
