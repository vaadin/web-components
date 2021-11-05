import '../../vaadin-integer-field.js';
import { IntegerFieldInvalidChangedEvent, IntegerFieldValueChangedEvent } from '../../vaadin-integer-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-integer-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<IntegerFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<IntegerFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
