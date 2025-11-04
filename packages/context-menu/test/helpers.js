import { fire, oneEvent } from '@vaadin/testing-helpers';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

export function activateItem(target, event = isTouch ? 'click' : 'mouseover') {
  const { right, bottom } = target.getBoundingClientRect();
  fire(target, event, { x: right, y: bottom });
}

export async function openMenu(target, event = isTouch ? 'click' : 'mouseover') {
  // Try to find a submenu first
  let menu;
  const overlayContent = target.closest('[slot="overlay"]');
  if (overlayContent) {
    menu = overlayContent.parentElement.querySelector('[slot="submenu"]');
  }
  // If no submenu is found, use the closest context menu
  if (!menu) {
    menu = target.closest('vaadin-context-menu');
  }
  // Disable logic that delays opening submenu
  menu.__openListenerActive = true;

  // Open the submenu
  const wasOpened = menu._overlayElement.opened;
  activateItem(target, event);

  // Wait for the submenu to open, unless it was already opened for a different item
  if (!wasOpened) {
    await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
  }
}

export function getMenuItems(menu) {
  return [...menu.querySelectorAll(':scope > [slot="overlay"] [role="menu"] > *')];
}

export function getSubMenu(menu) {
  return menu.querySelector(':scope > vaadin-context-menu[slot="submenu"]');
}

export async function openSubMenus(menu) {
  await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
  const itemElement = menu.querySelector(':scope > [slot="overlay"] [aria-haspopup="true"]');
  if (itemElement) {
    itemElement.dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    const subMenu = getSubMenu(menu);
    await openSubMenus(subMenu);
  }
}
