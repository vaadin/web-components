import '../../vaadin-query-field.js';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputFieldMixinClass } from '@vaadin/field-base/src/input-field-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type {
  QueryField,
  QueryFieldChangeEvent,
  QueryFieldFilter,
  QueryFieldInvalidChangedEvent,
  QueryFieldMixinClass,
  QueryFieldQuery,
  QueryFieldQueryChangedEvent,
  QueryFieldValidatedEvent,
  QueryFieldValueChangedEvent,
} from '../../vaadin-query-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-query-field');

// Properties
assertType<QueryField>(field);
assertType<QueryFieldFilter[]>(field.filters);
assertType<QueryFieldQuery>(field.query);
assertType<string>(field.query.text);
assertType<Array<{ name: string; value: string }>>(field.query.filters);

field.filters = [
  { name: 'label', label: 'Record label', options: ['Warp Records', { value: 'xl', label: 'XL Recordings' }] },
  { name: 'year', type: 'number' },
  { name: 'artist', options: ['Aphex Twin'], allowCustomValue: true },
];

// Mixins
assertType<ClearButtonMixinClass>(field);
assertType<DelegateFocusMixinClass>(field);
assertType<DelegateStateMixinClass>(field);
assertType<DisabledMixinClass>(field);
assertType<ElementMixinClass>(field);
assertType<FieldMixinClass>(field);
assertType<FocusMixinClass>(field);
assertType<InputConstraintsMixinClass>(field);
assertType<InputControlMixinClass>(field);
assertType<InputFieldMixinClass>(field);
assertType<InputMixinClass>(field);
assertType<KeyboardMixinClass>(field);
assertType<LabelMixinClass>(field);
assertType<SlotStylesMixinClass>(field);
assertType<ValidateMixinClass>(field);
assertType<QueryFieldMixinClass>(field);

// Events
field.addEventListener('change', (event) => {
  assertType<QueryFieldChangeEvent>(event);
  assertType<QueryField>(event.target);
});

field.addEventListener('invalid-changed', (event) => {
  assertType<QueryFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('query-changed', (event) => {
  assertType<QueryFieldQueryChangedEvent>(event);
  assertType<QueryFieldQuery>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<QueryFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

field.addEventListener('validated', (event) => {
  assertType<QueryFieldValidatedEvent>(event);
  assertType<boolean>(event.detail.valid);
});
