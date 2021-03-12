import '../../src/vaadin-date-time-picker';

const assert = <T>(value: T) => value;

const picker = document.createElement('vaadin-date-time-picker');

picker.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

picker.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
