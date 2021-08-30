import '../../vaadin-number-field.js';

import { NumberFieldInvalidChangedEvent, NumberFieldValueChangedEvent } from '../../vaadin-number-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-number-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<NumberFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<NumberFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
