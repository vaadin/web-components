import '../../vaadin-time-picker.js';

import { TimePickerInvalidChanged, TimePickerValueChanged } from '../../vaadin-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const timePicker = document.createElement('vaadin-time-picker');

timePicker.addEventListener('invalid-changed', (event) => {
  assertType<TimePickerInvalidChanged>(event);
});

timePicker.addEventListener('value-changed', (event) => {
  assertType<TimePickerValueChanged>(event);
});
