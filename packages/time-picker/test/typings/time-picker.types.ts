import '../../vaadin-time-picker.js';
import { TimePickerInvalidChangedEvent, TimePickerValueChangedEvent } from '../../vaadin-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const timePicker = document.createElement('vaadin-time-picker');

timePicker.addEventListener('invalid-changed', (event) => {
  assertType<TimePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

timePicker.addEventListener('value-changed', (event) => {
  assertType<TimePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
