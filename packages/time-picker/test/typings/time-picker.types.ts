import '../../vaadin-time-picker.js';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TimePickerInvalidChangedEvent, TimePickerValueChangedEvent } from '../../vaadin-time-picker.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const timePicker = document.createElement('vaadin-time-picker');

// Mixins
assertType<ControllerMixinClass>(timePicker);
assertType<ElementMixinClass>(timePicker);
assertType<InputControlMixinClass>(timePicker);
assertType<PatternMixinClass>(timePicker);
assertType<ThemableMixinClass>(timePicker);

// Events
timePicker.addEventListener('invalid-changed', (event) => {
  assertType<TimePickerInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

timePicker.addEventListener('value-changed', (event) => {
  assertType<TimePickerValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
