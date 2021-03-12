import { DialogResizeDimensions } from '../../src/interfaces';
import '../../src/vaadin-dialog';

const assert = <T>(value: T) => value;

const dialog = document.createElement('vaadin-dialog');

dialog.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

dialog.addEventListener('resize', (event) => {
  assert<DialogResizeDimensions>(event.detail);
});
