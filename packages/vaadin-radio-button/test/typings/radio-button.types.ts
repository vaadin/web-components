import '../../src/vaadin-radio-button';
import '../../src/vaadin-radio-group';

const radio = document.createElement('vaadin-radio-button');

const assert = <T>(value: T) => value;

radio.addEventListener('checked-changed', (event) => {
  assert<boolean>(event.detail.value);
});

const group = document.createElement('vaadin-radio-group');

group.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

group.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
