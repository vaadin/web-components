import '../../src/vaadin-date-picker';

const assert = <T>(value: T) => value;

const datePicker = document.createElement('vaadin-date-picker');

datePicker.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

datePicker.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

datePicker.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
