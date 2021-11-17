import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin';
import { ComboBoxDataProviderMixinClass } from '../../src/vaadin-combo-box-data-provider-mixin';
import { ComboBoxMixinClass } from '../../src/vaadin-combo-box-mixin';
import {
  ComboBox,
  ComboBoxCustomValueSetEvent,
  ComboBoxFilterChangedEvent,
  ComboBoxInvalidChangedEvent,
  ComboBoxOpenedChangedEvent,
  ComboBoxSelectedItemChangedEvent,
  ComboBoxValueChangedEvent
} from '../../vaadin-combo-box';
import {
  ComboBoxLight,
  ComboBoxLightCustomValueSetEvent,
  ComboBoxLightFilterChangedEvent,
  ComboBoxLightInvalidChangedEvent,
  ComboBoxLightOpenedChangedEvent,
  ComboBoxLightSelectedItemChangedEvent,
  ComboBoxLightValueChangedEvent
} from '../../vaadin-combo-box-light';

interface TestComboBoxItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* ComboBoxElement */
const genericComboBox = document.createElement('vaadin-combo-box');

const narrowedComboBox = genericComboBox as ComboBox<TestComboBoxItem>;
assertType<ComboBox>(narrowedComboBox);
assertType<ControllerMixinClass>(narrowedComboBox);
assertType<ElementMixinClass>(narrowedComboBox);
assertType<ComboBoxDataProviderMixinClass<TestComboBoxItem>>(narrowedComboBox);
assertType<ComboBoxMixinClass<TestComboBoxItem>>(narrowedComboBox);
assertType<ThemableMixinClass>(narrowedComboBox);

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

/* ComboBoxLightElement */
const genericComboBoxLightElement = document.createElement('vaadin-combo-box-light');
assertType<ComboBoxLight>(genericComboBoxLightElement);

const narrowedComboBoxLightElement = genericComboBoxLightElement as ComboBoxLight<TestComboBoxItem>;
assertType<ComboBoxDataProviderMixinClass<TestComboBoxItem>>(narrowedComboBoxLightElement);
assertType<ComboBoxMixinClass<TestComboBoxItem>>(narrowedComboBoxLightElement);
assertType<ThemableMixinClass>(narrowedComboBoxLightElement);

narrowedComboBoxLightElement.addEventListener('custom-value-set', (event) => {
  assertType<ComboBoxLightCustomValueSetEvent>(event);
  assertType<string>(event.detail);
});

narrowedComboBoxLightElement.addEventListener('opened-changed', (event) => {
  assertType<ComboBoxLightOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('invalid-changed', (event) => {
  assertType<ComboBoxLightInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('value-changed', (event) => {
  assertType<ComboBoxLightValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('filter-changed', (event) => {
  assertType<ComboBoxLightFilterChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('selected-item-changed', (event) => {
  assertType<ComboBoxLightSelectedItemChangedEvent<TestComboBoxItem>>(event);
  assertType<TestComboBoxItem | null | undefined>(event.detail.value);
});
