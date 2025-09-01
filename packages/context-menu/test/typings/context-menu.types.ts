import '../../vaadin-context-menu.js';
import type { ListMixinClass } from '@vaadin/a11y-base/src/list-mixin.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ContextMenuItem } from '../../src/vaadin-context-menu-item.js';
import type { ContextMenuListBox } from '../../src/vaadin-context-menu-list-box.js';
import type {
  ContextMenu,
  ContextMenuClosedEvent,
  ContextMenuItem as MenuItem,
  ContextMenuItemSelectedEvent,
  ContextMenuOpenedChangedEvent,
  ContextMenuPosition,
  ContextMenuRenderer,
  ContextMenuRendererContext,
} from '../../vaadin-context-menu.js';

const menu = document.createElement('vaadin-context-menu');

const assertType = <TExpected>(actual: TExpected) => actual;

// Properties
assertType<boolean>(menu.opened);
assertType<string>(menu.openOn);
assertType<string>(menu.closeOn);
assertType<HTMLElement>(menu.listenOn);
assertType<ContextMenuPosition>(menu.position);

// Events
menu.addEventListener('opened-changed', (event) => {
  assertType<ContextMenuOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

menu.addEventListener('item-selected', (event) => {
  assertType<ContextMenuItemSelectedEvent>(event);
  assertType<MenuItem>(event.detail.value);
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

// Custom item data
interface ItemData {
  type: 'copy' | 'cut' | 'paste';
  value: string;
}

const narrowedMenu = menu as ContextMenu<MenuItem<ItemData>>;

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
