import '../../vaadin-select.js';
import {
  Select,
  SelectInvalidChangedEvent,
  SelectOpenedChangedEvent,
  SelectValueChangedEvent,
} from '../../vaadin-select.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const select: Select = document.createElement('vaadin-select');

select.addEventListener('opened-changed', (event) => {
  assertType<SelectOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

select.addEventListener('invalid-changed', (event) => {
  assertType<SelectInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

select.addEventListener('value-changed', (event) => {
  assertType<SelectValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
