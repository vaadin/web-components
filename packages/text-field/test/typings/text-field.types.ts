import '../../vaadin-text-field.js';
import { TextFieldInvalidChangedEvent, TextFieldValueChangedEvent } from '../../vaadin-text-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-text-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
