import { ElementHost } from '@vaadin/component-base/src/element-mixin.js';
import { FocusHost } from '@vaadin/component-base/src/focus-mixin.js';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { KeyboardHost } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusHost } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { LabelHost } from '@vaadin/field-base/src/label-mixin.js';
import { InputConstraintsHost } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { InputControlHost } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputHost } from '@vaadin/field-base/src/input-mixin.js';
import { ValidateHost } from '@vaadin/field-base/src/validate-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import '../../vaadin-date-picker.js';
import {
  DatePicker,
  DatePickerInvalidChangedEvent,
  DatePickerOpenedChangedEvent,
  DatePickerValueChangedEvent
} from '../../vaadin-date-picker.js';
import {
  DatePickerLight,
  DatePickerLightInvalidChangedEvent,
  DatePickerLightOpenedChangedEvent,
  DatePickerLightValueChangedEvent
} from '../../vaadin-date-picker-light.js';
import { DatePickerHost } from '../../src/vaadin-date-picker-mixin.js';

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

// DatePicker properties
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
assertType<HTMLElement | null | undefined>(datePicker.focusElement);
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

// DatePicker mixins
assertType<ElementHost>(datePicker);
assertType<FocusHost>(datePicker);
assertType<DisabledHost>(datePicker);
assertType<KeyboardHost>(datePicker);
assertType<DelegateFocusHost>(datePicker);
assertType<LabelHost>(datePicker);
assertType<InputConstraintsHost>(datePicker);
assertType<InputControlHost>(datePicker);
assertType<InputHost>(datePicker);
assertType<ValidateHost>(datePicker);
assertType<ThemableMixin>(datePicker);
assertType<DatePickerHost>(datePicker);

/* DatePickerLight */
const datePickerLight = document.createElement('vaadin-date-picker-light');

assertType<DatePickerLight>(datePickerLight);
assertType<ThemableMixin>(datePickerLight);

datePickerLight.addEventListener('opened-changed', (event) => {
  assertType<DatePickerLightOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

datePickerLight.addEventListener('invalid-changed', (event) => {
  assertType<DatePickerLightInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

datePickerLight.addEventListener('value-changed', (event) => {
  assertType<DatePickerLightValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

// DatePickerLight properties
assertType<() => boolean>(datePickerLight.checkValidity);
assertType<() => boolean>(datePickerLight.validate);
assertType<() => void>(datePickerLight.close);
assertType<() => void>(datePickerLight.open);
assertType<string | undefined>(datePickerLight.max);
assertType<string | undefined>(datePickerLight.min);
assertType<boolean | null | undefined>(datePickerLight.showWeekNumbers);
assertType<boolean | null | undefined>(datePickerLight.autoOpenDisabled);
assertType<boolean | null | undefined>(datePickerLight.opened);
assertType<HTMLElement | null | undefined>(datePickerLight.focusElement);
assertType<boolean>(datePickerLight.disabled);
assertType<string>(datePickerLight.value);
assertType<string | null | undefined>(datePickerLight.initialPosition);

// DatePickerLight mixins
assertType<FocusHost>(datePickerLight);
assertType<DisabledHost>(datePickerLight);
assertType<KeyboardHost>(datePickerLight);
assertType<DelegateFocusHost>(datePickerLight);
assertType<InputHost>(datePickerLight);
assertType<ThemableMixin>(datePickerLight);
assertType<DatePickerHost>(datePickerLight);
