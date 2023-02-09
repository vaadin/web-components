import '../../vaadin-date-picker.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/component-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { OverlayClassMixinClass } from '@vaadin/component-base/src/overlay-class-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { DatePickerMixinClass } from '../../src/vaadin-date-picker-mixin.js';
import type {
  DatePicker,
  DatePickerChangeEvent,
  DatePickerInvalidChangedEvent,
  DatePickerOpenedChangedEvent,
  DatePickerValidatedEvent,
  DatePickerValueChangedEvent,
} from '../../vaadin-date-picker.js';
import type {
  DatePickerLight,
  DatePickerLightChangeEvent,
  DatePickerLightInvalidChangedEvent,
  DatePickerLightOpenedChangedEvent,
  DatePickerLightValidatedEvent,
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

datePicker.addEventListener('validated', (event) => {
  assertType<DatePickerValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
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
assertType<string>(datePicker.overlayClass);

// DatePicker mixins
assertType<ControllerMixinClass>(datePicker);
assertType<ElementMixinClass>(datePicker);
assertType<FocusMixinClass>(datePicker);
assertType<DisabledMixinClass>(datePicker);
assertType<KeyboardMixinClass>(datePicker);
assertType<DelegateFocusMixinClass>(datePicker);
assertType<LabelMixinClass>(datePicker);
assertType<InputConstraintsMixinClass>(datePicker);
assertType<ClearButtonMixinClass>(datePicker);
assertType<InputControlMixinClass>(datePicker);
assertType<InputMixinClass>(datePicker);
assertType<ValidateMixinClass>(datePicker);
assertType<ThemableMixinClass>(datePicker);
assertType<DatePickerMixinClass>(datePicker);
assertType<OverlayClassMixinClass>(datePicker);

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

datePickerLight.addEventListener('validated', (event) => {
  assertType<DatePickerLightValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
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
assertType<InputConstraintsMixinClass>(datePickerLight);
assertType<ThemableMixinClass>(datePickerLight);
assertType<DatePickerMixinClass>(datePickerLight);
