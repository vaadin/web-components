import '../../vaadin-number-field.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  NumberField,
  NumberFieldChangeEvent,
  NumberFieldInvalidChangedEvent,
  NumberFieldValidatedEvent,
  NumberFieldValueChangedEvent,
} from '../../vaadin-number-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-number-field');

// Mixins
assertType<ClearButtonMixinClass>(field);
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

field.addEventListener('validated', (event) => {
  assertType<NumberFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
