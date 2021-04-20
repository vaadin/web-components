import '../../vaadin-combo-box';
import {
  ComboBoxFilterChanged,
  ComboBoxInvalidChanged,
  ComboBoxOpenedChanged,
  ComboBoxValueChanged,
  ComboBoxCustomValueSet,
  ComboBoxSelectedItemChanged,
  ComboBoxSelectedItemChangedEvent
} from '../../vaadin-combo-box';

import '../../vaadin-combo-box-light';

const assertType = <TExpected>(actual: TExpected) => actual;

const comboBox = document.createElement('vaadin-combo-box');

comboBox.addEventListener('custom-value-set', (event) => {
  assertType<ComboBoxCustomValueSet>(event);
});

comboBox.addEventListener('opened-changed', (event) => {
  assertType<ComboBoxOpenedChanged>(event);
});

comboBox.addEventListener('invalid-changed', (event) => {
  assertType<ComboBoxInvalidChanged>(event);
});

comboBox.addEventListener('value-changed', (event) => {
  assertType<ComboBoxValueChanged>(event);
});

comboBox.addEventListener('filter-changed', (event) => {
  assertType<ComboBoxFilterChanged>(event);
});

comboBox.addEventListener(
  'selected-item-changed',
  (event: ComboBoxSelectedItemChangedEvent<{ label: string; value: string }>) => {
    assertType<ComboBoxSelectedItemChanged<{ label: string; value: string }>>(event);
  }
);

const light = document.createElement('vaadin-combo-box-light');

light.addEventListener('custom-value-set', (event) => {
  assertType<ComboBoxCustomValueSet>(event);
});

light.addEventListener('opened-changed', (event) => {
  assertType<ComboBoxOpenedChanged>(event);
});

light.addEventListener('invalid-changed', (event) => {
  assertType<ComboBoxInvalidChanged>(event);
});

light.addEventListener('value-changed', (event) => {
  assertType<ComboBoxValueChanged>(event);
});

light.addEventListener('filter-changed', (event) => {
  assertType<ComboBoxFilterChanged>(event);
});

light.addEventListener(
  'selected-item-changed',
  (event: ComboBoxSelectedItemChangedEvent<{ label: string; value: string }>) => {
    assertType<ComboBoxSelectedItemChanged<{ label: string; value: string }>>(event);
  }
);
