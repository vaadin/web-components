import '../../vaadin-menu-bar.js';
import { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import { MenuBarItem, MenuBarItemSelectedEvent } from '../../vaadin-menu-bar.js';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<ResizeMixinClass>(menu);

menu.addEventListener('item-selected', (event) => {
  assertType<MenuBarItemSelectedEvent>(event);
  assertType<MenuBarItem>(event.detail.value);
});
