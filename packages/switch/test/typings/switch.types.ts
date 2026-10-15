import '../../vaadin-switch.js';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { CheckboxMixinClass } from '@vaadin/checkbox/src/vaadin-checkbox-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type {
  Switch,
  SwitchChangeEvent,
  SwitchCheckedChangedEvent,
  SwitchInvalidChangedEvent,
  SwitchValidatedEvent,
} from '../../vaadin-switch.js';

const assertType = <TExpected>(value: TExpected) => value;

const element = document.createElement('vaadin-switch');

// Properties
assertType<boolean>(element.autofocus);
assertType<boolean>(element.checked);
assertType<boolean>(element.disabled);
assertType<boolean>(element.readonly);
assertType<boolean>(element.required);
assertType<boolean>(element.invalid);
assertType<boolean>(element.manualValidation);
assertType<string | null | undefined>(element.label);
assertType<string>(element.name);
assertType<string>(element.value);

// Mixins
assertType<ActiveMixinClass>(element);
assertType<CheckboxMixinClass>(element);
assertType<CheckedMixinClass>(element);
assertType<DelegateFocusMixinClass>(element);
assertType<DisabledMixinClass>(element);
assertType<ElementMixinClass>(element);
assertType<FieldMixinClass>(element);
assertType<FocusMixinClass>(element);
assertType<KeyboardMixinClass>(element);
assertType<LabelMixinClass>(element);
assertType<ValidateMixinClass>(element);

// Events
element.addEventListener('checked-changed', (event) => {
  assertType<SwitchCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

element.addEventListener('invalid-changed', (event) => {
  assertType<SwitchInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

element.addEventListener('change', (event) => {
  assertType<SwitchChangeEvent>(event);
  assertType<Switch>(event.target);
});

element.addEventListener('validated', (event) => {
  assertType<SwitchValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
