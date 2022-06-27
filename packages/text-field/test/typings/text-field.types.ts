import '../../vaadin-text-field.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import type { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  TextField,
  TextFieldChangeEvent,
  TextFieldInvalidChangedEvent,
  TextFieldValidatedEvent,
  TextFieldValueChangedEvent,
} from '../../vaadin-text-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-text-field');

// Mixins
assertType<ControllerMixinClass>(field);
assertType<ElementMixinClass>(field);
assertType<InputFieldMixinClass>(field);
assertType<PatternMixinClass>(field);
assertType<ThemableMixinClass>(field);

// Events
field.addEventListener('change', (event) => {
  assertType<TextFieldChangeEvent>(event);
  assertType<TextField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

field.addEventListener('validated', (event) => {
  assertType<TextFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
