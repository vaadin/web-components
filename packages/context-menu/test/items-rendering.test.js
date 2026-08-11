import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, openMenu, openSubMenu } from './helpers.js';

describe('items rendering', () => {
  let rootMenu, subMenu, target;

  beforeEach(async () => {
    rootMenu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
      </vaadin-context-menu>
    `);
    rootMenu.openOn = isTouch ? 'click' : 'mouseover';
    target = rootMenu.firstElementChild;
    rootMenu.items = [
      {
        text: 'foo-0',
        children: [
          { text: 'foo-0-0', checked: true },
          { text: 'foo-0-1', disabled: true },
        ],
      },
      { text: 'foo-1' },
    ];
    await nextRender();
  });

  afterEach(() => {
    rootMenu.close();
  });

  async function openRoot() {
    await openMenu(target);
  }

  describe('item content', () => {
    beforeEach(async () => {
      await openRoot();
      subMenu = await openSubMenu(rootMenu);
    });

    it('should render root level items', () => {
      expect(getMenuItems(rootMenu)[0].textContent).to.equal('foo-0');
    });

    it('should render sub-menu items', () => {
      expect(getMenuItems(subMenu)[0].textContent).to.equal('foo-0-0');
    });
  });

  describe('item elements', () => {
    it('should have default item type', async () => {
      await openRoot();
      expect(getMenuItems(rootMenu)[0].localName).to.equal('vaadin-context-menu-item');
    });

    it('should accept component items', async () => {
      const component = document.createElement('button');
      rootMenu.items = [{ component }];
      await openRoot();
      expect(getMenuItems(rootMenu)[0]).to.equal(component);
    });

    it('should accept custom tags', async () => {
      rootMenu.items = [{ component: 'button' }];
      await openRoot();
      expect(getMenuItems(rootMenu)[0].localName).to.equal('button');
    });

    it('should not remove the component attributes', async () => {
      const button = document.createElement('button');
      button.setAttribute('disabled', '');
      button.setAttribute('menu-item-checked', '');
      rootMenu.items[0].component = button;
      await openRoot();
      expect(button.hasAttribute('disabled')).to.be.true;
      expect(button.hasAttribute('menu-item-checked')).to.be.true;
    });
  });

  describe('item state attributes', () => {
    it('should have menuitem role attribute', async () => {
      await openRoot();
      expect(getMenuItems(rootMenu)[0].getAttribute('role')).to.equal('menuitem');
    });

    it('should set aria-haspopup on an item with children', async () => {
      await openRoot();
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should unset aria-haspopup on an item without children', async () => {
      const button = document.createElement('button');
      rootMenu.items[0].component = button;
      await openRoot();
      rootMenu.close();
      rootMenu.items[0].children = [];
      await openRoot();
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-haspopup')).to.equal('false');
    });

    it('should have a checked item', async () => {
      await openRoot();
      subMenu = await openSubMenu(rootMenu);
      expect(getMenuItems(subMenu)[0].hasAttribute('menu-item-checked')).to.be.true;
    });

    it('should not have a checked item', async () => {
      rootMenu.items[0].children[0].checked = false;
      await openRoot();
      subMenu = await openSubMenu(rootMenu);
      expect(getMenuItems(subMenu)[0].hasAttribute('menu-item-checked')).to.be.false;
    });

    it('should have a disabled item', async () => {
      await openRoot();
      subMenu = await openSubMenu(rootMenu);
      expect(getMenuItems(subMenu)[1].disabled).to.be.true;
    });
  });
});

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
    await nextRender();
    await openMenu(target);
    subMenu = await openSubMenu(rootMenu);
    subMenu2 = await openSubMenu(subMenu, 1);
  });

  afterEach(() => {
    rootMenu.close();
  });

  it('should propagate host theme attribute to the nested elements', () => {
    [rootMenu, subMenu, subMenu2].forEach((subMenu) => {
      const overlay = subMenu._overlayElement;
      const listBox = overlay._contentRoot.querySelector('vaadin-context-menu-list-box');
      const items = Array.from(listBox.querySelectorAll('vaadin-context-menu-item'));

      expect(overlay.getAttribute('theme')).to.equal('foo');
      expect(listBox.getAttribute('theme')).to.equal('foo');

      const itemsThemeEqualsFoo = items.filter((item) => item.getAttribute('theme') !== 'foo').length === 0;
      expect(itemsThemeEqualsFoo).to.be.true;
    });
  });

  it('should close the menu and submenu on theme changed', async () => {
    rootMenu.setAttribute('theme', 'bar');
    await nextRender();
    expect(rootMenu.opened).to.be.false;
    expect(subMenu.opened).to.be.false;
    expect(subMenu2.opened).to.be.false;
  });

  it('should remove theme attribute from the nested elements', async () => {
    rootMenu.removeAttribute('theme');

    // Should wait until submenus will be opened again.
    await nextRender();
    await openMenu(target);
    await openSubMenu(rootMenu);
    await openSubMenu(subMenu, 1);

    [rootMenu, subMenu, subMenu2].forEach((subMenu) => {
      const overlay = subMenu._overlayElement;
      const listBox = overlay._contentRoot.querySelector('vaadin-context-menu-list-box');
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

    subMenu = await openSubMenu(rootMenu);

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
    const item = getMenuItems(subMenu)[2];
    expect(item.getAttribute('theme')).to.equal('bar');
  });

  it('should override component theme with the item theme', async () => {
    subMenu.items[2].theme = 'bar-1';
    subMenu.close();
    subMenu.items = [...subMenu.items];

    await openSubMenu(rootMenu);

    const item = getMenuItems(subMenu)[2];

    expect(item.getAttribute('theme')).to.equal('bar-1');
  });
});
