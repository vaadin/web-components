import '../../vaadin-date-picker.js';

import {
  DatePicker,
  DatePickerInvalidChangedEvent,
  DatePickerOpenedChangedEvent,
  DatePickerValueChangedEvent
} from '../../vaadin-date-picker.js';

import { DatePickerLight } from '../../vaadin-date-picker-light.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';

const assertType = <TExpected>(actual: TExpected) => actual;

const datePicker = document.createElement('vaadin-date-picker');

assertType<DatePicker>(datePicker);
assertType<ThemableMixin>(datePicker);

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

assertType<() => boolean>(datePicker.checkValidity);
assertType<() => boolean>(datePicker.validate);
assertType<() => void>(datePicker.close);
assertType<() => void>(datePicker.open);
assertType<string | undefined>(datePicker.max);
assertType<string | undefined>(datePicker.min);
assertType<boolean | null | undefined>(datePicker.showWeekNumbers);
assertType<boolean | null | undefined>(datePicker.autoOpenDisabled);
assertType<boolean | null | undefined>(datePicker.opened);
assertType<boolean>(datePicker.invalid);
assertType<Element | null | undefined>(datePicker.focusElement);
assertType<boolean>(datePicker.disabled);
assertType<boolean>(datePicker.clearButtonVisible);
assertType<string>(datePicker.errorMessage);
assertType<string>(datePicker.placeholder);
assertType<string | null | undefined>(datePicker.helperText);
assertType<boolean>(datePicker.readonly);
assertType<string | null | undefined>(datePicker.label);
assertType<string>(datePicker.value);
assertType<boolean>(datePicker.required);
assertType<string>(datePicker.name);
assertType<string | null | undefined>(datePicker.initialPosition);

/* DatePickerLight */
const datePickerLight = document.createElement('vaadin-date-picker-light');

assertType<DatePickerLight>(datePickerLight);
assertType<ThemableMixin>(datePickerLight);

datePickerLight.addEventListener('opened-changed', (event) => {
  assertType<DatePickerOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

datePickerLight.addEventListener('invalid-changed', (event) => {
  assertType<DatePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

datePickerLight.addEventListener('value-changed', (event) => {
  assertType<DatePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

assertType<() => boolean>(datePickerLight.checkValidity);
assertType<() => boolean>(datePickerLight.validate);
assertType<() => void>(datePickerLight.close);
assertType<() => void>(datePickerLight.open);
assertType<string | undefined>(datePickerLight.max);
assertType<string | undefined>(datePickerLight.min);
assertType<boolean | null | undefined>(datePickerLight.showWeekNumbers);
assertType<boolean | null | undefined>(datePickerLight.autoOpenDisabled);
assertType<boolean | null | undefined>(datePickerLight.opened);
assertType<Element | null | undefined>(datePickerLight.focusElement);
assertType<boolean>(datePickerLight.disabled);
assertType<string>(datePickerLight.value);
assertType<string | null | undefined>(datePickerLight.initialPosition);
