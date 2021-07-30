import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ComboBoxDataProviderMixin } from '../../src/vaadin-combo-box-data-provider-mixin';
import { ComboBoxMixin } from '../../src/vaadin-combo-box-mixin';
import {
  ComboBoxFilterChangedEvent,
  ComboBoxInvalidChangedEvent,
  ComboBoxOpenedChangedEvent,
  ComboBoxValueChangedEvent,
  ComboBoxCustomValueSetEvent,
  ComboBoxSelectedItemChangedEvent,
  ComboBoxElement
} from '../../vaadin-combo-box';
import { ComboBoxLightElement } from '../../vaadin-combo-box-light';

interface TestComboBoxItem {
  testProperty: string;
}

const assertType = <TExpected>(actual: TExpected) => actual;

/* ComboBoxElement */
const genericComboBox = document.createElement('vaadin-combo-box');

const narrowedComboBox = genericComboBox as ComboBoxElement<TestComboBoxItem>;
assertType<ComboBoxElement>(narrowedComboBox);
assertType<ElementMixin>(narrowedComboBox);
assertType<ControlStateMixin>(narrowedComboBox);
assertType<ComboBoxDataProviderMixin<TestComboBoxItem>>(narrowedComboBox);
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
assertType<ComboBoxLightElement>(genericComboBoxLightElement);

const narrowedComboBoxLightElement = genericComboBoxLightElement as ComboBoxLightElement<TestComboBoxItem>;
assertType<ComboBoxDataProviderMixin<TestComboBoxItem>>(narrowedComboBoxLightElement);
assertType<ComboBoxMixin<TestComboBoxItem>>(narrowedComboBoxLightElement);
assertType<ThemableMixin>(narrowedComboBoxLightElement);

narrowedComboBoxLightElement.addEventListener('custom-value-set', (event) => {
  assertType<ComboBoxCustomValueSetEvent>(event);
  assertType<string>(event.detail);
});

narrowedComboBoxLightElement.addEventListener('opened-changed', (event) => {
  assertType<ComboBoxOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('invalid-changed', (event) => {
  assertType<ComboBoxInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('value-changed', (event) => {
  assertType<ComboBoxValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('filter-changed', (event) => {
  assertType<ComboBoxFilterChangedEvent>(event);
  assertType<string>(event.detail.value);
});

narrowedComboBoxLightElement.addEventListener('selected-item-changed', (event) => {
  assertType<ComboBoxSelectedItemChangedEvent<TestComboBoxItem>>(event);
  assertType<TestComboBoxItem | null | undefined>(event.detail.value);
});
