import '../../vaadin-menu-bar';

import { MenuBarItem, MenuBarItemSelectedEvent } from '../../vaadin-menu-bar';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

menu.addEventListener('item-selected', (event) => {
  assertType<MenuBarItemSelectedEvent>(event);
  assertType<MenuBarItem>(event.detail.value);
});
