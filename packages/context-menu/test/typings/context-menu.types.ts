import '../../vaadin-context-menu.js';
import {
  ContextMenuItem,
  ContextMenuItemSelectedEvent,
  ContextMenuOpenedChangedEvent,
} from '../../vaadin-context-menu.js';

const menu = document.createElement('vaadin-context-menu');

const assertType = <TExpected>(actual: TExpected) => actual;

menu.addEventListener('opened-changed', (event) => {
  assertType<ContextMenuOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

menu.addEventListener('item-selected', (event) => {
  assertType<ContextMenuItemSelectedEvent>(event);
  assertType<ContextMenuItem>(event.detail.value);
});
