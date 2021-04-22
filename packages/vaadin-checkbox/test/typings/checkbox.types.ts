import '../../vaadin-checkbox.js';
import { CheckboxCheckedChangedEvent, CheckboxIndeterminateChangedEvent } from '../../vaadin-checkbox.js';

const assertType = <TExpected>(value: TExpected) => value;

const checkbox = document.createElement('vaadin-checkbox');

checkbox.addEventListener('checked-changed', (event) => {
  assertType<CheckboxCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

checkbox.addEventListener('indeterminate-changed', (event) => {
  assertType<CheckboxIndeterminateChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
