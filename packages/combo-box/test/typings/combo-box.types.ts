import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
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
  ComboBoxSelectedItemChangedEvent,
  ComboBoxValueChangedEvent
} from '../../vaadin-combo-box';
import {
  ComboBoxLight,
  ComboBoxLightChangeEvent,
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

/* ComboBoxLightElement */
const genericComboBoxLight = document.createElement('vaadin-combo-box-light');
assertType<ComboBoxLight>(genericComboBoxLight);

const narrowedComboBoxLight = genericComboBoxLight as ComboBoxLight<TestComboBoxItem>;
assertType<ComboBoxDataProviderMixinClass<TestComboBoxItem>>(narrowedComboBoxLight);
assertType<ComboBoxMixinClass<TestComboBoxItem>>(narrowedComboBoxLight);
assertType<ThemableMixinClass>(narrowedComboBoxLight);

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
