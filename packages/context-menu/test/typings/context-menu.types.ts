import '../../vaadin-context-menu.js';
import type { ListMixinClass } from '@vaadin/a11y-base/src/list-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type {
  ContextMenu,
  ContextMenuClosedEvent,
  ContextMenuItem as DeprecatedMenuItem,
  ContextMenuItemData,
  ContextMenuItemSelectedEvent,
  ContextMenuOpenedChangedEvent,
  ContextMenuPosition,
  ContextMenuRenderer,
  ContextMenuRendererContext,
} from '../../vaadin-context-menu.js';
import type { ContextMenuItem } from '../../vaadin-context-menu-item.js';
import type { ContextMenuListBox } from '../../vaadin-context-menu-list-box.js';

const menu = document.createElement('vaadin-context-menu');

const assertType = <TExpected>(actual: TExpected) => actual;

// Properties
assertType<boolean>(menu.opened);
assertType<string>(menu.openOn);
assertType<string>(menu.closeOn);
assertType<HTMLElement>(menu.listenOn);
assertType<ContextMenuPosition | null | undefined>(menu.position);

// Events
menu.addEventListener('opened-changed', (event) => {
  assertType<ContextMenuOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

menu.addEventListener('item-selected', (event) => {
  assertType<ContextMenuItemSelectedEvent>(event);
  assertType<ContextMenuItemData>(event.detail.value);
});

menu.addEventListener('closed', (event) => {
  assertType<ContextMenuClosedEvent>(event);
});

const renderer: ContextMenuRenderer = (root, contextMenu, context) => {
  assertType<HTMLElement>(root);
  assertType<ContextMenu>(contextMenu);
  assertType<ContextMenuRendererContext>(context);
  assertType<HTMLElement>(context.target);
};

menu.renderer = renderer;

// Menu item properties
const menuItem: ContextMenuItemData = {};
assertType<string | undefined>(menuItem.text);
assertType<string | undefined>(menuItem.tooltip);
assertType<string | undefined>(menuItem.tooltipPosition);
assertType<boolean | undefined>(menuItem.disabled);
assertType<boolean | undefined>(menuItem.checked);
assertType<boolean | undefined>(menuItem.keepOpen);
assertType<ContextMenuItemData[] | undefined>(menuItem.children);

// Deprecated `ContextMenuItem` type alias still resolves to `ContextMenuItemData`.
const deprecatedMenuItem: DeprecatedMenuItem = menuItem;
assertType<ContextMenuItemData>(deprecatedMenuItem);

// Custom item data
interface ItemData {
  type: 'copy' | 'cut' | 'paste';
  value: string;
}

const narrowedMenu = menu as ContextMenu<ContextMenuItemData<ItemData>>;

assertType<ItemData>(narrowedMenu.items![0]);
assertType<ItemData>(narrowedMenu.items![0].children![0]);
assertType<ItemData>(narrowedMenu.items![0].children![0].children![0]);

narrowedMenu.addEventListener('item-selected', (event) => {
  assertType<ItemData>(event.detail.value);
});

// Item
const item = document.createElement('vaadin-context-menu-item');

assertType<ContextMenuItem>(item);
assertType<ItemMixinClass>(item);
assertType<DirMixinClass>(item);
assertType<ThemableMixinClass>(item);

// List-box
const listBox = document.createElement('vaadin-context-menu-list-box');

assertType<ContextMenuListBox>(listBox);
assertType<DirMixinClass>(listBox);
assertType<ListMixinClass>(listBox);
assertType<ThemableMixinClass>(listBox);
