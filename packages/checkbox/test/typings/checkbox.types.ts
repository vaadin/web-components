import '../../vaadin-checkbox.js';
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
import type { CheckboxMixinClass } from '../../src/vaadin-checkbox-mixin.js';
import type {
  Checkbox,
  CheckboxChangeEvent,
  CheckboxCheckedChangedEvent,
  CheckboxIndeterminateChangedEvent,
  CheckboxInvalidChangedEvent,
  CheckboxValidatedEvent,
} from '../../vaadin-checkbox.js';

const assertType = <TExpected>(value: TExpected) => value;

const checkbox = document.createElement('vaadin-checkbox');

// Properties
assertType<boolean>(checkbox.autofocus);
assertType<boolean>(checkbox.checked);
assertType<boolean>(checkbox.disabled);
assertType<boolean>(checkbox.indeterminate);
assertType<boolean>(checkbox.readonly);
assertType<string | null | undefined>(checkbox.label);
assertType<string>(checkbox.name);
assertType<string>(checkbox.value);

// Mixins
assertType<ActiveMixinClass>(checkbox);
assertType<DisabledMixinClass>(checkbox);
assertType<ElementMixinClass>(checkbox);
assertType<FocusMixinClass>(checkbox);
assertType<FieldMixinClass>(checkbox);
assertType<KeyboardMixinClass>(checkbox);
assertType<CheckboxMixinClass>(checkbox);
assertType<CheckedMixinClass>(checkbox);
assertType<DelegateFocusMixinClass>(checkbox);
assertType<LabelMixinClass>(checkbox);
assertType<ThemableMixinClass>(checkbox);
assertType<ValidateMixinClass>(checkbox);

// Events
checkbox.addEventListener('checked-changed', (event) => {
  assertType<CheckboxCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

checkbox.addEventListener('indeterminate-changed', (event) => {
  assertType<CheckboxIndeterminateChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

checkbox.addEventListener('change', (event) => {
  assertType<CheckboxChangeEvent>(event);
  assertType<Checkbox>(event.target);
});

checkbox.addEventListener('invalid-changed', (event) => {
  assertType<CheckboxInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

checkbox.addEventListener('validated', (event) => {
  assertType<CheckboxValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
