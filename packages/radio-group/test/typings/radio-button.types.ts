import { ActiveHost } from '@vaadin/component-base/src/active-mixin.js';
import { ElementHost } from '@vaadin/component-base/src/element-mixin.js';
import { FocusHost } from '@vaadin/component-base/src/focus-mixin.js';
import { DisabledHost } from '@vaadin/component-base/src/disabled-mixin.js';
import { KeyboardHost } from '@vaadin/component-base/src/keyboard-mixin.js';
import { CheckedHost } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusHost } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { LabelHost } from '@vaadin/field-base/src/label-mixin.js';
import { SlotLabelHost } from '@vaadin/field-base/src/slot-label-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import '../../vaadin-radio-button.js';
import '../../vaadin-radio-group.js';
import { RadioButtonCheckedChangedEvent } from '../../vaadin-radio-button.js';
import { RadioGroupInvalidChangedEvent, RadioGroupValueChangedEvent } from '../../vaadin-radio-group.js';

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
assertType<ActiveHost>(radio);
assertType<DisabledHost>(radio);
assertType<ElementHost>(radio);
assertType<FocusHost>(radio);
assertType<KeyboardHost>(radio);
assertType<CheckedHost>(radio);
assertType<DelegateFocusHost>(radio);
assertType<LabelHost>(radio);
assertType<SlotLabelHost>(radio);
assertType<ThemableMixin>(radio);

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
