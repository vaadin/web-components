import '../../vaadin-menu-bar.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { FocusMixinClass } from '@vaadin/component-base/src/focus-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { MenuBarMixinClass } from '../../src/vaadin-menu-bar-mixin.js';
import type { MenuBarItem, MenuBarItemSelectedEvent } from '../../vaadin-menu-bar.js';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<ResizeMixinClass>(menu);
assertType<ControllerMixinClass>(menu);
assertType<FocusMixinClass>(menu);
assertType<MenuBarMixinClass>(menu);

menu.addEventListener('item-selected', (event) => {
  assertType<MenuBarItemSelectedEvent>(event);
  assertType<MenuBarItem>(event.detail.value);
});

const menuItem = menu.items[0];

assertType<string | undefined>(menuItem.tooltip);
assertType<string | undefined>(menuItem.text);
assertType<boolean | undefined>(menuItem.disabled);
assertType<string[] | string | undefined>(menuItem.theme);
assertType<MenuBarItem[] | undefined>(menuItem.children);
assertType<HTMLElement | string | undefined>(menuItem.component);
