import '../../vaadin-password-field.js';
import type {
  PasswordField,
  PasswordFieldChangeEvent,
  PasswordFieldInvalidChangedEvent,
  PasswordFieldValidatedEvent,
  PasswordFieldValueChangedEvent,
} from '../../vaadin-password-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-password-field');

field.addEventListener('change', (event) => {
  assertType<PasswordFieldChangeEvent>(event);
  assertType<PasswordField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<PasswordFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<PasswordFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

field.addEventListener('validated', (event) => {
  assertType<PasswordFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
