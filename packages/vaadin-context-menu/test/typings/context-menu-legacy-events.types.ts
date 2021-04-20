import '../../vaadin-context-menu.js';
import { ContextMenuOpenedChanged, ContextMenuItemSelected } from '../../vaadin-context-menu.js';

const menu = document.createElement('vaadin-context-menu');

const assertType = <TExpected>(actual: TExpected) => actual;

menu.addEventListener('opened-changed', (event) => {
  assertType<ContextMenuOpenedChanged>(event);
});

menu.addEventListener('item-selected', (event) => {
  assertType<ContextMenuItemSelected>(event);
});
