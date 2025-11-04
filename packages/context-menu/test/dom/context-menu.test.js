import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../not-animated-styles.js';
import '../../src/vaadin-context-menu.js';
import { openSubMenus } from '../helpers.js';

function createComponent(textContent, { className }) {
  const component = document.createElement('div');
  component.textContent = textContent;
  component.setAttribute('class', className);
  return component;
}

describe('context-menu', () => {
  let menu;

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
  });

  it('items', async () => {
    menu.items = ITEMS;

    contextmenu(menu);
    await nextUpdate(menu);
    await nextRender();

    await expect(menu).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('items nested', async () => {
    menu.items = ITEMS;

    contextmenu(menu);
    await openSubMenus(menu);
    await nextRender();

    const subMenu = menu.querySelector('vaadin-context-menu');
    await expect(subMenu).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });

  it('overlay', async () => {
    await expect(menu._overlayElement).dom.to.equalSnapshot(SNAPSHOT_CONFIG);
  });
});
