import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fire, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.css';
import type { DropdownMenu, DropdownMenuItem } from '../vaadin-dropdown-menu.js';
import { getButton, getMenuItems, getOverlay, getSubMenu, openMenu, openSubMenu } from './helpers.js';

describe('vaadin-dropdown-menu - items', () => {
  let menu: DropdownMenu;
  let items: DropdownMenuItem[];

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>');
    items = [
      { text: 'Item 1' },
      {
        text: 'Item 2',
        children: [{ text: 'Item 2-1' }, { text: 'Item 2-2', children: [{ text: 'Item 2-2-1' }] }],
      },
      { text: 'Item 3', theme: 'custom' },
    ];
    menu.items = items;
    await nextRender();
  });

  afterEach(() => {
    menu.close();
  });

  it('should render items as context-menu items in a context-menu list-box', async () => {
    await openMenu(menu);
    const listBox = menu.querySelector(':scope > [slot="overlay"] > vaadin-context-menu-list-box');
    expect(listBox).to.be.ok;
    expect(getMenuItems(menu).map((item) => item.localName)).to.eql(Array(3).fill('vaadin-context-menu-item'));
    expect(getMenuItems(menu).map((item) => item.textContent)).to.eql(['Item 1', 'Item 2', 'Item 3']);
  });

  describe('selection', () => {
    let spy: sinon.SinonSpy;

    beforeEach(async () => {
      spy = sinon.spy();
      menu.addEventListener('item-selected', spy);
      await openMenu(menu);
      await nextRender();
    });

    it('should fire item-selected with the item and close on leaf item click', () => {
      getMenuItems(menu)[0].click();
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(items[0]);
      expect(menu.opened).to.be.false;
    });

    it('should fire item-selected once on the host on nested item click', async () => {
      const subMenu = await openSubMenu(menu, 1);
      getMenuItems(subMenu)[0].click();
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(items[1].children![0]);
      expect(menu.opened).to.be.false;
    });
  });

  describe('nested menus', () => {
    beforeEach(async () => {
      await openMenu(menu);
      await nextRender();
    });

    it('should open a dropdown-menu-submenu on hover', async () => {
      const subMenu = await openSubMenu(menu, 1);
      expect(subMenu.localName).to.equal('vaadin-dropdown-menu-submenu');
      expect((subMenu as any).opened).to.be.true;
    });

    it('should open a dropdown-menu-submenu on ArrowRight', async () => {
      getMenuItems(menu)[1].focus();
      const subMenu = getSubMenu(menu);
      const opened = oneEvent(getOverlay(subMenu), 'vaadin-overlay-open');
      await sendKeys({ press: 'ArrowRight' });
      await opened;
      expect(subMenu.localName).to.equal('vaadin-dropdown-menu-submenu');
      expect((subMenu as any).opened).to.be.true;
    });

    it('should use dropdown-menu-submenu for the second nesting level', async () => {
      const subMenu = await openSubMenu(menu, 1);
      await nextRender();
      const nestedSubMenu = await openSubMenu(subMenu, 1);
      expect(nestedSubMenu.localName).to.equal('vaadin-dropdown-menu-submenu');
    });

    it('should keep all menus open on contextmenu event', async () => {
      const subMenu = await openSubMenu(menu, 1);
      fire(getMenuItems(subMenu)[0], 'contextmenu');
      await nextRender();
      expect(menu.opened).to.be.true;
      expect((subMenu as any).opened).to.be.true;
    });
  });

  describe('theme', () => {
    beforeEach(async () => {
      menu.setAttribute('theme', 'primary');
      await openMenu(menu);
      await nextRender();
    });

    it('should apply the host theme to the button only', async () => {
      const subMenu = await openSubMenu(menu, 1);
      const listBox = menu.querySelector(':scope > [slot="overlay"] > vaadin-context-menu-list-box')!;
      expect(getButton(menu).getAttribute('theme')).to.equal('primary');
      expect(getOverlay(menu).hasAttribute('theme')).to.be.false;
      expect(listBox.hasAttribute('theme')).to.be.false;
      expect(getMenuItems(menu)[0].hasAttribute('theme')).to.be.false;
      expect(subMenu.hasAttribute('theme')).to.be.false;
      expect(getMenuItems(subMenu)[0].hasAttribute('theme')).to.be.false;
    });

    it('should update the button theme when the host theme changes', () => {
      menu.setAttribute('theme', 'tertiary');
      expect(getButton(menu).getAttribute('theme')).to.equal('tertiary');
    });

    it('should remove the button theme when the host theme is removed', () => {
      menu.removeAttribute('theme');
      expect(getButton(menu).hasAttribute('theme')).to.be.false;
    });

    it('should apply the item theme to the item', () => {
      expect(getMenuItems(menu)[2].getAttribute('theme')).to.equal('custom');
    });
  });
});
