import { expect } from '@esm-bundle/chai';
import {
  arrowDownKeyDown,
  arrowLeftKeyDown,
  arrowRightKeyDown,
  arrowUpKeyDown,
  enterKeyDown,
  escKeyDown,
  fire,
  fixtureSync,
  nextFrame,
  nextRender,
  spaceKeyDown,
  tabKeyDown,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, getSubMenu } from './helpers.js';

const menuOpenEvent = isTouch ? 'click' : 'mouseover';

describe('items', () => {
  let rootMenu, subMenu, target;

  const open = (openTarget = target) => {
    const menu = openTarget.parentElement.parentElement.__dataHost;
    if (menu) {
      menu.__openListenerActive = true;
      const overlay = menu.$.overlay;
      overlay.__openingHandler?.();
    }
    const { right, bottom } = openTarget.getBoundingClientRect();
    fire(openTarget, menuOpenEvent, { x: right, y: bottom });
  };

  const updateItemsAndReopen = async () => {
    rootMenu.items = [...rootMenu.items];
    rootMenu.close();
    open();
    await nextFrame();
  };

  afterEach(() => {
    rootMenu.close();
  });

  describe('default', () => {
    beforeEach(async () => {
      rootMenu = fixtureSync(`
        <vaadin-context-menu>
          <button id="target"></button>
        </vaadin-context-menu>
      `);
      rootMenu.openOn = menuOpenEvent;
      target = rootMenu.firstElementChild;
      rootMenu.items = [
        {
          text: 'foo-0',
          children: [
            { text: 'foo-0-0', checked: true },
            { text: 'foo-0-1', disabled: true },
            { text: 'foo-0-2', children: [{ text: 'foo-0-2-0' }] },
          ],
        },
        { text: 'foo-1' },
      ];
      open();
      await nextRender(rootMenu);
      open(getMenuItems(rootMenu)[0]);
      subMenu = getSubMenu(rootMenu);
      await nextRender(subMenu);
    });

    afterEach(() => {
      // Forcing dir to ltr because Safari scroll can get lost if attribute
      // is set to `rtl` and then removed
      document.documentElement.setAttribute('dir', 'ltr');
    });

    it('should render root level items', () => {
      expect(getMenuItems(rootMenu)[0].textContent).to.equal('foo-0');
    });

    it('should have menuitem role attribute', () => {
      expect(getMenuItems(rootMenu)[0].getAttribute('role')).to.equal('menuitem');
    });

    it('should render sub-menu items', () => {
      expect(getMenuItems(subMenu)[0].textContent).to.equal('foo-0-0');
    });

    it('should close all menus', () => {
      fire(document.documentElement, 'click');
      expect(rootMenu.opened).to.be.false;
      expect(subMenu.opened).to.be.false;
    });

    it('should remove close listener', () => {
      rootMenu.parentNode.removeChild(rootMenu);
      const spy = sinon.spy(rootMenu, 'close');
      fire(document.documentElement, 'click');
      expect(spy.called).to.be.false;
    });

    (isTouch ? it.skip : it)('should open the subMenu on the right side', () => {
      const rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      const subItemRect = getMenuItems(subMenu)[0].getBoundingClientRect();
      expect(subItemRect.left).to.be.above(rootItemRect.right);
    });

    (isTouch ? it.skip : it)('should open the subMenu on the left side', () => {
      subMenu.close();
      let rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      rootMenu.$.overlay.style.left = `${window.innerWidth - rootItemRect.width * 1.5}px`;
      open(getMenuItems(rootMenu)[0]);
      rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      const subItemRect = getMenuItems(subMenu)[0].getBoundingClientRect();
      expect(subItemRect.right).to.be.below(rootItemRect.left);
    });

    (isTouch ? it.skip : it)('should open the subMenu on the top if root menu is bottom-aligned', async () => {
      subMenu.close();
      rootMenu.$.overlay.style.removeProperty('top');
      rootMenu.$.overlay.style.bottom = '0px';
      rootMenu.$.overlay.setAttribute('bottom-aligned', '');
      open(getMenuItems(rootMenu)[0]);
      await nextRender(subMenu);
      const rootMenuRect = rootMenu.$.overlay.getBoundingClientRect();
      const subMenuRect = subMenu.$.overlay.getBoundingClientRect();
      expect(subMenuRect.bottom).to.be.below(rootMenuRect.bottom);
    });

    (isTouch ? it.skip : it)('should open the subMenu on the left if root menu is end-aligned', async () => {
      subMenu.close();
      await nextRender(subMenu);
      const rootItem = getMenuItems(rootMenu)[0];
      const rootItemRect = rootItem.getBoundingClientRect();
      const rootOverlay = rootMenu.$.overlay;
      rootOverlay.style.removeProperty('left');
      rootOverlay.style.right = `${rootItemRect.width}px`;
      rootOverlay.setAttribute('end-aligned', '');
      open(rootItem);
      await nextRender(subMenu);
      expect(subMenu.$.overlay.hasAttribute('end-aligned')).to.be.true;
      const rootMenuRect = rootOverlay.$.content.getBoundingClientRect();
      const subMenuRect = subMenu.$.overlay.$.content.getBoundingClientRect();
      expect(subMenuRect.right).to.be.closeTo(rootMenuRect.left, 2);
    });

    // TODO: Previously this test was relying on iframe which had fixed size of WCT.
    // Consider changing it so that it no longer depends on the browser window size.
    it.skip('should open the second subMenu on the right again if not enough space', async () => {
      let padding;
      subMenu.close();
      await nextRender(subMenu);
      rootMenu.items[0].children[2].text = 'foo-0-2-longer';

      const rootItem = getMenuItems(rootMenu)[0];
      const rootItemRect = rootItem.getBoundingClientRect();
      const rootOverlay = rootMenu.$.overlay;
      rootOverlay.style.removeProperty('left');
      rootOverlay.style.right = `${rootItemRect.width}px`;
      rootOverlay.setAttribute('end-aligned', '');
      padding = parseFloat(getComputedStyle(rootOverlay.$.content).paddingLeft) * 2;

      /* First sub-menu end-aligned */
      open(rootItem);
      await nextRender(subMenu);
      expect(subMenu.$.overlay.hasAttribute('end-aligned')).to.be.true;
      const rootMenuRect = rootOverlay.$.content.getBoundingClientRect();
      const subMenuRect = subMenu.$.overlay.$.content.getBoundingClientRect();
      expect(subMenuRect.right).to.be.closeTo(rootMenuRect.left, 1);

      /* Second sub-menu left-aligned */
      const nestedItem = getMenuItems(subMenu)[2];
      const nestedItemRect = nestedItem.getBoundingClientRect();
      padding = parseFloat(getComputedStyle(subMenu.$.overlay.$.content).paddingLeft) * 2;
      open(nestedItem);
      await nextRender(subMenu);
      const subMenu2 = getSubMenu(subMenu);
      expect(subMenu2.$.overlay.hasAttribute('end-aligned')).to.be.false;
      const subMenu2Rect = subMenu2.$.overlay.$.content.getBoundingClientRect();
      expect(subMenu2Rect.left).to.be.closeTo(nestedItemRect.right + padding / 2, 1);
    });

    it('should clean up the old content on reopen', () => {
      rootMenu.close();
      open();
      expect(getMenuItems(rootMenu).length).to.equal(rootMenu.items.length);
    });

    it('should clear selections on reopen', async () => {
      getMenuItems(subMenu)[0].click();
      open(getMenuItems(rootMenu)[0]);
      await nextFrame();
      expect(getMenuItems(subMenu)[0].selected).to.be.false;
    });

    it('should have default item type', () => {
      expect(getMenuItems(rootMenu)[0].localName).to.equal('vaadin-context-menu-item');
    });

    it('should accept component items', () => {
      rootMenu.close();
      const component = document.createElement('button');
      rootMenu.items = [{ component }];
      open();
      expect(getMenuItems(rootMenu)[0]).to.equal(component);
    });

    it('should accept custom tags', () => {
      rootMenu.close();
      rootMenu.items = [{ component: 'button' }];
      open();
      expect(getMenuItems(rootMenu)[0].localName).to.equal('button');
    });

    it('should have a checked item', () => {
      expect(getMenuItems(subMenu)[0].hasAttribute('menu-item-checked')).to.be.true;
    });

    it('should not have a checked item', () => {
      rootMenu.items[0].children[0].checked = false;
      subMenu.close();
      open(getMenuItems(rootMenu)[0]);
      expect(getMenuItems(subMenu)[0].hasAttribute('menu-item-checked')).to.be.false;
    });

    it('should have a disabled item', () => {
      expect(getMenuItems(subMenu)[1].disabled).to.be.true;
    });

    it('should close the submenu', () => {
      open(getMenuItems(rootMenu)[1]);
      expect(subMenu.opened).to.be.false;
    });

    (isTouch ? it.skip : it)('should focus closed parent item when hovering on non-parent item', () => {
      const parent = getMenuItems(rootMenu)[0];
      const nonParent = getMenuItems(rootMenu)[1];
      const focusSpy = sinon.spy(parent, 'focus');
      open(nonParent);
      expect(focusSpy.called).to.be.true;
    });

    it('should close the menu', () => {
      getMenuItems(rootMenu)[1].click();
      expect(rootMenu.opened).to.be.false;
      expect(subMenu.opened).to.be.false;
    });

    it('should close the submenu on left arrow', () => {
      const focusSpy = sinon.spy(getMenuItems(rootMenu)[0], 'focus');
      arrowLeftKeyDown(getMenuItems(subMenu)[0]);
      expect(subMenu.opened).to.be.false;
      expect(focusSpy.called).to.be.true;
    });

    it('should close the submenu on right arrow if RTL', async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextFrame();
      const focusSpy = sinon.spy(getMenuItems(rootMenu)[0], 'focus');
      arrowRightKeyDown(getMenuItems(subMenu)[0]);
      expect(subMenu.opened).to.be.false;
      expect(focusSpy.called).to.be.true;
      document.documentElement.setAttribute('dir', 'ltr');
    });

    it('should close all menus on esc', () => {
      escKeyDown(getMenuItems(subMenu)[0]);
      expect(rootMenu.opened).to.be.false;
    });

    it('should close all menus on Tab', () => {
      tabKeyDown(getMenuItems(subMenu)[0]);
      expect(rootMenu.opened).to.be.false;
    });

    it('should not close on disabled item click', () => {
      getMenuItems(subMenu)[1].click();
      expect(subMenu.opened).to.be.true;
    });

    it('should not close on parent item click', () => {
      getMenuItems(rootMenu)[0].click();
      expect(rootMenu.opened).to.be.true;
    });

    it('should close on backdrop click', () => {
      subMenu.$.overlay.$.backdrop.click();
      expect(subMenu.opened).to.be.false;
    });

    it('should have be a parent item', () => {
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-haspopup')).to.equal('true');
    });

    it('should not have be a parent item', () => {
      const button = document.createElement('button');
      rootMenu.close();
      rootMenu.items[0].component = button;
      open();
      rootMenu.close();
      rootMenu.items[0].children = [];
      open();
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-haspopup')).to.equal('false');
    });

    it('should open item on right arrow', () => {
      subMenu.close();
      arrowRightKeyDown(getMenuItems(rootMenu)[0]);
      expect(subMenu.opened).to.be.true;
    });

    it('should open item on left arrow if RTL', async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextFrame();
      subMenu.close();
      arrowLeftKeyDown(getMenuItems(rootMenu)[0]);
      expect(subMenu.opened).to.be.true;
      document.documentElement.setAttribute('dir', 'ltr');
    });

    it('should open item on enter', () => {
      subMenu.close();
      enterKeyDown(getMenuItems(rootMenu)[0]);
      expect(subMenu.opened).to.be.true;
    });

    it('should open item on space', () => {
      subMenu.close();
      spaceKeyDown(getMenuItems(rootMenu)[0]);
      expect(subMenu.opened).to.be.true;
    });

    it('should not focus item if parent item is not focused', async () => {
      subMenu.close();
      rootMenu.$.overlay.focus();
      open(getMenuItems(rootMenu)[0]);
      await nextRender(subMenu);
      expect(subMenu.opened).to.be.true;
      await nextRender(subMenu);
      expect(getMenuItems(subMenu)[0].hasAttribute('focused')).to.be.false;
    });

    it('should focus first item in submenu on overlay element arrow down', async () => {
      subMenu.close();
      rootMenu.$.overlay.focus();
      open(getMenuItems(rootMenu)[0]);
      await nextRender(subMenu);
      const item = getMenuItems(subMenu)[0];
      const spy = sinon.spy(item, 'focus');
      arrowDownKeyDown(subMenu.$.overlay.$.overlay);
      expect(spy.calledOnce).to.be.true;
    });

    it('should focus last item in submenu on overlay element arrow up', async () => {
      subMenu.close();
      rootMenu.$.overlay.focus();
      open(getMenuItems(rootMenu)[0]);
      await nextRender(subMenu);
      const items = getMenuItems(subMenu);
      const item = items[items.length - 1];
      const spy = sinon.spy(item, 'focus');
      arrowUpKeyDown(subMenu.$.overlay.$.overlay);
      expect(spy.calledOnce).to.be.true;
    });

    it('should have modeless sub menus', () => {
      const rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      const element = document.elementFromPoint(rootItemRect.left, rootItemRect.top);
      expect(element).not.to.equal(document.documentElement);
    });

    it('should close submenus', () => {
      rootMenu.close();
      expect(subMenu.opened).to.be.false;
    });

    it('should fire an event for item selection', () => {
      const eventSpy = sinon.spy();
      rootMenu.addEventListener('item-selected', eventSpy);
      getMenuItems(subMenu)[0].click();
      expect(eventSpy.getCall(0).args[0].detail.value).to.equal(rootMenu.items[0].children[0]);
    });

    it('should not fire an event for parent item selection', () => {
      const eventSpy = sinon.spy();
      rootMenu.addEventListener('item-selected', eventSpy);
      getMenuItems(rootMenu)[0].click();
      expect(eventSpy.called).to.be.false;
    });

    it('should throw with renderer', () => {
      expect(() => {
        rootMenu.renderer = () => {};
      }).to.throw(Error);
    });

    it('should not call requestContentUpdate', () => {
      const spy = sinon.spy(rootMenu.$.overlay, 'requestContentUpdate');
      rootMenu.requestContentUpdate();
      expect(spy.called).to.be.false;
    });

    it('should not remove the component attributes', () => {
      rootMenu.close();
      const button = document.createElement('button');
      button.setAttribute('disabled', '');
      button.setAttribute('menu-item-checked', '');
      rootMenu.items[0].component = button;
      open();
      expect(button.hasAttribute('disabled')).to.be.true;
      expect(button.hasAttribute('menu-item-checked')).to.be.true;
    });

    it('should propagate closeOn', () => {
      rootMenu.close();
      rootMenu.closeOn = 'keydown';
      open();
      open(getMenuItems(rootMenu)[0]);
      fire(getMenuItems(subMenu)[0], 'keydown', {}, { keyCode: 65, key: 'a' });
      expect(subMenu.opened).to.be.false;
    });

    it('should have expanded attributes', () => {
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.true;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('true');
      subMenu.close();
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.false;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('false');
    });

    (isTouch ? describe.skip : describe)('scrolling', () => {
      let rootOverlay, subOverlay1, subOverlay2, scrollElm;

      beforeEach(async () => {
        const testStyle = document.createElement('style');
        testStyle.innerHTML = `
          html {
            overflow:scroll;
          }

          body {
            width: 2000px;
            height: 2000px;
          }
        `;
        window.document.body.appendChild(testStyle);

        scrollElm = window.document.scrollingElement || window.document.querySelector('html');

        rootOverlay = rootMenu.$.overlay;
        subOverlay1 = subMenu.$.overlay;

        open(getMenuItems(subMenu)[2]);
        const subMenu2 = getSubMenu(subMenu);
        await nextRender(subMenu2);
        subOverlay2 = subMenu2.$.overlay;
        await nextFrame();
      });

      it('Should properly move overlays on scrolling distance within y axis', async () => {
        const scrollDistance = 150;

        // Default indentation is 16
        const rootBRCTop = rootOverlay.getBoundingClientRect().top;
        const subBRCTop1 = subOverlay1.getBoundingClientRect().top;
        const subBRCTop2 = subOverlay2.getBoundingClientRect().top;

        scrollElm.scrollTop = scrollDistance;
        await nextRender(rootMenu);
        expect(rootOverlay.getBoundingClientRect().top).to.be.closeTo(rootBRCTop - scrollDistance, 1);
        expect(subOverlay1.getBoundingClientRect().top).to.be.closeTo(subBRCTop1 - scrollDistance, 1);
        expect(subOverlay2.getBoundingClientRect().top).to.be.closeTo(subBRCTop2 - scrollDistance, 1);
      });

      it('Should properly move overlays on scrolling distance within x axis', async () => {
        const scrollDistance = 150;

        // Default indentation is 16
        const rootBRCLeft = rootOverlay.getBoundingClientRect().left;
        const subBRCLeft1 = subOverlay1.getBoundingClientRect().left;
        const subBRCLeft2 = subOverlay2.getBoundingClientRect().left;

        scrollElm.scrollLeft = scrollDistance;
        await nextRender(rootMenu);
        expect(rootOverlay.getBoundingClientRect().left).to.be.closeTo(rootBRCLeft - scrollDistance, 1);
        expect(subOverlay1.getBoundingClientRect().left).to.be.closeTo(subBRCLeft1 - scrollDistance, 1);
        expect(subOverlay2.getBoundingClientRect().left).to.be.closeTo(subBRCLeft2 - scrollDistance, 1);
      });
    });
  });

  describe('theme propagation', () => {
    let subMenu2;

    beforeEach(async () => {
      rootMenu = fixtureSync(`
        <vaadin-context-menu theme="foo">
          <button id="target"></button>
        </vaadin-context-menu>
      `);
      rootMenu.openOn = menuOpenEvent;
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
      open();
      await nextRender();
      open(getMenuItems(rootMenu)[0]);
      subMenu = getSubMenu(rootMenu);
      await nextRender();
      open(getMenuItems(subMenu)[1]);
      subMenu2 = getSubMenu(rootMenu);
      await nextRender();
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
      open(getMenuItems(rootMenu)[0]);
      await nextFrame();
      open(getMenuItems(subMenu)[1]);
      await nextFrame();

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

      open(getMenuItems(rootMenu)[0]);
      subMenu = getSubMenu(rootMenu);
      await nextFrame();

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

      open(getMenuItems(rootMenu)[0]);
      await nextRender(subMenu);

      const item = getMenuItems(subMenu2)[2];

      expect(item.getAttribute('theme')).to.equal('bar-1');
    });
  });
});
