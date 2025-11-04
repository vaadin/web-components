import '../../vaadin-menu-bar.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ListMixinClass } from '@vaadin/a11y-base/src/list-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ThemePropertyMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import type { MenuBarButton } from '../../src/vaadin-menu-bar-button.js';
import type { MenuBarItem } from '../../src/vaadin-menu-bar-item.js';
import type { MenuBarListBox } from '../../src/vaadin-menu-bar-list-box.js';
import type { MenuBarI18n, MenuBarMixinClass } from '../../src/vaadin-menu-bar-mixin.js';
import type { MenuBarSubmenu } from '../../src/vaadin-menu-bar-submenu.js';
import type { MenuBar, MenuBarItem as MenuItem, MenuBarItemSelectedEvent } from '../../vaadin-menu-bar.js';

const menu = document.createElement('vaadin-menu-bar');

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<boolean | null | undefined>(menu.openOnHover);
assertType<boolean | null | undefined>(menu.tabNavigation);
assertType<MenuItem[]>(menu.items);

assertType<ResizeMixinClass>(menu);
assertType<FocusMixinClass>(menu);
assertType<I18nMixinClass<MenuBarI18n>>(menu);
assertType<MenuBarMixinClass>(menu);
assertType<ThemableMixinClass>(menu);
assertType<ThemePropertyMixinClass>(menu);

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

// Custom item data
interface ItemData {
  type: 'copy' | 'cut' | 'paste';
  value: string;
}

const narrowedMenu = menu as MenuBar<MenuItem<ItemData>>;

assertType<ItemData>(narrowedMenu.items[0]);
assertType<ItemData>(narrowedMenu.items[0].children![0]);
assertType<ItemData>(narrowedMenu.items[0].children![0].children![0]);

narrowedMenu.addEventListener('item-selected', (event) => {
  assertType<ItemData>(event.detail.value);
});

// I18n
assertType<MenuBarI18n>({});
assertType<MenuBarI18n>({ moreOptions: 'More' });

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

// Button
const button = document.createElement('vaadin-menu-bar-button');

assertType<MenuBarButton>(button);
assertType<ThemableMixinClass>(button);

// Submenu
const submenu = document.createElement('vaadin-menu-bar-submenu');

assertType<MenuBarSubmenu>(submenu);
assertType<ThemePropertyMixinClass>(submenu);
assertType<boolean>(submenu.opened);
