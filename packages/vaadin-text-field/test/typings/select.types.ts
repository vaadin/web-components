import '../../src/vaadin-text-field';
import '../../src/vaadin-text-area';
import '../../src/vaadin-password-field';

const assert = <T>(value: T) => value;

const field = document.createElement('vaadin-text-field');

field.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});

const area = document.createElement('vaadin-text-area');

area.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

area.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});

const password = document.createElement('vaadin-password-field');

password.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

password.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
