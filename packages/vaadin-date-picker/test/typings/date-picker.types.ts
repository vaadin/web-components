import '../../vaadin-date-picker.js';
import {
  DatePickerOpenedChangedEvent,
  DatePickerInvalidChangedEvent,
  DatePickerValueChangedEvent
} from '../../vaadin-date-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const datePicker = document.createElement('vaadin-date-picker');

datePicker.addEventListener('opened-changed', (event) => {
  assertType<DatePickerOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

datePicker.addEventListener('invalid-changed', (event) => {
  assertType<DatePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

datePicker.addEventListener('value-changed', (event) => {
  assertType<DatePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
