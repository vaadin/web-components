import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.css';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';
import { getButton, getOverlay, getOverlayPart, openMenu, openSubMenu } from './helpers.js';

describe('vaadin-dropdown-menu - overlay width', () => {
  let menu: DropdownMenu;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-dropdown-menu label="Actions" style="width: 200px"></vaadin-dropdown-menu>');
    menu.items = [{ text: 'A' }, { text: 'B', children: [{ text: 'C' }] }];
    await nextRender();
  });

  afterEach(() => {
    menu.close();
  });

  it('should set overlay min-width to the button width', async () => {
    await openMenu(menu);
    const minWidth = getComputedStyle(getOverlayPart(getOverlay(menu))).minWidth;
    expect(minWidth).to.equal(`${getButton(menu).offsetWidth}px`);
  });

  it('should set overlay min-width from the custom property', async () => {
    menu.style.setProperty('--vaadin-dropdown-menu-overlay-width', '300px');
    await openMenu(menu);
    const minWidth = getComputedStyle(getOverlayPart(getOverlay(menu))).minWidth;
    expect(minWidth).to.equal('300px');
  });

  it('should not set nested overlay min-width to the button width', async () => {
    await openMenu(menu);
    await nextRender();
    const subMenu = await openSubMenu(menu, 1);
    const minWidth = getComputedStyle(getOverlayPart(getOverlay(subMenu))).minWidth;
    expect(minWidth).to.not.equal(`${getButton(menu).offsetWidth}px`);
  });
});
