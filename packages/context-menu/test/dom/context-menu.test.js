import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../../src/vaadin-context-menu.js';
import '../not-animated-styles.js';
import { openSubMenus } from '../helpers.js';

function createComponent(textContent, { className }) {
  const component = document.createElement('div');
  component.textContent = textContent;
  component.setAttribute('class', className);
  return component;
}

describe('context-menu', () => {
  let menu, overlay;

  const SNAPSHOT_CONFIG = {
    // Some inline CSS styles related to the overlay's position
    // may slightly change depending on the environment, so ignore them.
    ignoreAttributes: ['style'],
  };

  const ITEMS = [
    { text: 'Menu Item 1', className: 'first' },
    { component: 'hr' },
    {
      text: 'Menu Item 2',
      children: [
        { text: 'Menu Item 2-1', className: 'first' },
        {
          text: 'Menu Item 2-2',
          className: 'last',
          children: [
            { text: 'Menu Item 2-2-1', checked: true, className: 'first' },
            { text: 'Menu Item 2-2-2', disabled: true },
            { component: 'hr' },
            { text: 'Menu Item 2-2-3', className: 'last' },
          ],
        },
      ],
    },
    { text: 'Menu Item 3', disabled: true },
    { component: createComponent('Menu Item 4', { className: 'custom' }) },
    { component: createComponent('Menu Item 5', { className: 'custom' }), className: 'last' },
  ];

  const contextmenu = (target) => {
    const domRect = target.getBoundingClientRect();

    target.listenOn.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: domRect.left,
        clientY: domRect.y,
      }),
    );
  };

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <div style="padding: 10px">Target</div>
      </vaadin-context-menu>
    `);
    await nextRender();
    overlay = menu.$.overlay;
  });

  it('items', async () => {
    menu.items = ITEMS;

    contextmenu(menu);
    await nextRender();

    await expect(overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('items nested', async () => {
    menu.items = ITEMS;

    contextmenu(menu);
    await openSubMenus(menu);
    await nextRender();

    const subMenu = overlay.querySelector('vaadin-context-menu');
    await expect(subMenu.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('items overlay class', async () => {
    menu.overlayClass = 'context-menu-overlay custom';
    menu.items = ITEMS;

    contextmenu(menu);
    await nextRender();

    await expect(menu.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('items overlay class nested', async () => {
    menu.overlayClass = 'context-menu-overlay custom';
    menu.items = ITEMS;

    contextmenu(menu);
    await openSubMenus(menu);
    await nextRender();

    const subMenu = overlay.querySelector('vaadin-context-menu');
    await expect(subMenu.$.overlay).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
