import '../../vaadin-toggle-switch.js';
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
  ToggleSwitch,
  ToggleSwitchChangeEvent,
  ToggleSwitchCheckedChangedEvent,
  ToggleSwitchInvalidChangedEvent,
  ToggleSwitchValidatedEvent,
} from '../../vaadin-toggle-switch.js';

const assertType = <TExpected>(value: TExpected) => value;

const toggleSwitch = document.createElement('vaadin-toggle-switch');

// Properties
assertType<boolean>(toggleSwitch.autofocus);
assertType<boolean>(toggleSwitch.checked);
assertType<boolean>(toggleSwitch.disabled);
assertType<boolean>(toggleSwitch.readonly);
assertType<boolean>(toggleSwitch.required);
assertType<boolean>(toggleSwitch.invalid);
assertType<boolean>(toggleSwitch.manualValidation);
assertType<string | null | undefined>(toggleSwitch.label);
assertType<string>(toggleSwitch.name);
assertType<string>(toggleSwitch.value);

// Mixins
assertType<ActiveMixinClass>(toggleSwitch);
assertType<CheckboxMixinClass>(toggleSwitch);
assertType<CheckedMixinClass>(toggleSwitch);
assertType<DelegateFocusMixinClass>(toggleSwitch);
assertType<DisabledMixinClass>(toggleSwitch);
assertType<ElementMixinClass>(toggleSwitch);
assertType<FieldMixinClass>(toggleSwitch);
assertType<FocusMixinClass>(toggleSwitch);
assertType<KeyboardMixinClass>(toggleSwitch);
assertType<LabelMixinClass>(toggleSwitch);
assertType<ValidateMixinClass>(toggleSwitch);

// Events
toggleSwitch.addEventListener('checked-changed', (event) => {
  assertType<ToggleSwitchCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

toggleSwitch.addEventListener('invalid-changed', (event) => {
  assertType<ToggleSwitchInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

toggleSwitch.addEventListener('change', (event) => {
  assertType<ToggleSwitchChangeEvent>(event);
  assertType<ToggleSwitch>(event.target);
});

toggleSwitch.addEventListener('validated', (event) => {
  assertType<ToggleSwitchValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
