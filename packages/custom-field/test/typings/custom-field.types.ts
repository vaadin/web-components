import '../../vaadin-custom-field.js';
import { CustomFieldValueChangedEvent, CustomFieldInvalidChangedEvent } from '../../vaadin-custom-field.js';

const customField = document.createElement('vaadin-custom-field');

const assertType = <TExpected>(actual: TExpected) => actual;

customField.addEventListener('invalid-changed', (event) => {
  assertType<CustomFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

customField.addEventListener('value-changed', (event) => {
  assertType<CustomFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
