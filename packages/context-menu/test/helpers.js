import { fire, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

export async function openMenu(target, event = isTouch ? 'click' : 'mouseover') {
  const menu = target.closest('vaadin-context-menu');
  if (menu) {
    menu.__openListenerActive = true;
  }
  const { right, bottom } = target.getBoundingClientRect();
  fire(target, event, { x: right, y: bottom });
  await nextFrame();
}

export function getMenuItems(menu) {
  return [...menu.$.overlay.querySelectorAll('[role="menu"] > :not([role="separator]"')];
}

export function getSubMenu(menu) {
  return menu.$.overlay.querySelector('vaadin-context-menu');
}

export async function openSubMenus(menu) {
  await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
  const itemElement = menu.$.overlay.querySelector('[aria-haspopup="true"]');
  if (itemElement) {
    itemElement.dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    const subMenu = getSubMenu(menu);
    await openSubMenus(subMenu);
  }
}

export function outsideClick() {
  // Move focus to body
  document.body.tabIndex = 0;
  document.body.focus();
  document.body.tabIndex = -1;
  // Outside click
  document.body.click();
}
