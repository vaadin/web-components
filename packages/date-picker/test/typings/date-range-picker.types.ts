import '../../vaadin-date-range-picker.js';
import type {
  DateRangePicker,
  DateRangePickerChangeEvent,
  DateRangePickerEndValueChangedEvent,
  DateRangePickerInvalidChangedEvent,
  DateRangePickerOpenedChangedEvent,
  DateRangePickerStartValueChangedEvent,
  DateRangePickerValidatedEvent,
} from '../../vaadin-date-range-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dateRangePicker = document.createElement('vaadin-date-range-picker');

assertType<DateRangePicker>(dateRangePicker);

dateRangePicker.addEventListener('start-value-changed', (event) => {
  assertType<DateRangePickerStartValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

dateRangePicker.addEventListener('end-value-changed', (event) => {
  assertType<DateRangePickerEndValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

dateRangePicker.addEventListener('opened-changed', (event) => {
  assertType<DateRangePickerOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dateRangePicker.addEventListener('invalid-changed', (event) => {
  assertType<DateRangePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dateRangePicker.addEventListener('change', (event) => {
  assertType<DateRangePickerChangeEvent>(event);
  assertType<DateRangePicker>(event.target);
});

dateRangePicker.addEventListener('validated', (event) => {
  assertType<DateRangePickerValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
