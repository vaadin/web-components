import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-menu-bar.js';
import '../not-animated-styles.js';

describe('menu-bar', () => {
  let menu;

  const SNAPSHOT_CONFIG = {
    // Some inline CSS styles related to the overlay's position
    // may slightly change depending on the environment, so ignore them.
    ignoreAttributes: ['style'],
  };

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      { text: 'Home' },
      {
        text: 'Reports',
        children: [{ text: 'View Reports' }, { text: 'Generate Report' }],
      },
      { text: 'Dashboard', disabled: true },
      {
        component: (() => {
          const item = document.createElement('vaadin-menu-bar-item');
          const bold = document.createElement('strong');
          bold.textContent = 'Help';
          item.appendChild(bold);
          return item;
        })(),
      },
      {
        text: 'Share',
        component: 'div',
        children: [{ text: 'Twitter' }, { text: 'Facebook' }],
      },
    ];
    await nextRender();
  });

  it('basic', async () => {
    await expect(menu).dom.to.equalSnapshot();
  });

  it('overlay', async () => {
    menu._buttons[1].click();
    await nextRender();
    await expect(menu._subMenu.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay class', async () => {
    menu.overlayClass = 'custom menu-bar-overlay';
    menu._buttons[1].click();
    await nextRender();
    await expect(menu._subMenu.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overflow', async () => {
    menu.style.width = '50px'; // hide all buttons but the "More options" button
    await nextRender();
    menu._overflow.click(); // show the overlay menu (More options)
    menu._overflow.click(); // to hide the overlay menu again
    menu.style.width = null; // to restore the original size of menubar
    await nextRender();
    await nextRender();
    await expect(menu).dom.to.equalSnapshot();
  });
});
