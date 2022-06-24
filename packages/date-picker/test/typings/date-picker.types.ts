import '../../vaadin-date-picker.js';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerMixinClass } from '../../src/vaadin-date-picker-mixin.js';
import {
  DatePicker,
  DatePickerChangeEvent,
  DatePickerInvalidChangedEvent,
  DatePickerOpenedChangedEvent,
  DatePickerValueChangedEvent,
} from '../../vaadin-date-picker.js';
import {
  DatePickerLight,
  DatePickerLightChangeEvent,
  DatePickerLightInvalidChangedEvent,
  DatePickerLightOpenedChangedEvent,
  DatePickerLightValueChangedEvent,
} from '../../vaadin-date-picker-light.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const datePicker = document.createElement('vaadin-date-picker');

assertType<DatePicker>(datePicker);

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

datePicker.addEventListener('change', (event) => {
  assertType<DatePickerChangeEvent>(event);
  assertType<DatePicker>(event.target);
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
assertType<string | null | undefined>(datePicker.errorMessage);
assertType<string>(datePicker.placeholder);
assertType<string | null | undefined>(datePicker.helperText);
assertType<boolean>(datePicker.readonly);
assertType<string | null | undefined>(datePicker.label);
assertType<string>(datePicker.value);
assertType<boolean>(datePicker.required);
assertType<string>(datePicker.name);
assertType<string>(datePicker.allowedCharPattern);
assertType<string | null | undefined>(datePicker.initialPosition);

// DatePicker mixins
assertType<ControllerMixinClass>(datePicker);
assertType<ElementMixinClass>(datePicker);
assertType<FocusMixinClass>(datePicker);
assertType<DisabledMixinClass>(datePicker);
assertType<KeyboardMixinClass>(datePicker);
assertType<DelegateFocusMixinClass>(datePicker);
assertType<LabelMixinClass>(datePicker);
assertType<InputConstraintsMixinClass>(datePicker);
assertType<InputControlMixinClass>(datePicker);
assertType<InputMixinClass>(datePicker);
assertType<ValidateMixinClass>(datePicker);
assertType<ThemableMixinClass>(datePicker);
assertType<DatePickerMixinClass>(datePicker);

/* DatePickerLight */
const datePickerLight = document.createElement('vaadin-date-picker-light');

assertType<DatePickerLight>(datePickerLight);
assertType<ValidateMixinClass>(datePickerLight);

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

datePickerLight.addEventListener('change', (event) => {
  assertType<DatePickerLightChangeEvent>(event);
  assertType<DatePickerLight>(event.target);
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
assertType<boolean>(datePickerLight.invalid);
assertType<boolean>(datePickerLight.required);
assertType<string | null | undefined>(datePickerLight.initialPosition);

// DatePickerLight mixins
assertType<FocusMixinClass>(datePickerLight);
assertType<DisabledMixinClass>(datePickerLight);
assertType<KeyboardMixinClass>(datePickerLight);
assertType<DelegateFocusMixinClass>(datePickerLight);
assertType<InputMixinClass>(datePickerLight);
assertType<ThemableMixinClass>(datePickerLight);
assertType<DatePickerMixinClass>(datePickerLight);
