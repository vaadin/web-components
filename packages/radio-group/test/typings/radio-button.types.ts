import '../../vaadin-radio-button.js';
import '../../vaadin-radio-group.js';
import type { ActiveMixinClass } from '@vaadin/component-base/src/active-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import type { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import type { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { RadioButtonCheckedChangedEvent } from '../../vaadin-radio-button.js';
import type { RadioGroupInvalidChangedEvent, RadioGroupValueChangedEvent } from '../../vaadin-radio-group.js';

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
assertType<ControllerMixinClass>(radio);
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

group.addEventListener('invalid-changed', (event) => {
  assertType<RadioGroupInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assertType<RadioGroupValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
