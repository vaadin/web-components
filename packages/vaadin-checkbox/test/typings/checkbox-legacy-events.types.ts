import '../../vaadin-checkbox.js';
import { CheckboxCheckedChanged, CheckboxIndeterminateChanged } from '../../vaadin-checkbox.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const checkbox = document.createElement('vaadin-checkbox');

checkbox.addEventListener('checked-changed', (event) => {
  assertType<CheckboxCheckedChanged>(event);
});

checkbox.addEventListener('indeterminate-changed', (event) => {
  assertType<CheckboxIndeterminateChanged>(event);
});
