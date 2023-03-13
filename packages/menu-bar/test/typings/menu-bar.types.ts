import '../../vaadin-menu-bar.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ListMixinClass } from '@vaadin/a11y-base/src/list-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { MenuBarItem } from '../../src/vaadin-menu-bar-item.js';
import type { MenuBarListBox } from '../../src/vaadin-menu-bar-list-box.js';
import type { MenuBarMixinClass } from '../../src/vaadin-menu-bar-mixin.js';
import type { MenuBarItem as MenuItem, MenuBarItemSelectedEvent } from '../../vaadin-menu-bar.js';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<boolean | null | undefined>(menu.openOnHover);
assertType<MenuItem[]>(menu.items);
assertType<string>(menu.overlayClass);

assertType<ResizeMixinClass>(menu);
assertType<ControllerMixinClass>(menu);
assertType<FocusMixinClass>(menu);
assertType<MenuBarMixinClass>(menu);

menu.addEventListener('item-selected', (event) => {
  assertType<MenuBarItemSelectedEvent>(event);
  assertType<MenuItem>(event.detail.value);
});

const menuItem = menu.items[0];

assertType<string | undefined>(menuItem.tooltip);
assertType<string | undefined>(menuItem.text);
assertType<boolean | undefined>(menuItem.disabled);
assertType<string[] | string | undefined>(menuItem.theme);
assertType<MenuItem[] | undefined>(menuItem.children);
assertType<HTMLElement | string | undefined>(menuItem.component);

// Item
const item = document.createElement('vaadin-menu-bar-item');

assertType<MenuBarItem>(item);
assertType<ItemMixinClass>(item);
assertType<DirMixinClass>(item);
assertType<ThemableMixinClass>(item);

// List-box
const listBox = document.createElement('vaadin-menu-bar-list-box');

assertType<MenuBarListBox>(listBox);
assertType<DirMixinClass>(listBox);
assertType<ListMixinClass>(listBox);
assertType<ThemableMixinClass>(listBox);
