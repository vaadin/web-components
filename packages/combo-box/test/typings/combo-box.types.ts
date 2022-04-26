import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixinClass } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixinClass } from '@vaadin/component-base/src/keyboard-mixin.js';
import { DelegateFocusMixinClass } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { DelegateStateMixinClass } from '@vaadin/field-base/src/delegate-state-mixin.js';
import { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import { ComboBoxDataProviderMixinClass } from '../../src/vaadin-combo-box-data-provider-mixin';
import { ComboBoxMixinClass } from '../../src/vaadin-combo-box-mixin';
import {
  ComboBox,
  ComboBoxChangeEvent,
  ComboBoxCustomValueSetEvent,
  ComboBoxFilterChangedEvent,
  ComboBoxInvalidChangedEvent,
  ComboBoxOpenedChangedEvent,
  ComboBoxRenderer,
  ComboBoxSelectedItemChangedEvent,
  ComboBoxValueChangedEvent,
} from '../../vaadin-combo-box';
import {
  ComboBoxLight,
  ComboBoxLightChangeEvent,
  ComboBoxLightCustomValueSetEvent,
  ComboBoxLightFilterChangedEvent,
  ComboBoxLightInvalidChangedEvent,
  ComboBoxLightOpenedChangedEvent,
  ComboBoxLightSelectedItemChangedEvent,
  ComboBoxLightValueChangedEvent,
} from '../../vaadin-combo-box-light';

interface TestComboBoxItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* ComboBox */
const genericComboBox = document.createElement('vaadin-combo-box');
assertType<ComboBox>(genericComboBox);

const narrowedComboBox = genericComboBox as ComboBox<TestComboBoxItem>;

narrowedComboBox.addEventListener('change', (event) => {
  assertType<ComboBoxChangeEvent<TestComboBoxItem>>(event);
  assertType<ComboBox<TestComboBoxItem>>(event.target);
});

narrowedComboBox.addEventListener('custom-value-set', (event) => {
  assertType<ComboBoxCustomValueSetEvent>(event);
  assertType<string>(event.detail);
});

narrowedComboBox.addEventListener('opened-changed', (event) => {
  assertType<ComboBoxOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBox.addEventListener('invalid-changed', (event) => {
  assertType<ComboBoxInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBox.addEventListener('value-changed', (event) => {
  assertType<ComboBoxValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBox.addEventListener('filter-changed', (event) => {
  assertType<ComboBoxFilterChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBox.addEventListener('selected-item-changed', (event) => {
  assertType<ComboBoxSelectedItemChangedEvent<TestComboBoxItem>>(event);
  assertType<TestComboBoxItem | null | undefined>(event.detail.value);
});

// ComboBox properties
assertType<() => boolean>(narrowedComboBox.checkValidity);
assertType<() => boolean>(narrowedComboBox.validate);
assertType<() => void>(narrowedComboBox.close);
assertType<() => void>(narrowedComboBox.open);
assertType<() => void>(narrowedComboBox.requestContentUpdate);
assertType<boolean>(narrowedComboBox.allowCustomValue);
assertType<boolean>(narrowedComboBox.autofocus);
assertType<boolean>(narrowedComboBox.autoselect);
assertType<boolean | null | undefined>(narrowedComboBox.autoOpenDisabled);
assertType<boolean>(narrowedComboBox.opened);
assertType<string>(narrowedComboBox.filter);
assertType<TestComboBoxItem[] | undefined>(narrowedComboBox.filteredItems);
assertType<TestComboBoxItem[] | undefined>(narrowedComboBox.items);
assertType<string | null | undefined>(narrowedComboBox.itemIdPath);
assertType<string>(narrowedComboBox.itemLabelPath);
assertType<string>(narrowedComboBox.itemValuePath);
assertType<boolean>(narrowedComboBox.loading);
assertType<ComboBoxRenderer<TestComboBoxItem> | null | undefined>(narrowedComboBox.renderer);
assertType<TestComboBoxItem | null | undefined>(narrowedComboBox.selectedItem);
assertType<boolean>(narrowedComboBox.invalid);
assertType<HTMLElement | null | undefined>(narrowedComboBox.focusElement);
assertType<boolean>(narrowedComboBox.disabled);
assertType<boolean>(narrowedComboBox.clearButtonVisible);
assertType<string | null | undefined>(narrowedComboBox.errorMessage);
assertType<string>(narrowedComboBox.placeholder);
assertType<string | null | undefined>(narrowedComboBox.helperText);
assertType<string>(narrowedComboBox.pattern);
assertType<boolean | null | undefined>(narrowedComboBox.preventInvalidInput);
assertType<boolean>(narrowedComboBox.readonly);
assertType<string | null | undefined>(narrowedComboBox.label);
assertType<string>(narrowedComboBox.value);
assertType<boolean>(narrowedComboBox.required);
assertType<string>(narrowedComboBox.name);

// ComboBox mixins
assertType<ComboBoxDataProviderMixinClass<TestComboBoxItem>>(narrowedComboBox);
assertType<ComboBoxMixinClass<TestComboBoxItem>>(narrowedComboBox);
assertType<ControllerMixinClass>(narrowedComboBox);
assertType<ElementMixinClass>(narrowedComboBox);
assertType<DelegateFocusMixinClass>(narrowedComboBox);
assertType<DelegateStateMixinClass>(narrowedComboBox);
assertType<DisabledMixinClass>(narrowedComboBox);
assertType<FieldMixinClass>(narrowedComboBox);
assertType<FocusMixinClass>(narrowedComboBox);
assertType<InputConstraintsMixinClass>(narrowedComboBox);
assertType<InputControlMixinClass>(narrowedComboBox);
assertType<InputMixinClass>(narrowedComboBox);
assertType<KeyboardMixinClass>(narrowedComboBox);
assertType<LabelMixinClass>(narrowedComboBox);
assertType<PatternMixinClass>(narrowedComboBox);
assertType<ValidateMixinClass>(narrowedComboBox);
assertType<ThemableMixinClass>(narrowedComboBox);

/* ComboBoxLight */
const genericComboBoxLight = document.createElement('vaadin-combo-box-light');
assertType<ComboBoxLight>(genericComboBoxLight);

const narrowedComboBoxLight = genericComboBoxLight as ComboBoxLight<TestComboBoxItem>;

narrowedComboBoxLight.addEventListener('change', (event) => {
  assertType<ComboBoxLightChangeEvent<TestComboBoxItem>>(event);
  assertType<ComboBoxLight<TestComboBoxItem>>(event.target);
});

narrowedComboBoxLight.addEventListener('custom-value-set', (event) => {
  assertType<ComboBoxLightCustomValueSetEvent>(event);
  assertType<string>(event.detail);
});

narrowedComboBoxLight.addEventListener('opened-changed', (event) => {
  assertType<ComboBoxLightOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBoxLight.addEventListener('invalid-changed', (event) => {
  assertType<ComboBoxLightInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBoxLight.addEventListener('value-changed', (event) => {
  assertType<ComboBoxLightValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBoxLight.addEventListener('filter-changed', (event) => {
  assertType<ComboBoxLightFilterChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBoxLight.addEventListener('selected-item-changed', (event) => {
  assertType<ComboBoxLightSelectedItemChangedEvent<TestComboBoxItem>>(event);
  assertType<TestComboBoxItem | null | undefined>(event.detail.value);
});

// ComboBoxLight properties
assertType<() => boolean>(narrowedComboBoxLight.checkValidity);
assertType<() => boolean>(narrowedComboBoxLight.validate);
assertType<() => void>(narrowedComboBoxLight.close);
assertType<() => void>(narrowedComboBoxLight.open);
assertType<boolean | null | undefined>(narrowedComboBoxLight.autoOpenDisabled);
assertType<boolean>(narrowedComboBoxLight.opened);
assertType<boolean>(narrowedComboBoxLight.invalid);
assertType<boolean>(narrowedComboBoxLight.disabled);
assertType<boolean>(narrowedComboBoxLight.readonly);
assertType<string>(narrowedComboBoxLight.value);

// ComboBoxLight mixins
assertType<ComboBoxDataProviderMixinClass<TestComboBoxItem>>(narrowedComboBoxLight);
assertType<ComboBoxMixinClass<TestComboBoxItem>>(narrowedComboBoxLight);
assertType<DisabledMixinClass>(narrowedComboBoxLight);
assertType<InputMixinClass>(narrowedComboBoxLight);
assertType<KeyboardMixinClass>(narrowedComboBoxLight);
assertType<ThemableMixinClass>(narrowedComboBoxLight);
