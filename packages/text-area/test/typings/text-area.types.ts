import '../../vaadin-text-area.js';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  TextArea,
  TextAreaChangeEvent,
  TextAreaInvalidChangedEvent,
  TextAreaValueChangedEvent,
} from '../../vaadin-text-area.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const area = document.createElement('vaadin-text-area');

// Mixins
assertType<ControllerMixinClass>(area);
assertType<ElementMixinClass>(area);
assertType<InputFieldMixinClass>(area);
assertType<PatternMixinClass>(area);
assertType<ThemableMixinClass>(area);

// Events
area.addEventListener('change', (event) => {
  assertType<TextAreaChangeEvent>(event);
  assertType<TextArea>(event.target);
});

area.addEventListener('invalid-changed', (event) => {
  assertType<TextAreaInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

area.addEventListener('value-changed', (event) => {
  assertType<TextAreaValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
