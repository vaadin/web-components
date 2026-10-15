import '../../vaadin-checkbox-group.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { CheckboxGroupMixinClass } from '../../src/vaadin-checkbox-group-mixin.js';
import type {
  CheckboxGroupInvalidChangedEvent,
  CheckboxGroupValidatedEvent,
  CheckboxGroupValueChangedEvent,
} from '../../vaadin-checkbox-group.js';

const assertType = <TExpected>(value: TExpected) => value;

const group = document.createElement('vaadin-checkbox-group');

group.addEventListener('invalid-changed', (event) => {
  assertType<CheckboxGroupInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assertType<CheckboxGroupValueChangedEvent>(event);
  assertType<string[]>(event.detail.value);
});

group.addEventListener('validated', (event) => {
  assertType<CheckboxGroupValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});

// Mixins
assertType<CheckboxGroupMixinClass>(group);
assertType<DisabledMixinClass>(group);
assertType<ElementMixinClass>(group);
assertType<FieldMixinClass>(group);
assertType<FocusMixinClass>(group);
assertType<LabelMixinClass>(group);
assertType<ThemableMixinClass>(group);
