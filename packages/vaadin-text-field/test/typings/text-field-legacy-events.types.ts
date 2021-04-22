import '../../vaadin-text-field.js';
import '../../vaadin-text-area.js';
import '../../vaadin-password-field.js';

import { TextFieldInvalidChanged, TextFieldValueChanged } from '../../vaadin-text-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-text-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChanged>(event);
});

field.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChanged>(event);
});

const area = document.createElement('vaadin-text-area');

area.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChanged>(event);
});

area.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChanged>(event);
});

const password = document.createElement('vaadin-password-field');

password.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChanged>(event);
});

password.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChanged>(event);
});
