import '../../vaadin-date-time-picker.js';
import { DateTimePickerValueChangedEvent, DateTimePickerInvalidChangedEvent } from '../../vaadin-date-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const picker = document.createElement('vaadin-date-time-picker');

picker.addEventListener('invalid-changed', (event) => {
  assertType<DateTimePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

picker.addEventListener('value-changed', (event) => {
  assertType<DateTimePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
