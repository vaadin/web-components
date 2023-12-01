import { fire, nextRender, oneEvent } from '@vaadin/testing-helpers';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

export async function openMenu(target, event = isTouch ? 'click' : 'mouseover') {
  const menu = target.closest('vaadin-context-menu');
  if (menu) {
    menu.__openListenerActive = true;
  }
  const { right, bottom } = target.getBoundingClientRect();
  fire(target, event, { x: right, y: bottom });
  await nextRender();
}

export function getMenuItems(menu) {
  return [...menu._overlayElement.querySelectorAll('[role="menu"] > :not([role="separator]"')];
}

export function getSubMenu(menu) {
  return menu._overlayElement.querySelector('vaadin-context-menu');
}

export async function openSubMenus(menu) {
  await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
  const itemElement = menu._overlayElement.querySelector('[aria-haspopup="true"]');
  if (itemElement) {
    itemElement.dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    const subMenu = getSubMenu(menu);
    await openSubMenus(subMenu);
  }
}
