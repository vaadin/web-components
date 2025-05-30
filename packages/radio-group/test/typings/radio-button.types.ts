import '../../vaadin-radio-button.js';
import '../../vaadin-radio-group.js';
import type { ActiveMixinClass } from '@vaadin/a11y-base/src/active-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { RadioGroupMixinClass } from '../../src/vaadin-radio-group-mixin.js';
import type { RadioButtonCheckedChangedEvent } from '../../vaadin-radio-button.js';
import type {
  RadioGroupInvalidChangedEvent,
  RadioGroupValidatedEvent,
  RadioGroupValueChangedEvent,
} from '../../vaadin-radio-group.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const radio = document.createElement('vaadin-radio-button');

// Radio properties
assertType<boolean>(radio.autofocus);
assertType<boolean>(radio.checked);
assertType<boolean>(radio.disabled);
assertType<string | null | undefined>(radio.label);
assertType<string>(radio.name);
assertType<string>(radio.value);

// Radio mixins
assertType<ActiveMixinClass>(radio);
assertType<DisabledMixinClass>(radio);
assertType<ElementMixinClass>(radio);
assertType<FocusMixinClass>(radio);
assertType<KeyboardMixinClass>(radio);
assertType<CheckedMixinClass>(radio);
assertType<DelegateFocusMixinClass>(radio);
assertType<LabelMixinClass>(radio);
assertType<ThemableMixinClass>(radio);

// Radio events
radio.addEventListener('checked-changed', (event) => {
  assertType<RadioButtonCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

const group = document.createElement('vaadin-radio-group');

// Group properties
assertType<string | null | undefined>(group.name);
assertType<string | null | undefined>(group.value);
assertType<boolean>(group.readonly);

// Group mixins
assertType<DisabledMixinClass>(group);
assertType<ElementMixinClass>(group);
assertType<FieldMixinClass>(group);
assertType<FocusMixinClass>(group);
assertType<KeyboardMixinClass>(group);
assertType<LabelMixinClass>(group);
assertType<RadioGroupMixinClass>(group);
assertType<ThemableMixinClass>(group);

group.addEventListener('invalid-changed', (event) => {
  assertType<RadioGroupInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assertType<RadioGroupValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

group.addEventListener('validated', (event) => {
  assertType<RadioGroupValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
