import '../../vaadin-text-area.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  TextArea,
  TextAreaChangeEvent,
  TextAreaInvalidChangedEvent,
  TextAreaValidatedEvent,
  TextAreaValueChangedEvent,
} from '../../vaadin-text-area.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const area = document.createElement('vaadin-text-area');

// Mixins
assertType<ClearButtonMixinClass>(area);
assertType<DelegateFocusMixinClass>(area);
assertType<DelegateStateMixinClass>(area);
assertType<DisabledMixinClass>(area);
assertType<ElementMixinClass>(area);
assertType<FieldMixinClass>(area);
assertType<FocusMixinClass>(area);
assertType<InputConstraintsMixinClass>(area);
assertType<InputControlMixinClass>(area);
assertType<InputFieldMixinClass>(area);
assertType<InputMixinClass>(area);
assertType<KeyboardMixinClass>(area);
assertType<LabelMixinClass>(area);
assertType<SlotStylesMixinClass>(area);
assertType<ValidateMixinClass>(area);
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

area.addEventListener('validated', (event) => {
  assertType<TextAreaValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});

assertType<() => void>(area.scrollToStart);
assertType<() => void>(area.scrollToEnd);
