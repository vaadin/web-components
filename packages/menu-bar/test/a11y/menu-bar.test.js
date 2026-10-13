import { expect } from '@vaadin/chai-plugins';
import { arrowDown, arrowRight, fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-menu-bar.js';

// Known issues with an opened sub-menu:
// - Menu items have `aria-selected`, which `role="menuitem"` does not support.
//   See https://github.com/vaadin/web-components/issues/165
// - The sub-menu overlay is rendered inside the menu bar, which only allows menu items as children.
const AXE_OPTIONS = { expectedViolations: ['aria-allowed-attr', 'aria-required-children'] };

describe('vaadin-menu-bar', () => {
  let menu, overlay;

  beforeEach(async () => {
    // Fixed button width so that the collapsed set does not depend on the font
    fixtureSync(`
      <style>
        vaadin-menu-bar-button {
          width: 80px;
        }
      </style>
    `);
    menu = fixtureSync('<vaadin-menu-bar aria-label="Main"></vaadin-menu-bar>');
    menu.items = [
      { text: 'Home' },
      {
        text: 'View',
        children: [
          { text: 'Grid', checked: true },
          { text: 'List' },
          { component: 'hr' },
          { text: 'Sort', children: [{ text: 'By name' }, { text: 'By date' }] },
        ],
      },
      { text: 'Reports', disabled: true },
      { text: 'Help' },
    ];
    await nextResize(menu);
    overlay = menu._subMenu._overlayElement;
  });

  const openSubMenu = async (button) => {
    arrowDown(button);
    await oneEvent(overlay, 'vaadin-overlay-open');
  };

  it('default', async () => {
    await expect(menu).to.equalA11yTreeSnapshot();
    await expect(menu).to.be.accessible();
  });

  it('sub-menu opened', async () => {
    await openSubMenu(menu._buttons[1]);
    // Known issue: the checked item has `role="menuitem"` and no checked state.
    // See https://github.com/vaadin/web-components/issues/165
    await expect(menu).to.equalA11yTreeSnapshot();
    await expect(menu).to.be.accessible(AXE_OPTIONS);
  });

  it('nested sub-menu opened', async () => {
    await openSubMenu(menu._buttons[1]);
    const items = overlay._contentRoot.querySelectorAll('vaadin-menu-bar-item');
    const sortItem = [...items].find((item) => item.textContent.trim() === 'Sort');
    arrowRight(sortItem);
    await nextRender();
    await expect(menu).to.equalA11yTreeSnapshot();
    await expect(menu).to.be.accessible(AXE_OPTIONS);
  });

  it('tab navigation', async () => {
    menu.tabNavigation = true;
    await nextRender();
    await expect(menu).to.equalA11yTreeSnapshot();
    await expect(menu).to.be.accessible();
  });

  it('overflow', async () => {
    menu.style.width = '250px';
    await nextResize(menu);
    await expect(menu).to.equalA11yTreeSnapshot();
    await expect(menu).to.be.accessible();
  });

  it('overflow opened', async () => {
    menu.style.width = '250px';
    await nextResize(menu);
    await openSubMenu(menu._buttons.at(-1));
    await expect(menu).to.equalA11yTreeSnapshot();
    await expect(menu).to.be.accessible(AXE_OPTIONS);
  });
});
