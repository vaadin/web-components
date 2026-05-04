import '../../vaadin-toggle-switch.js';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ToggleSwitchMixinClass } from '../../src/vaadin-toggle-switch-mixin.js';
import type {
  ToggleSwitch,
  ToggleSwitchChangeEvent,
  ToggleSwitchCheckedChangedEvent,
  ToggleSwitchInvalidChangedEvent,
  ToggleSwitchValidatedEvent,
} from '../../vaadin-toggle-switch.js';

const assertType = <TExpected>(value: TExpected) => value;

const toggle = document.createElement('vaadin-toggle-switch');

// Properties
assertType<boolean>(toggle.autofocus);
assertType<boolean>(toggle.checked);
assertType<boolean>(toggle.disabled);
assertType<boolean>(toggle.readonly);
assertType<string | null | undefined>(toggle.label);
assertType<string>(toggle.name);
assertType<string>(toggle.value);

// Mixins
assertType<ActiveMixinClass>(toggle);
assertType<DisabledMixinClass>(toggle);
assertType<ElementMixinClass>(toggle);
assertType<FocusMixinClass>(toggle);
assertType<FieldMixinClass>(toggle);
assertType<KeyboardMixinClass>(toggle);
assertType<ToggleSwitchMixinClass>(toggle);
assertType<CheckedMixinClass>(toggle);
assertType<DelegateFocusMixinClass>(toggle);
assertType<LabelMixinClass>(toggle);
assertType<ThemableMixinClass>(toggle);
assertType<ValidateMixinClass>(toggle);

// Events
toggle.addEventListener('checked-changed', (event) => {
  assertType<ToggleSwitchCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

toggle.addEventListener('change', (event) => {
  assertType<ToggleSwitchChangeEvent>(event);
  assertType<ToggleSwitch>(event.target);
});

toggle.addEventListener('invalid-changed', (event) => {
  assertType<ToggleSwitchInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

toggle.addEventListener('validated', (event) => {
  assertType<ToggleSwitchValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
