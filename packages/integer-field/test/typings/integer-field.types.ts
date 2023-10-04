import '../../vaadin-integer-field.js';
import type {
  IntegerField,
  IntegerFieldChangeEvent,
  IntegerFieldInvalidChangedEvent,
  IntegerFieldValidatedEvent,
  IntegerFieldValueChangedEvent,
} from '../../vaadin-integer-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-integer-field');

field.addEventListener('change', (event) => {
  assertType<IntegerFieldChangeEvent>(event);
  assertType<IntegerField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<IntegerFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<IntegerFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

field.addEventListener('validated', (event) => {
  assertType<IntegerFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
