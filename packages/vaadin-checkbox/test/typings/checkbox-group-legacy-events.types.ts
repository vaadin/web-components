import '../../vaadin-checkbox-group.js';
import { CheckboxGroupInvalidChanged, CheckboxGroupValueChanged } from '../../vaadin-checkbox-group.js';

const assertType = <TExpected>(value: TExpected) => value;

const group = document.createElement('vaadin-checkbox-group');

group.addEventListener('invalid-changed', (event) => {
  assertType<CheckboxGroupInvalidChanged>(event);
});

group.addEventListener('value-changed', (event) => {
  assertType<CheckboxGroupValueChanged>(event);
});
