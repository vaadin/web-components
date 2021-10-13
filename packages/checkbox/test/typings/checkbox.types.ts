import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { SlotLabelMixin } from '@vaadin/field-base/src/slot-label-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import '../../vaadin-checkbox.js';
import { CheckboxCheckedChangedEvent, CheckboxIndeterminateChangedEvent } from '../../vaadin-checkbox.js';

const assertType = <TExpected>(value: TExpected) => value;

const checkbox = document.createElement('vaadin-checkbox');

// Properties
assertType<boolean>(checkbox.autofocus);
assertType<boolean>(checkbox.checked);
assertType<boolean>(checkbox.disabled);
assertType<boolean>(checkbox.indeterminate);
assertType<string | null | undefined>(checkbox.label);
assertType<string>(checkbox.name);
assertType<string>(checkbox.value);

// Mixins
assertType<ActiveMixin>(checkbox);
assertType<ElementMixin>(checkbox);
assertType<CheckedMixin>(checkbox);
assertType<DelegateFocusMixin>(checkbox);
assertType<SlotLabelMixin>(checkbox);
assertType<ThemableMixin>(checkbox);

// Events
checkbox.addEventListener('checked-changed', (event) => {
  assertType<CheckboxCheckedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

checkbox.addEventListener('indeterminate-changed', (event) => {
  assertType<CheckboxIndeterminateChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
