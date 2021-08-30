import '../../vaadin-checkbox-group.js';
import { CheckboxGroupInvalidChangedEvent, CheckboxGroupValueChangedEvent } from '../../vaadin-checkbox-group.js';

const assertType = <TExpected>(value: TExpected) => value;

const group = document.createElement('vaadin-checkbox-group');

group.addEventListener('invalid-changed', (event) => {
  assertType<CheckboxGroupInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assertType<CheckboxGroupValueChangedEvent>(event);
  assertType<string[]>(event.detail.value);
});
