import '../../vaadin-date-picker.js';
import { DatePickerOpenedChanged, DatePickerInvalidChanged, DatePickerValueChanged } from '../../vaadin-date-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const datePicker = document.createElement('vaadin-date-picker');

datePicker.addEventListener('opened-changed', (event) => {
  assertType<DatePickerOpenedChanged>(event);
});

datePicker.addEventListener('invalid-changed', (event) => {
  assertType<DatePickerInvalidChanged>(event);
});

datePicker.addEventListener('value-changed', (event) => {
  assertType<DatePickerValueChanged>(event);
});
