import { ContextMenuItem } from '../../src/interfaces';
import '../../src/vaadin-context-menu';

const menu = document.createElement('vaadin-context-menu');

const assert = <T>(value: T) => value;

menu.addEventListener('opened-changed', (event) => {
  assert<boolean>(event.detail.value);
});

menu.addEventListener('item-selected', (event) => {
  assert<ContextMenuItem>(event.detail.value);
});
