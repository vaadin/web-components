import '../../vaadin-custom-field.js';
import { CustomFieldValueChanged, CustomFieldInvalidChanged } from '../../vaadin-custom-field.js';

const customField = document.createElement('vaadin-custom-field');

const assertType = <TExpected>(actual: TExpected) => actual;

customField.addEventListener('invalid-changed', (event) => {
  assertType<CustomFieldInvalidChanged>(event);
});

customField.addEventListener('value-changed', (event) => {
  assertType<CustomFieldValueChanged>(event);
});
