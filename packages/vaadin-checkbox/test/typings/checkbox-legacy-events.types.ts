import '../../vaadin-checkbox';
import { CheckboxCheckedChanged, CheckboxIndeterminateChanged } from '../../vaadin-checkbox';

const assertType = <TExpected>(actual: TExpected) => actual;

const checkbox = document.createElement('vaadin-checkbox');

checkbox.addEventListener('checked-changed', (event) => {
  assertType<CheckboxCheckedChanged>(event);
});

checkbox.addEventListener('indeterminate-changed', (event) => {
  assertType<CheckboxIndeterminateChanged>(event);
});
