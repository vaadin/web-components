import '../../vaadin-menu-bar';

import { MenuBarItemSelected } from '../../vaadin-menu-bar';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

menu.addEventListener('item-selected', (event) => {
  assertType<MenuBarItemSelected>(event);
});
