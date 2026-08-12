import { expect } from '@vaadin/chai-plugins';
import {
  aTimeout,
  enterKeyDown,
  fire,
  fixtureSync,
  nextFrame,
  nextRender,
  outsideClick,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, getSubMenu, openMenu, openSubMenu } from './helpers.js';

describe('items', () => {
  let rootMenu, subMenu, target, rootOverlay, subOverlay1;

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
          { text: 'foo-0-0' },
          { text: 'foo-0-1' },
          { text: 'foo-0-2', children: [{ text: 'foo-0-2-0', keepOpen: true }] },
          { component: 'hr' },
          { text: 'foo-0-3', keepOpen: true },
        ],
      },
      { text: 'foo-1' },
      { text: 'foo-2', keepOpen: true },
      {
        text: 'foo-3',
        children: [{ text: 'foo-3-0' }, { text: 'foo-3-1' }, { text: 'foo-3-2' }],
      },
    ];
    await nextRender();
  });

  afterEach(() => {
    rootMenu.close();
  });

  async function openRoot() {
    await openMenu(target);
    rootOverlay = rootMenu._overlayElement;
    subMenu = getSubMenu(rootMenu);
    subOverlay1 = subMenu._overlayElement;
  }

  describe('reopening', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should clean up the old content on reopen', async () => {
      rootMenu.close();
      await openMenu(target);
      expect(getMenuItems(rootMenu).length).to.equal(rootMenu.items.length);
    });

    it('should clear selections on reopen', async () => {
      getMenuItems(subMenu)[0].click();
      await openMenu(target);
      await openSubMenu(rootMenu);
      expect(getMenuItems(subMenu)[0].selected).to.be.false;
    });
  });

  describe('keepOpen', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should have a checked root item after click if keep open', async () => {
      rootMenu.items[2].checked = true;
      getMenuItems(rootMenu)[2].click();
      await nextRender();
      expect(getMenuItems(rootMenu)[2].hasAttribute('menu-item-checked')).to.be.true;
    });

    it('should have a focused root item after click if keep open', async () => {
      rootMenu.items[2].checked = true;
      getMenuItems(rootMenu)[2].click();
      await nextRender();
      expect(getMenuItems(rootMenu)[2].hasAttribute('focused')).to.be.true;
    });

    it('should have a checked sub menu item after click if keep open', async () => {
      subMenu.items[4].checked = true;
      getMenuItems(subMenu)[4].click();
      await nextRender();
      expect(getMenuItems(subMenu)[4].hasAttribute('menu-item-checked')).to.be.true;
    });

    it('should have a focused sub menu item after click if keep open', async () => {
      subMenu.items[4].checked = true;
      getMenuItems(subMenu)[4].click();
      await nextRender();
      expect(getMenuItems(subMenu)[4].hasAttribute('focused')).to.be.true;
    });

    it('should not close the menu if root item has keep open', () => {
      getMenuItems(rootMenu)[2].click();
      expect(rootMenu.opened).to.be.true;
    });

    it('should not close the menu if sub menu item has keep open', () => {
      getMenuItems(subMenu)[4].click();
      expect(rootMenu.opened).to.be.true;
      expect(subMenu.opened).to.be.true;
    });
  });

  describe('sub-menu positioning', () => {
    beforeEach(async () => {
      await openRoot();
    });

    (isTouch ? it.skip : it)('should open the subMenu on the right side', async () => {
      await openSubMenu(rootMenu);
      const rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      const subItemRect = getMenuItems(subMenu)[0].getBoundingClientRect();
      expect(subItemRect.left).to.be.at.least(rootItemRect.right);
    });

    (isTouch ? it.skip : it)('should open the subMenu on the left side', async () => {
      let rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      rootOverlay.style.left = `${window.innerWidth - rootItemRect.width * 1.5}px`;
      await openSubMenu(rootMenu);
      rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      const subItemRect = getMenuItems(subMenu)[0].getBoundingClientRect();
      expect(subItemRect.right).to.be.at.most(rootItemRect.left);
    });

    (isTouch ? it.skip : it)('should open the subMenu on the top if root menu is bottom-aligned', async () => {
      rootOverlay.style.removeProperty('top');
      rootOverlay.style.bottom = '0px';
      rootOverlay.setAttribute('bottom-aligned', '');
      await openSubMenu(rootMenu);
      const rootMenuRect = rootOverlay.getBoundingClientRect();
      const subMenuRect = subOverlay1.getBoundingClientRect();
      expect(subMenuRect.bottom).to.be.at.most(rootMenuRect.bottom);
    });

    (isTouch ? it.skip : it)('should open the subMenu on the left if root menu is end-aligned', async () => {
      const rootItem = getMenuItems(rootMenu)[0];
      const rootItemRect = rootItem.getBoundingClientRect();
      rootOverlay.style.removeProperty('left');
      rootOverlay.style.right = `${rootItemRect.width}px`;
      rootOverlay.setAttribute('end-aligned', '');
      await openMenu(rootItem);
      expect(subOverlay1.hasAttribute('end-aligned')).to.be.true;
      const rootMenuRect = rootOverlay.$.content.getBoundingClientRect();
      const subMenuRect = subOverlay1.$.content.getBoundingClientRect();
      expect(subMenuRect.right).to.be.closeTo(rootMenuRect.left, 2);
    });

    // TODO: Previously this test was relying on iframe which had fixed size of WCT.
    // Consider changing it so that it no longer depends on the browser window size.
    it.skip('should open the second subMenu on the right again if not enough space', async () => {
      rootMenu.items[0].children[2].text = 'foo-0-2-longer';

      const rootItem = getMenuItems(rootMenu)[0];
      const rootItemRect = rootItem.getBoundingClientRect();
      rootOverlay.style.removeProperty('left');
      rootOverlay.style.right = `${rootItemRect.width}px`;
      rootOverlay.setAttribute('end-aligned', '');

      /* First sub-menu end-aligned */
      await openMenu(rootItem);
      expect(subOverlay1.hasAttribute('end-aligned')).to.be.true;
      const rootMenuRect = rootOverlay.$.content.getBoundingClientRect();
      const subMenuRect = subOverlay1.$.content.getBoundingClientRect();
      expect(subMenuRect.right).to.be.closeTo(rootMenuRect.left, 1);

      /* Second sub-menu left-aligned */
      const nestedItem = getMenuItems(subMenu)[2];
      const nestedItemRect = nestedItem.getBoundingClientRect();
      const padding = parseFloat(getComputedStyle(subOverlay1.$.content).paddingLeft) * 2;
      await openMenu(nestedItem);
      const subMenu2 = getSubMenu(subMenu);
      expect(subMenu2._overlayElement.hasAttribute('end-aligned')).to.be.false;
      const subMenu2Rect = subMenu2._overlayElement.$.content.getBoundingClientRect();
      expect(subMenu2Rect.left).to.be.closeTo(nestedItemRect.right + padding / 2, 1);
    });

    it('should have modeless sub menus', async () => {
      await openSubMenu(rootMenu);
      const rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
      const border = parseInt(getComputedStyle(rootOverlay.$.overlay).borderWidth);
      const element = document.elementFromPoint(rootItemRect.left + border, rootItemRect.top + border);
      expect(element).not.to.equal(document.documentElement);
    });
  });

  describe('item-selected event', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should fire an event for item selection', async () => {
      const eventSpy = sinon.spy();
      rootMenu.addEventListener('item-selected', eventSpy);
      getMenuItems(subMenu)[0].click();
      await nextRender();
      expect(eventSpy).to.be.calledOnce;
      expect(eventSpy.firstCall.args[0].detail.value).to.equal(rootMenu.items[0].children[0]);
    });

    it('should not fire an event for parent item selection', () => {
      const eventSpy = sinon.spy();
      rootMenu.addEventListener('item-selected', eventSpy);
      getMenuItems(rootMenu)[0].click();
      expect(eventSpy).to.not.be.called;
    });
  });

  // TODO: remove when the deprecated event is removed in Vaadin 26
  describe('items-outside-click event', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should fire on outside click when a sub-menu is open', () => {
      const spy = sinon.spy();
      rootMenu.addEventListener('items-outside-click', spy);
      outsideClick();
      expect(spy).to.be.calledOnce;
    });

    it('should fire on outside click when only the root menu is open', async () => {
      subMenu.close();
      await nextRender();
      const spy = sinon.spy();
      rootMenu.addEventListener('items-outside-click', spy);
      outsideClick();
      expect(spy).to.be.calledOnce;
    });

    it('should not fire on click inside the menu', () => {
      const spy = sinon.spy();
      rootMenu.addEventListener('items-outside-click', spy);
      getMenuItems(subMenu)[4].click();
      expect(spy).to.not.be.called;
    });
  });

  describe('lifecycle', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should not react to outside click when disconnected', async () => {
      rootMenu.remove();
      // Closing on disconnect is deferred, so that moving the menu in the DOM
      // does not close it
      await aTimeout(0);

      const spy = sinon.spy(rootMenu, 'close');
      outsideClick();
      expect(spy).to.not.be.called;
    });

    it('should close submenus', async () => {
      rootMenu.close();
      await nextRender();
      expect(subMenu.opened).to.be.false;
    });
  });

  describe('API', () => {
    it('should throw with renderer', () => {
      expect(() => {
        rootMenu.renderer = () => {};
      }).to.throw(Error);
    });

    it('should call requestContentUpdate on the overlay', async () => {
      await openRoot();
      const spy = sinon.spy(rootOverlay, 'requestContentUpdate');
      rootMenu.requestContentUpdate();
      expect(spy).to.be.called;
    });

    it('should propagate closeOn', async () => {
      rootMenu.closeOn = 'keydown';
      await openRoot();
      await openSubMenu(rootMenu);
      fire(getMenuItems(subMenu)[0], 'keydown', {}, { keyCode: 65, key: 'a' });
      expect(subMenu.opened).to.be.false;
    });
  });

  (isTouch ? describe.skip : describe)('scrolling', () => {
    let subOverlay2, scrollElm, testStyle;

    beforeEach(async () => {
      testStyle = document.createElement('style');
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

      await openRoot();
      await openSubMenu(rootMenu);

      const subMenu2 = await openSubMenu(subMenu, 2);
      subOverlay2 = subMenu2._overlayElement;
      await nextFrame();
    });

    afterEach(() => {
      // The style and the scroll position are set on elements outside the
      // fixture, so they would otherwise leak into the following tests
      testStyle.remove();
      scrollElm.scrollTop = 0;
      scrollElm.scrollLeft = 0;
    });

    it('should properly move overlays on scrolling distance within y axis', async () => {
      const scrollDistance = 150;

      // Default indentation is 16
      const rootBRCTop = rootOverlay.getBoundingClientRect().top;
      const subBRCTop1 = subOverlay1.getBoundingClientRect().top;
      const subBRCTop2 = subOverlay2.getBoundingClientRect().top;

      scrollElm.scrollTop = scrollDistance;
      await nextRender();
      expect(rootOverlay.getBoundingClientRect().top).to.be.closeTo(rootBRCTop - scrollDistance, 1);
      expect(subOverlay1.getBoundingClientRect().top).to.be.closeTo(subBRCTop1 - scrollDistance, 1);
      expect(subOverlay2.getBoundingClientRect().top).to.be.closeTo(subBRCTop2 - scrollDistance, 1);
    });

    it('should properly move overlays on scrolling distance within x axis', async () => {
      const scrollDistance = 150;

      // Default indentation is 16
      const rootBRCLeft = rootOverlay.getBoundingClientRect().left;
      const subBRCLeft1 = subOverlay1.getBoundingClientRect().left;
      const subBRCLeft2 = subOverlay2.getBoundingClientRect().left;

      scrollElm.scrollLeft = scrollDistance;
      await nextRender();
      expect(rootOverlay.getBoundingClientRect().left).to.be.closeTo(rootBRCLeft - scrollDistance, 1);
      expect(subOverlay1.getBoundingClientRect().left).to.be.closeTo(subBRCLeft1 - scrollDistance, 1);
      expect(subOverlay2.getBoundingClientRect().left).to.be.closeTo(subBRCLeft2 - scrollDistance, 1);
    });
  });

  describe('updating while opened', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should update items when calling requestContentUpdate while opened', async () => {
      rootMenu.items = [{ text: 'foo-1' }, { text: 'foo-2' }];
      rootMenu.requestContentUpdate();
      await nextRender();
      const items = getMenuItems(rootMenu);
      expect(items.length).to.equal(2);
      expect(items[0].textContent).to.equal('foo-1');
      expect(items[1].textContent).to.equal('foo-2');
    });

    it('should keep submenu opened and update its items after calling requestContentUpdate while opened', async () => {
      rootMenu.items = [
        {
          text: 'foo-1',
          children: [{ text: 'foo-1-1' }, { text: 'foo-1-2' }],
        },
        { text: 'foo-2' },
      ];
      rootMenu.requestContentUpdate();
      await nextRender();
      expect(subMenu.opened).to.be.true;
      const items = getMenuItems(subMenu);
      expect(items[0].textContent).to.equal('foo-1-1');
      expect(items[1].textContent).to.equal('foo-1-2');
    });

    it('should close submenu and focus parent item after calling requestContentUpdate while opened', async () => {
      rootMenu.items = [{ text: 'foo-1' }, { text: 'foo-2' }];
      rootMenu.requestContentUpdate();
      await nextRender();
      expect(subMenu.opened).to.be.false;
      expect(getMenuItems(rootMenu)[0].hasAttribute('focused')).to.be.true;
    });

    it('should close submenu from item-selected event and focus parent item after calling requestContentUpdate while opened', async () => {
      // Open nested sub-menu
      const subMenu2 = await openSubMenu(subMenu, 2);

      rootMenu.addEventListener('item-selected', () => {
        rootMenu.items = [
          {
            text: 'foo-0',
            children: [
              { text: 'foo-0-0', checked: true },
              { text: 'foo-0-1', disabled: true },
              { text: 'foo-0-2', children: [] },
            ],
          },
        ];
        rootMenu.requestContentUpdate();
      });

      const item = getMenuItems(subMenu2)[0];
      item.focus();
      enterKeyDown(item);

      await nextRender();
      expect(subMenu2.opened).to.be.false;
      expect(subMenu.opened).to.be.true;
      expect(getMenuItems(subMenu)[2].hasAttribute('focused')).to.be.true;
    });

    it('should close submenu and focus first available item after calling requestContentUpdate while opened', async () => {
      subMenu.close();
      await nextRender();

      // Open sub-menu for a last item
      const parent = getMenuItems(rootMenu)[3];
      await openMenu(parent);

      rootMenu.items = [{ text: 'foo-1' }, { text: 'foo-2' }];
      rootMenu.requestContentUpdate();
      await nextRender();

      expect(subMenu.opened).to.be.false;
      expect(getMenuItems(rootMenu)[0].hasAttribute('focused')).to.be.true;
    });

    it('should focus previously focused item after calling requestContentUpdate while opened', async () => {
      subMenu.close();
      await nextRender();

      // Focus an item without a submenu
      getMenuItems(rootMenu)[1].focus();

      rootMenu.items = [{ text: 'foo-1' }, { text: 'foo-2' }];
      rootMenu.requestContentUpdate();
      await nextRender();

      expect(getMenuItems(rootMenu)[1].hasAttribute('focused')).to.be.true;
    });
  });
});
