import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, getSubMenu, openMenu } from './helpers.js';

describe('items theme', () => {
  let rootMenu, subMenu, subMenu2, target;

  async function updateItemsAndReopen() {
    rootMenu.items = [...rootMenu.items];
    rootMenu.close();
    await openMenu(target);
  }

  beforeEach(async () => {
    rootMenu = fixtureSync(`
      <vaadin-context-menu theme="foo">
        <button id="target"></button>
      </vaadin-context-menu>
    `);
    rootMenu.openOn = isTouch ? 'click' : 'mouseover';
    target = rootMenu.firstElementChild;

    const itemWithTheme = document.createElement('span');
    itemWithTheme.textContent = 'Item with theme';
    itemWithTheme.setAttribute('theme', 'bar');

    rootMenu.items = [
      {
        text: 'foo-0',
        children: [
          { text: 'foo-0-0' },
          {
            text: 'foo-0-1',
            children: [{ text: 'foo-0-1-0' }],
          },
          { component: itemWithTheme },
        ],
      },
      { text: 'foo-1' },
    ];
    await openMenu(target);
    await openMenu(getMenuItems(rootMenu)[0]);
    subMenu = getSubMenu(rootMenu);
    await openMenu(getMenuItems(subMenu)[1]);
    subMenu2 = getSubMenu(rootMenu);
  });

  afterEach(() => {
    rootMenu.close();
  });

  it('should propagate host theme attribute to the nested elements', () => {
    [rootMenu, subMenu, subMenu2].forEach((subMenu) => {
      const overlay = subMenu.$.overlay;
      const listBox = overlay.querySelector('vaadin-context-menu-list-box');
      const items = Array.from(listBox.querySelectorAll('vaadin-context-menu-item'));

      expect(overlay.getAttribute('theme')).to.equal('foo');
      expect(listBox.getAttribute('theme')).to.equal('foo');

      const itemsThemeEqualsFoo = items.filter((item) => item.getAttribute('theme') !== 'foo').length === 0;
      expect(itemsThemeEqualsFoo).to.be.true;
    });
  });

  it('should close the menu and submenu on theme changed', () => {
    rootMenu.setAttribute('theme', 'bar');
    expect(rootMenu.opened).to.be.false;
    expect(subMenu.opened).to.be.false;
    expect(subMenu2.opened).to.be.false;
  });

  it('should remove theme attribute from the nested elements', async () => {
    rootMenu.removeAttribute('theme');

    // Should wait until submenus will be opened again.
    await nextFrame();
    await openMenu(getMenuItems(rootMenu)[0]);
    await openMenu(getMenuItems(subMenu)[1]);

    [rootMenu, subMenu, subMenu2].forEach((subMenu) => {
      const overlay = subMenu.$.overlay;
      const listBox = overlay.querySelector('vaadin-context-menu-list-box');
      const items = Array.from(listBox.querySelectorAll('vaadin-context-menu-item'));

      expect(overlay.hasAttribute('theme')).to.be.false;
      expect(listBox.hasAttribute('theme')).to.be.false;

      const itemsDoNotHaveTheme = items.filter((item) => item.hasAttribute('theme')).length === 0;
      expect(itemsDoNotHaveTheme).to.be.true;
    });
  });

  it('should override the host theme with the item theme', async () => {
    rootMenu.items[1].theme = 'bar-1';
    rootMenu.items[0].children[0].theme = 'bar-0-0';
    await updateItemsAndReopen();

    await openMenu(getMenuItems(rootMenu)[0]);
    subMenu = getSubMenu(rootMenu);

    const rootItems = getMenuItems(rootMenu);
    const subItems = getMenuItems(subMenu);

    expect(rootItems[0].getAttribute('theme')).to.equal('foo');
    expect(rootItems[1].getAttribute('theme')).to.equal('bar-1');

    expect(subItems[0].getAttribute('theme')).to.equal('bar-0-0');
    expect(subItems[1].getAttribute('theme')).to.equal('foo');
  });

  it('should use the host theme if the item theme is removed', async () => {
    rootMenu.items[1].theme = 'bar-1';
    await updateItemsAndReopen();

    let rootItems = getMenuItems(rootMenu);
    expect(rootItems[1].getAttribute('theme')).to.equal('bar-1');

    // An empty array should also override the component theme
    rootMenu.items[1].theme = [];
    await updateItemsAndReopen();

    rootItems = getMenuItems(rootMenu);
    expect(rootItems[1].hasAttribute('theme')).to.be.false;

    // An empty string should also override the component theme
    rootMenu.items[1].theme = '';
    await updateItemsAndReopen();

    rootItems = getMenuItems(rootMenu);
    expect(rootItems[1].hasAttribute('theme')).to.be.false;

    // If null or undefined, the parent component theme should be used
    delete rootMenu.items[1].theme;
    await updateItemsAndReopen();

    rootItems = getMenuItems(rootMenu);
    expect(rootItems[1].getAttribute('theme')).to.equal('foo');
  });

  it('should support multiple item themes in an array', async () => {
    rootMenu.items[1].theme = ['bar-1', 'bar-2', 'bar-3'];
    await updateItemsAndReopen();

    const rootItems = getMenuItems(rootMenu);
    expect(rootItems[1].getAttribute('theme')).to.equal('bar-1 bar-2 bar-3');
  });

  it('should not remove theme provided on the item component', () => {
    const item = getMenuItems(subMenu2)[2];
    expect(item.getAttribute('theme')).to.equal('bar');
  });

  it('should override component theme with the item theme', async () => {
    subMenu.items[2].theme = 'bar-1';
    subMenu.close();
    subMenu.items = [...subMenu.items];

    await openMenu(getMenuItems(rootMenu)[0]);

    const item = getMenuItems(subMenu2)[2];

    expect(item.getAttribute('theme')).to.equal('bar-1');
  });
});
