import { ComboBoxSelectedItemChanged } from '../../src/interfaces';
import '../../src/vaadin-combo-box';
import '../../src/vaadin-combo-box-light';

const assert = <T>(value: T) => value;

const comboBox = document.createElement('vaadin-combo-box');

comboBox.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

comboBox.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

comboBox.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});

comboBox.addEventListener('filter-changed', (event) => {
  assert<string>(event.detail.value);
});

comboBox.addEventListener(
  'selected-item-changed',
  (event: ComboBoxSelectedItemChanged<{ label: string; value: string }>) => {
    assert<{ label: string; value: string }>(event.detail.value);
  }
);

const light = document.createElement('vaadin-combo-box-light');

light.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

light.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

light.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});

light.addEventListener('filter-changed', (event) => {
  assert<string>(event.detail.value);
});

light.addEventListener(
  'selected-item-changed',
  (event: ComboBoxSelectedItemChanged<{ label: string; value: string }>) => {
    assert<{ label: string; value: string }>(event.detail.value);
  }
);
