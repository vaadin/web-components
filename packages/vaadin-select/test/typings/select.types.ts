import '../../src/vaadin-select';

const assert = <T>(value: T) => value;

const select = document.createElement('vaadin-select');

select.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

select.addEventListener('invalid-changed', (event) => {
  assert<boolean>(event.detail.value);
});

select.addEventListener('value-changed', (event) => {
  assert<string>(event.detail.value);
});
