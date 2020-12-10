import '../../src/vaadin-list-box';

const listBox = document.createElement('vaadin-list-box');

const assert = <T>(value: T) => value;

listBox.addEventListener('items-changed', (event) => {
  assert<Element[]>(event.detail.value);
});

listBox.addEventListener('selected-changed', (event) => {
  assert<number>(event.detail.value);
});

listBox.addEventListener('selected-values-changed', (event) => {
  assert<string[]>(event.detail.value);
});
