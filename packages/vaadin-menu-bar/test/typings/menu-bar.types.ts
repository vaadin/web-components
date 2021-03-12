import { MenuBarItem } from '../../src/interfaces';
import '../../src/vaadin-menu-bar';

const menu = document.createElement('vaadin-menu-bar');

const assert = <T>(value: T) => value;

menu.addEventListener('item-selected', (event) => {
  assert<MenuBarItem>(event.detail.value);
});
