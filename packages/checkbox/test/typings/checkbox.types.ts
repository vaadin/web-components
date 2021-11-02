import { ActiveMixinClass } from '@vaadin/component-base/src/active-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { CheckedMixinClass } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
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
assertType<ActiveMixinClass>(checkbox);
assertType<DisabledMixinClass>(checkbox);
assertType<ElementMixinClass>(checkbox);
assertType<FocusMixinClass>(checkbox);
assertType<KeyboardMixinClass>(checkbox);
assertType<CheckedMixinClass>(checkbox);
assertType<DelegateFocusMixinClass>(checkbox);
assertType<LabelMixinClass>(checkbox);
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
