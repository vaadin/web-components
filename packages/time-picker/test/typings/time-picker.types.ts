import '../../vaadin-time-picker.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  TimePicker,
  TimePickerChangeEvent,
  TimePickerInvalidChangedEvent,
  TimePickerValueChangedEvent,
} from '../../vaadin-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const timePicker = document.createElement('vaadin-time-picker');

// Mixins
assertType<ControllerMixinClass>(timePicker);
assertType<ElementMixinClass>(timePicker);
assertType<InputControlMixinClass>(timePicker);
assertType<PatternMixinClass>(timePicker);
assertType<ThemableMixinClass>(timePicker);

// Events
timePicker.addEventListener('change', (event) => {
  assertType<TimePickerChangeEvent>(event);
  assertType<TimePicker>(event.target);
});

timePicker.addEventListener('invalid-changed', (event) => {
  assertType<TimePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

timePicker.addEventListener('value-changed', (event) => {
  assertType<TimePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
