import '../../vaadin-confirm-dialog.js';
import { ConfirmDialogOpenedChanged } from '../../vaadin-confirm-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-confirm-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assertType<ConfirmDialogOpenedChanged>(event);
});
