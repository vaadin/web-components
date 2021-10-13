import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { SlotLabelMixin } from '@vaadin/field-base/src/slot-label-mixin.js';
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
assertType<ActiveMixin>(radio);
assertType<ElementMixin>(radio);
assertType<CheckedMixin>(radio);
assertType<DelegateFocusMixin>(radio);
assertType<SlotLabelMixin>(radio);
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
