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
assertType<ActiveHost>(checkbox);
assertType<DisabledHost>(checkbox);
assertType<ElementHost>(checkbox);
assertType<FocusHost>(checkbox);
assertType<KeyboardHost>(checkbox);
assertType<CheckedHost>(checkbox);
assertType<DelegateFocusHost>(checkbox);
assertType<LabelHost>(checkbox);
assertType<SlotLabelHost>(checkbox);
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
