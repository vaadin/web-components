import '../../vaadin-dropdown-menu.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ContextMenuItem as ContextMenuItemElement } from '@vaadin/context-menu/src/vaadin-context-menu-item.js';
import type { DropdownMenuMixinClass } from '../../src/vaadin-dropdown-menu-mixin.js';
import type {
  DropdownMenuClosedEvent,
  DropdownMenuItem,
  DropdownMenuItemSelectedEvent,
  DropdownMenuOpenedChangedEvent,
  DropdownMenuPosition,
} from '../../vaadin-dropdown-menu.js';

const menu = document.createElement('vaadin-dropdown-menu');

const assertType = <TExpected>(actual: TExpected) => actual;

// Properties
assertType<string | null | undefined>(menu.label);
assertType<DropdownMenuPosition>(menu.position);
assertType<boolean>(menu.disabled);
assertType<string | null | undefined>(menu.accessibleName);
assertType<DropdownMenuItem[] | undefined>(menu.items);
assertType<boolean>(menu.opened);

// Methods
assertType<() => void>(menu.close);
assertType<(options?: FocusOptions) => void>(menu.focus);

// Mixins
assertType<ElementMixinClass>(menu);
assertType<DropdownMenuMixinClass>(menu);

// Events
menu.addEventListener('item-selected', (event) => {
  assertType<DropdownMenuItemSelectedEvent>(event);
  assertType<DropdownMenuItem | ContextMenuItemElement>(event.detail.value);
});

menu.addEventListener('opened-changed', (event) => {
  assertType<DropdownMenuOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

menu.addEventListener('closed', (event) => {
  assertType<DropdownMenuClosedEvent>(event);
});

// Item data
const items: DropdownMenuItem[] = [
  { text: 'Item 1', disabled: true, keepOpen: true, theme: 'primary', children: [{ text: 'Child' }] },
  { component: 'hr' },
];
menu.items = items;
