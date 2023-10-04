import '../../vaadin-time-picker.js';
import type {
  ComboBoxItemMixinClass,
  ComboBoxItemRenderer,
} from '@vaadin/combo-box/src/vaadin-combo-box-item-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { TimePickerItem } from '../../src/vaadin-time-picker-item.js';
import type {
  TimePicker,
  TimePickerChangeEvent,
  TimePickerInvalidChangedEvent,
  TimePickerOpenedChangedEvent,
  TimePickerValidatedEvent,
  TimePickerValueChangedEvent,
} from '../../vaadin-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const timePicker = document.createElement('vaadin-time-picker');

// Mixins
assertType<ControllerMixinClass>(timePicker);
assertType<ElementMixinClass>(timePicker);
assertType<InputControlMixinClass>(timePicker);
assertType<ClearButtonMixinClass>(timePicker);
assertType<PatternMixinClass>(timePicker);
assertType<ValidateMixinClass>(timePicker);
assertType<ThemableMixinClass>(timePicker);

// Properties
assertType<boolean | null | undefined>(timePicker.autoOpenDisabled);
assertType<string>(timePicker.min);
assertType<string>(timePicker.max);
assertType<number | null | undefined>(timePicker.step);
assertType<boolean>(timePicker.opened);
assertType<string>(timePicker.overlayClass);
assertType<string>(timePicker.value);

// Events
timePicker.addEventListener('change', (event) => {
  assertType<TimePickerChangeEvent>(event);
  assertType<TimePicker>(event.target);
});

timePicker.addEventListener('invalid-changed', (event) => {
  assertType<TimePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

timePicker.addEventListener('opened-changed', (event) => {
  assertType<TimePickerOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

timePicker.addEventListener('value-changed', (event) => {
  assertType<TimePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

timePicker.addEventListener('validated', (event) => {
  assertType<TimePickerValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});

// Item
const item = document.createElement('vaadin-time-picker-item');
assertType<TimePickerItem>(item);

// Item properties
assertType<number>(item.index);
assertType<string>(item.label);
assertType<boolean>(item.focused);
assertType<boolean>(item.selected);
assertType<ComboBoxItemRenderer<string, TimePicker>>(item.renderer);
assertType<() => void>(item.requestContentUpdate);

// Item mixins
assertType<ComboBoxItemMixinClass<string, TimePicker>>(item);
assertType<DirMixinClass>(item);
assertType<ThemableMixinClass>(item);
