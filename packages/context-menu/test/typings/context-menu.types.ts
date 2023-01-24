import '../../vaadin-context-menu.js';
import type { DirMixinClass } from '@vaadin/component-base/src/dir-mixin.js';
import type { ListMixinClass } from '@vaadin/component-base/src/list-mixin.js';
import type { ItemMixinClass } from '@vaadin/item/src/vaadin-item-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { ContextMenuItem } from '../../src/vaadin-context-menu-item.js';
import type { ContextMenuListBox } from '../../src/vaadin-context-menu-list-box.js';
import type {
  ContextMenu,
  ContextMenuItem as MenuItem,
  ContextMenuItemSelectedEvent,
  ContextMenuOpenedChangedEvent,
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
assertType<string>(menu.overlayClass);

// Events
menu.addEventListener('opened-changed', (event) => {
  assertType<ContextMenuOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

menu.addEventListener('item-selected', (event) => {
  assertType<ContextMenuItemSelectedEvent>(event);
  assertType<MenuItem>(event.detail.value);
});

const renderer: ContextMenuRenderer = (root, contextMenu, context) => {
  assertType<HTMLElement>(root);
  assertType<ContextMenu>(contextMenu);
  assertType<ContextMenuRendererContext>(context);
  assertType<HTMLElement>(context.target);
};

menu.renderer = renderer;

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
