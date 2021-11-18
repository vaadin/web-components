import '../../vaadin-date-time-picker.js';
import { DateTimePickerInvalidChangedEvent, DateTimePickerValueChangedEvent } from '../../vaadin-date-time-picker.js';

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

assertType<boolean>(picker.required);
assertType<boolean>(picker.invalid);
assertType<boolean>(picker.disabled);
assertType<boolean>(picker.readonly);
assertType<string | null | undefined>(picker.errorMessage);
assertType<string>(picker.value);
assertType<string | null | undefined>(picker.name);
assertType<string | undefined>(picker.min);
assertType<string | undefined>(picker.max);
assertType<string | null | undefined>(picker.helperText);
assertType<string | null | undefined>(picker.label);
assertType<string | null | undefined>(picker.datePlaceholder);
assertType<string | null | undefined>(picker.timePlaceholder);
assertType<string | null | undefined>(picker.initialPosition);
assertType<number | null | undefined>(picker.step);
assertType<boolean | null | undefined>(picker.showWeekNumbers);
assertType<boolean | null | undefined>(picker.autoOpenDisabled);
assertType<boolean | null | undefined>(picker.autofocus);
assertType<() => boolean>(picker.validate);
assertType<() => boolean>(picker.checkValidity);
