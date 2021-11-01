import { ElementHost } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ComboBoxDataProviderHost } from '../../src/vaadin-combo-box-data-provider-mixin';
import { ComboBoxHost } from '../../src/vaadin-combo-box-mixin';
import {
  ComboBoxFilterChangedEvent,
  ComboBoxInvalidChangedEvent,
  ComboBoxOpenedChangedEvent,
  ComboBoxValueChangedEvent,
  ComboBoxCustomValueSetEvent,
  ComboBoxSelectedItemChangedEvent,
  ComboBox
} from '../../vaadin-combo-box';
import {
  ComboBoxLightFilterChangedEvent,
  ComboBoxLightInvalidChangedEvent,
  ComboBoxLightOpenedChangedEvent,
  ComboBoxLightValueChangedEvent,
  ComboBoxLightCustomValueSetEvent,
  ComboBoxLightSelectedItemChangedEvent,
  ComboBoxLight
} from '../../vaadin-combo-box-light';

interface TestComboBoxItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* ComboBoxElement */
const genericComboBox = document.createElement('vaadin-combo-box');

const narrowedComboBox = genericComboBox as ComboBox<TestComboBoxItem>;
assertType<ComboBox>(narrowedComboBox);
assertType<ElementHost>(narrowedComboBox);
assertType<ComboBoxDataProviderHost<TestComboBoxItem>>(narrowedComboBox);
assertType<ComboBoxHost<TestComboBoxItem>>(narrowedComboBox);
assertType<ThemableMixin>(narrowedComboBox);

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
assertType<ComboBoxDataProviderHost<TestComboBoxItem>>(narrowedComboBoxLightElement);
assertType<ComboBoxHost<TestComboBoxItem>>(narrowedComboBoxLightElement);
assertType<ThemableMixin>(narrowedComboBoxLightElement);

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
