import '../../vaadin-number-field.js';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import { SlotStylesMixinClass } from '@vaadin/field-base/src/slot-styles-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  NumberField,
  NumberFieldChangeEvent,
  NumberFieldInvalidChangedEvent,
  NumberFieldValueChangedEvent,
} from '../../vaadin-number-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-number-field');

// Mixins
assertType<ControllerMixinClass>(field);
assertType<ElementMixinClass>(field);
assertType<InputFieldMixinClass>(field);
assertType<SlotStylesMixinClass>(field);
assertType<ThemableMixinClass>(field);

// Events
field.addEventListener('change', (event) => {
  assertType<NumberFieldChangeEvent>(event);
  assertType<NumberField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<NumberFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<NumberFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
