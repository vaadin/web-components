import '../../vaadin-date-time-picker.js';
import type {
  DateTimePicker,
  DateTimePickerChangeEvent,
  DateTimePickerInvalidChangedEvent,
  DateTimePickerValidatedEvent,
  DateTimePickerValueChangedEvent,
} from '../../vaadin-date-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const picker = document.createElement('vaadin-date-time-picker');

picker.addEventListener('change', (event) => {
  assertType<DateTimePickerChangeEvent>(event);
  assertType<DateTimePicker>(event.target);
});

picker.addEventListener('invalid-changed', (event) => {
  assertType<DateTimePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

picker.addEventListener('value-changed', (event) => {
  assertType<DateTimePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

picker.addEventListener('validated', (event) => {
  assertType<DateTimePickerValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
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
assertType<string>(picker.overlayClass);
assertType<() => boolean>(picker.validate);
assertType<() => boolean>(picker.checkValidity);
