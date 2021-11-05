import '../../vaadin-dialog.js';
import { DialogOpenedChangedEvent, DialogResizeDimensions, DialogResizeEvent } from '../../vaadin-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assertType<DialogOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

dialog.addEventListener('resize', (event) => {
  assertType<DialogResizeEvent>(event);
  assertType<DialogResizeDimensions>(event.detail);
});
