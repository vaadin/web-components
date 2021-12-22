import '../../vaadin-menu-bar';
import { ResizableMixinClass } from '@vaadin/component-base/src/resizable-mixin';
import { MenuBarItem, MenuBarItemSelectedEvent } from '../../vaadin-menu-bar';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<ResizableMixinClass>(menu);

menu.addEventListener('item-selected', (event) => {
  assertType<MenuBarItemSelectedEvent>(event);
  assertType<MenuBarItem>(event.detail.value);
});
