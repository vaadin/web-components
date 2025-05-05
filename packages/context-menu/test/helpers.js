import { fire, oneEvent } from '@vaadin/testing-helpers';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

export function activateItem(target, event = isTouch ? 'click' : 'mouseover') {
  const { right, bottom } = target.getBoundingClientRect();
  fire(target, event, { x: right, y: bottom });
}

export async function openMenu(target, event = isTouch ? 'click' : 'mouseover') {
  let menu = target.closest('vaadin-context-menu');
  if (!menu) {
    // If the target is a menu item, get reference to the submenu.
    const overlay = target.closest('vaadin-context-menu-overlay');
    menu = overlay.querySelector('vaadin-context-menu');
  }
  // Disable logic that delays opening submenu
  menu.__openListenerActive = true;
  activateItem(target, event);
  await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
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
