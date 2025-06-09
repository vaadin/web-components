import '../../vaadin-custom-field.js';
import type {
  CustomField,
  CustomFieldChangeEvent,
  CustomFieldInvalidChangedEvent,
  CustomFieldValidatedEvent,
  CustomFieldValueChangedEvent,
} from '../../vaadin-custom-field.js';

const customField = document.createElement('vaadin-custom-field');

const assertType = <TExpected>(actual: TExpected) => actual;

customField.addEventListener('change', (event) => {
  assertType<CustomFieldChangeEvent>(event);
  assertType<CustomField>(event.target);
});

customField.addEventListener('invalid-changed', (event) => {
  assertType<CustomFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

customField.addEventListener('value-changed', (event) => {
  assertType<CustomFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

customField.addEventListener('validated', (event) => {
  assertType<CustomFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
