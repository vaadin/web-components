import { fire, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-dropdown-menu.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import type { DropdownMenuButton } from '../src/vaadin-dropdown-menu-button.js';
import type { DropdownMenuOverlay } from '../src/vaadin-dropdown-menu-overlay.js';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';

window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.dropdownMenuComponent = true;

export function getButton(menu: DropdownMenu): DropdownMenuButton {
  return menu.querySelector(':scope > [slot="button"]')!;
}

export function getOverlay(menu: Element): DropdownMenuOverlay {
  return menu.shadowRoot!.querySelector('[id="overlay"]')!;
}

export function getOverlayPart(overlay: Element): HTMLElement {
  return overlay.shadowRoot!.querySelector('[part="overlay"]')!;
}

export function getMenuItems(menu: Element): HTMLElement[] {
  const selector = ':scope > [slot="overlay"][role="menu"] > *, :scope > [slot="overlay"] > [role="menu"] > *';
  return [...menu.querySelectorAll<HTMLElement>(selector)];
}

export function getSubMenu(menu: Element): HTMLElement {
  return menu.querySelector(':scope > [slot="submenu"]')!;
}

export async function openMenu(menu: DropdownMenu): Promise<void> {
  const opened = oneEvent(getOverlay(menu), 'vaadin-overlay-open');
  getButton(menu).click();
  await opened;
}

export async function openSubMenu(parent: Element, index: number): Promise<HTMLElement> {
  const subMenu = getSubMenu(parent);
  const opened = oneEvent(getOverlay(subMenu), 'vaadin-overlay-open');
  fire(getMenuItems(parent)[index], isTouch ? 'click' : 'mouseover');
  await opened;
  return subMenu;
}
