import '../../src/vaadin-custom-field';

const customField = document.createElement('vaadin-custom-field');

const assert = <T>(value: T) => value;

customField.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

customField.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
