import '../../vaadin-confirm-dialog.js';
import type { ConfirmDialogOpenedChangedEvent } from '../../vaadin-confirm-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-confirm-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assertType<ConfirmDialogOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dialog.addEventListener('confirm', (event) => {
  assertType<Event>(event);
});

dialog.addEventListener('cancel', (event) => {
  assertType<Event>(event);
});

dialog.addEventListener('reject', (event) => {
  assertType<Event>(event);
});
