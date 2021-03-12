import '../../src/vaadin-details';

const assert = <T>(value: T) => value;

const details = document.createElement('vaadin-details');

details.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});
