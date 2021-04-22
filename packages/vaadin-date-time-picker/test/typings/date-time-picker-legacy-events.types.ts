import '../../vaadin-date-time-picker.js';
import { DateTimePickerValueChanged, DateTimePickerInvalidChanged } from '../../vaadin-date-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const picker = document.createElement('vaadin-date-time-picker');

picker.addEventListener('invalid-changed', (event) => {
  assertType<DateTimePickerInvalidChanged>(event);
});

picker.addEventListener('value-changed', (event) => {
  assertType<DateTimePickerValueChanged>(event);
});
