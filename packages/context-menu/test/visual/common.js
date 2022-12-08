import { oneEvent } from '@vaadin/testing-helpers';

export async function openSubMenus(menu) {
  await oneEvent(menu.$.overlay, 'vaadin-overlay-open');
  const itemElement = menu.$.overlay.querySelector('[aria-haspopup="true"]');
  if (itemElement) {
    itemElement.dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    const subMenu = menu.$.overlay.querySelector('vaadin-context-menu');
    await openSubMenus(subMenu);
  }
}
