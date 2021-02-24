import '../../src/vaadin-overlay';

const assert = <T>(value: T) => value;

const overlay = document.createElement('vaadin-overlay');

overlay.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});
