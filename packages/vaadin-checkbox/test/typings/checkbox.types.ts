import '../../src/vaadin-checkbox';
import '../../src/vaadin-checkbox-group';

const checkbox = document.createElement('vaadin-checkbox');

const assert = <T>(value: T) => value;

checkbox.addEventListener('checked-changed', (event) => {
  assert<boolean>(event.detail.value);
});

checkbox.addEventListener('indeterminate-changed', (event) => {
  assert<boolean>(event.detail.value);
});

const group = document.createElement('vaadin-checkbox-group');

group.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assert<string[]>(event.detail.value);
});
