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
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, getSubMenu, openMenu } from './helpers.js';

describe('items', () => {
  let rootMenu, subMenu, target, rootOverlay, subOverlay1;

  const createComponent = (text) => {
    const item = document.createElement('vaadin-context-menu-item');
    item.textContent = text;
    return item;
  };

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
          { text: 'foo-0-2', children: [{ text: 'foo-0-2-0' }] },
          { component: 'hr' },
          { text: 'foo-0-3', keepOpen: true },
        ],
      },
      { text: 'foo-1' },
      { text: 'foo-2', keepOpen: true },
      {
        text: 'foo-3',
        children: [
          { component: createComponent('foo-3-0') },
          { component: createComponent('foo-3-1') },
          { component: createComponent('foo-3-2') },
        ],
      },
    ];
    await nextRender();
    await openMenu(target);
    rootOverlay = rootMenu._overlayElement;
    await openMenu(getMenuItems(rootMenu)[0]);
    subMenu = getSubMenu(rootMenu);
    subOverlay1 = subMenu._overlayElement;
  });

  afterEach(() => {
    rootMenu.close();

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

  (isTouch ? it.skip : it)('should open the subMenu on the left side', async () => {
    subMenu.close();
    let rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
    rootOverlay.style.left = `${window.innerWidth - rootItemRect.width * 1.5}px`;
    await openMenu(getMenuItems(rootMenu)[0]);
    rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
    const subItemRect = getMenuItems(subMenu)[0].getBoundingClientRect();
    expect(subItemRect.right).to.be.below(rootItemRect.left);
  });

  (isTouch ? it.skip : it)('should open the subMenu on the top if root menu is bottom-aligned', async () => {
    subMenu.close();
    rootOverlay.style.removeProperty('top');
    rootOverlay.style.bottom = '0px';
    rootOverlay.setAttribute('bottom-aligned', '');
    await openMenu(getMenuItems(rootMenu)[0]);
    const rootMenuRect = rootOverlay.getBoundingClientRect();
    const subMenuRect = subOverlay1.getBoundingClientRect();
    expect(subMenuRect.bottom).to.be.below(rootMenuRect.bottom);
  });

  (isTouch ? it.skip : it)('should open the subMenu on the left if root menu is end-aligned', async () => {
    subMenu.close();
    await nextRender(subMenu);
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
    let padding;
    subMenu.close();
    await nextRender(subMenu);
    rootMenu.items[0].children[2].text = 'foo-0-2-longer';

    const rootItem = getMenuItems(rootMenu)[0];
    const rootItemRect = rootItem.getBoundingClientRect();
    rootOverlay.style.removeProperty('left');
    rootOverlay.style.right = `${rootItemRect.width}px`;
    rootOverlay.setAttribute('end-aligned', '');
    padding = parseFloat(getComputedStyle(rootOverlay.$.content).paddingLeft) * 2;

    /* First sub-menu end-aligned */
    await openMenu(rootItem);
    expect(subOverlay1.hasAttribute('end-aligned')).to.be.true;
    const rootMenuRect = rootOverlay.$.content.getBoundingClientRect();
    const subMenuRect = subOverlay1.$.content.getBoundingClientRect();
    expect(subMenuRect.right).to.be.closeTo(rootMenuRect.left, 1);

    /* Second sub-menu left-aligned */
    const nestedItem = getMenuItems(subMenu)[2];
    const nestedItemRect = nestedItem.getBoundingClientRect();
    padding = parseFloat(getComputedStyle(subOverlay1.$.content).paddingLeft) * 2;
    await openMenu(nestedItem);
    const subMenu2 = getSubMenu(subMenu);
    expect(subMenu2._overlayElement.hasAttribute('end-aligned')).to.be.false;
    const subMenu2Rect = subMenu2._overlayElement.$.content.getBoundingClientRect();
    expect(subMenu2Rect.left).to.be.closeTo(nestedItemRect.right + padding / 2, 1);
  });

  it('should clean up the old content on reopen', async () => {
    rootMenu.close();
    await openMenu(target);
    expect(getMenuItems(rootMenu).length).to.equal(rootMenu.items.length);
  });

  it('should clear selections on reopen', async () => {
    getMenuItems(subMenu)[0].click();
    await openMenu(getMenuItems(rootMenu)[0]);
    expect(getMenuItems(subMenu)[0].selected).to.be.false;
  });

  it('should have default item type', () => {
    expect(getMenuItems(rootMenu)[0].localName).to.equal('vaadin-context-menu-item');
  });

  it('should accept component items', async () => {
    rootMenu.close();
    const component = document.createElement('button');
    rootMenu.items = [{ component }];
    await openMenu(target);
    expect(getMenuItems(rootMenu)[0]).to.equal(component);
  });

  it('should accept custom tags', async () => {
    rootMenu.close();
    rootMenu.items = [{ component: 'button' }];
    await openMenu(target);
    expect(getMenuItems(rootMenu)[0].localName).to.equal('button');
  });

  it('should have a checked item', () => {
    expect(getMenuItems(subMenu)[0].hasAttribute('menu-item-checked')).to.be.true;
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

  it('should not have a checked item', async () => {
    rootMenu.items[0].children[0].checked = false;
    subMenu.close();
    await openMenu(getMenuItems(rootMenu)[0]);
    expect(getMenuItems(subMenu)[0].hasAttribute('menu-item-checked')).to.be.false;
  });

  it('should have a disabled item', () => {
    expect(getMenuItems(subMenu)[1].disabled).to.be.true;
  });

  it('should close the submenu', async () => {
    await openMenu(getMenuItems(rootMenu)[1]);
    expect(subMenu.opened).to.be.false;
  });

  (isTouch ? it.skip : it)('should focus closed parent item when hovering on non-parent item', async () => {
    const parent = getMenuItems(rootMenu)[0];
    const nonParent = getMenuItems(rootMenu)[1];
    const focusSpy = sinon.spy(parent, 'focus');
    await openMenu(nonParent);
    expect(focusSpy.called).to.be.true;
  });

  (isTouch ? it.skip : it)('should focus overlay part on closing sub-menu without focused item', async () => {
    const parent = getMenuItems(rootMenu)[3];
    await openMenu(parent);
    const nonParent = getMenuItems(rootMenu)[1];
    const focusSpy = sinon.spy(rootOverlay.$.overlay, 'focus');
    await openMenu(nonParent);
    expect(focusSpy.called).to.be.true;
  });

  (isTouch ? it.skip : it)('should not focus overlay part if the parent menu list-box has focus', async () => {
    await openMenu(getMenuItems(rootMenu)[1]);
    const focusSpy = sinon.spy(rootOverlay.$.overlay, 'focus');
    await openMenu(getMenuItems(rootMenu)[2]);
    expect(focusSpy.called).to.be.false;
  });

  it('should not close the menu if root item has keep open', () => {
    getMenuItems(rootMenu)[2].click();
    expect(rootMenu.opened).to.be.true;
  });

  it('should not close the menu if sub menu item has keep open', () => {
    getMenuItems(subMenu)[3].click();
    expect(rootMenu.opened).to.be.true;
    expect(subMenu.opened).to.be.true;
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

  it('should close top-most menu on esc', () => {
    escKeyDown(getMenuItems(subMenu)[0]);
    expect(subMenu.opened).to.be.false;
    expect(rootMenu.opened).to.be.true;
    expect(getMenuItems(rootMenu)[0].hasAttribute('focused')).to.be.true;
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
    subOverlay1.$.backdrop.click();
    expect(subMenu.opened).to.be.false;
  });

  it('should have be a parent item', () => {
    expect(getMenuItems(rootMenu)[0].getAttribute('aria-haspopup')).to.equal('true');
  });

  it('should not have be a parent item', async () => {
    const button = document.createElement('button');
    rootMenu.close();
    rootMenu.items[0].component = button;
    await openMenu(target);
    rootMenu.close();
    rootMenu.items[0].children = [];
    await openMenu(target);
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
    rootOverlay.focus();
    await openMenu(getMenuItems(rootMenu)[0]);
    expect(subMenu.opened).to.be.true;
    await nextRender(subMenu);
    expect(getMenuItems(subMenu)[0].hasAttribute('focused')).to.be.false;
  });

  it('should focus first item in submenu on overlay element arrow down', async () => {
    subMenu.close();
    rootOverlay.focus();
    await openMenu(getMenuItems(rootMenu)[0]);
    const item = getMenuItems(subMenu)[0];
    const spy = sinon.spy(item, 'focus');
    arrowDownKeyDown(subOverlay1.$.overlay);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus last item in submenu on overlay element arrow up', async () => {
    subMenu.close();
    rootOverlay.focus();
    await openMenu(getMenuItems(rootMenu)[0]);
    const items = getMenuItems(subMenu);
    const item = items[items.length - 1];
    const spy = sinon.spy(item, 'focus');
    arrowUpKeyDown(subOverlay1.$.overlay);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus first item after re-opening when using components', async () => {
    subMenu.close();
    rootOverlay.focus();

    const rootItem = getMenuItems(rootMenu)[3];

    // Open the sub-menu with item components
    await openMenu(rootItem);
    const subMenu2 = getSubMenu(rootMenu);
    const items = getMenuItems(subMenu2);

    // Arrow Down to focus next item
    items[0].focus();
    arrowDownKeyDown(items[0]);
    expect(items[1].hasAttribute('focus-ring')).to.be.true;

    // Arrow Left to close the sub-menu
    arrowLeftKeyDown(items[1]);
    await nextFrame();
    expect(rootItem.hasAttribute('focus-ring')).to.be.true;

    // Re-open sub-menu and check focus
    await openMenu(rootItem);
    expect(items[0].hasAttribute('focus-ring')).to.be.true;
  });

  it('should focus first non-disabled item after re-opening when using components', async () => {
    subMenu.close();
    rootOverlay.focus();

    rootMenu.items[3].children[0].disabled = true;

    const rootItem = getMenuItems(rootMenu)[3];

    // Open the sub-menu with item components
    await openMenu(rootItem);
    const subMenu2 = getSubMenu(rootMenu);
    const items = getMenuItems(subMenu2);

    // Arrow Down to focus next item
    items[1].focus();
    arrowDownKeyDown(items[1]);
    expect(items[2].hasAttribute('focus-ring')).to.be.true;

    // Arrow Left to close the sub-menu
    arrowLeftKeyDown(items[2]);
    await nextFrame();
    expect(rootItem.hasAttribute('focus-ring')).to.be.true;

    // Re-open sub-menu and check focus
    await openMenu(rootItem);
    expect(items[1].hasAttribute('focus-ring')).to.be.true;
  });

  it('should have modeless sub menus', () => {
    const rootItemRect = getMenuItems(rootMenu)[0].getBoundingClientRect();
    const element = document.elementFromPoint(rootItemRect.left, rootItemRect.top);
    expect(element).not.to.equal(document.documentElement);
  });

  it('should close submenus', async () => {
    rootMenu.close();
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  it('should fire an event for item selection', async () => {
    const eventSpy = sinon.spy();
    rootMenu.addEventListener('item-selected', eventSpy);
    getMenuItems(subMenu)[0].click();
    await nextRender();
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
    const spy = sinon.spy(rootOverlay, 'requestContentUpdate');
    rootMenu.requestContentUpdate();
    expect(spy.called).to.be.false;
  });

  it('should not remove the component attributes', async () => {
    rootMenu.close();
    const button = document.createElement('button');
    button.setAttribute('disabled', '');
    button.setAttribute('menu-item-checked', '');
    rootMenu.items[0].component = button;
    await openMenu(target);
    expect(button.hasAttribute('disabled')).to.be.true;
    expect(button.hasAttribute('menu-item-checked')).to.be.true;
  });

  it('should propagate closeOn', async () => {
    rootMenu.close();
    rootMenu.closeOn = 'keydown';
    await openMenu(target);
    await openMenu(getMenuItems(rootMenu)[0]);
    fire(getMenuItems(subMenu)[0], 'keydown', {}, { keyCode: 65, key: 'a' });
    expect(subMenu.opened).to.be.false;
  });

  it('should have expanded attributes', async () => {
    expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.true;
    expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('true');
    subMenu.close();
    await nextRender();
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

      rootOverlay = rootMenu._overlayElement;
      subOverlay1 = subMenu._overlayElement;

      await openMenu(getMenuItems(subMenu)[2]);
      const subMenu2 = getSubMenu(subMenu);
      subOverlay2 = subMenu2._overlayElement;
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
