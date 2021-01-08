import '../../src/vaadin-time-picker';

const timePicker = document.createElement('vaadin-time-picker');

const assert = <T>(value: T) => value;

timePicker.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

timePicker.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
