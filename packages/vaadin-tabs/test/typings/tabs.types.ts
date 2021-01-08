import '../../src/vaadin-tabs';

const tabs = document.createElement('vaadin-tabs');

const assert = <T>(value: T) => value;

tabs.addEventListener('items-changed', (event) => {
  assert<Element[]>(event.detail.value);
});

tabs.addEventListener('selected-changed', (event) => {
  assert<number>(event.detail.value);
});
