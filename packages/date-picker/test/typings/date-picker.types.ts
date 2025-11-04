import '../../vaadin-date-picker.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { DatePickerDate, DatePickerI18n, DatePickerMixinClass } from '../../src/vaadin-date-picker-mixin.js';
import type {
  DatePicker,
  DatePickerChangeEvent,
  DatePickerInvalidChangedEvent,
  DatePickerOpenedChangedEvent,
  DatePickerValidatedEvent,
  DatePickerValueChangedEvent,
} from '../../vaadin-date-picker.js';

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
assertType<(date: DatePickerDate) => boolean | undefined>(datePicker.isDateDisabled);
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
assertType<DatePickerI18n>(datePicker.i18n);
assertType<string>(datePicker.value);
assertType<boolean>(datePicker.required);
assertType<string>(datePicker.name);
assertType<string>(datePicker.allowedCharPattern);
assertType<string | null | undefined>(datePicker.initialPosition);

// I18n
assertType<DatePickerI18n>({});
assertType<DatePickerI18n>({ cancel: 'cancel' });

// DatePicker mixins
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
