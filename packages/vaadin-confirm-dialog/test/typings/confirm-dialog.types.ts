import '../../src/vaadin-confirm-dialog';

const assert = <T>(value: T) => value;

const dialog = document.createElement('vaadin-confirm-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

dialog.addEventListener('confirm', (event) => {
  assert<Event>(event);
});

dialog.addEventListener('cancel', (event) => {
  assert<Event>(event);
});

dialog.addEventListener('reject', (event) => {
  assert<Event>(event);
});
