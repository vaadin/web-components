import '../../vaadin-context-menu.js';
import type {
  ContextMenu,
  ContextMenuItem,
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
  assertType<ContextMenuItem>(event.detail.value);
});

const renderer: ContextMenuRenderer = (root, contextMenu, context) => {
  assertType<HTMLElement>(root);
  assertType<ContextMenu>(contextMenu);
  assertType<ContextMenuRendererContext>(context);
  assertType<HTMLElement>(context.target);
};

menu.renderer = renderer;
