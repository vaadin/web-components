import '../../vaadin-dialog.js';
import { DialogResize, DialogOpenedChanged } from '../../vaadin-dialog.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const dialog = document.createElement('vaadin-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assertType<DialogOpenedChanged>(event);
});

dialog.addEventListener('resize', (event) => {
  assertType<DialogResize>(event);
});
