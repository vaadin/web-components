import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../../src/vaadin-menu-bar.js';

describe('menu-bar', () => {
  let menu;

  const SNAPSHOT_CONFIG = {
    // Some inline CSS styles related to the overlay's position
    // may slightly change depending on the environment, so ignore them.
    ignoreAttributes: ['style'],
  };

  beforeEach(async () => {
    // Fixed button width so that the collapsed set does not depend on the font
    fixtureSync(`
      <style>
        vaadin-menu-bar-button {
          width: 60px;
        }
      </style>
    `);
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      { text: 'Home', className: 'home' },
      {
        text: 'Reports',
        children: [{ text: 'View Reports' }, { text: 'Generate Report', className: 'reports generate' }],
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
        className: 'help',
      },
    ];
    await nextResize(menu);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(menu).dom.to.equalSnapshot();
    });

    it('opened', async () => {
      menu._buttons[1].click();
      await nextRender();
      await expect(menu).dom.to.equalSnapshot();
    });

    it('overlay', async () => {
      menu._buttons[1].click();
      await nextRender();
      await expect(menu._subMenu._overlayElement).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('has-overflow', async () => {
      menu.style.width = '180px';
      await nextResize(menu);
      await expect(menu).dom.to.equalSnapshot();
    });

    it('has-single-button', async () => {
      menu.style.width = '100px';
      await nextResize(menu);
      await expect(menu).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(menu).shadowDom.to.equalSnapshot();
    });
  });
});
