import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { activateItem, getMenuItems, getSubMenu, openMenu, openSubMenu } from './helpers.js';

describe('items interactions', () => {
  let rootMenu, subMenu, target, rootOverlay, subOverlay1;

  const createComponent = (text) => {
    const item = document.createElement('vaadin-context-menu-item');
    item.textContent = text;
    return item;
  };

  beforeEach(async () => {
    // Firefox: when a previous test ends with focus on an overlay item
    // that then gets removed during fixture teardown, element.focus()
    // calls in the next test's overlay silently no-op (activeElement
    // stays on <body>), breaking sendKeys-based arrow navigation.
    // Adding a real focusable sibling outside the overlay helps work
    // this around
    const wrapper = fixtureSync(`
      <div>
        <input id="first-global-focusable" />
        <vaadin-context-menu>
          <button id="target"></button>
        </vaadin-context-menu>
      </div>
    `);
    rootMenu = wrapper.querySelector('vaadin-context-menu');
    rootMenu.openOn = isTouch ? 'click' : 'mouseover';
    target = rootMenu.querySelector('#target');
    rootMenu.items = [
      {
        text: 'foo-0',
        children: [{ text: 'foo-0-0' }, { text: 'foo-0-1', disabled: true }, { text: 'foo-0-2' }],
      },
      { text: 'foo-1' },
      { text: 'foo-2' },
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
  });

  afterEach(() => {
    rootMenu.close();

    // Forcing dir to ltr because Safari scroll can get lost if attribute
    // is set to `rtl` and then removed
    document.documentElement.setAttribute('dir', 'ltr');
  });

  async function openRoot() {
    await openMenu(target);
    rootOverlay = rootMenu._overlayElement;
    subMenu = getSubMenu(rootMenu);
    subOverlay1 = subMenu._overlayElement;
  }

  describe('closing on click', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    // On touch, the click opening the second menu closes the first one.
    (isTouch ? it.skip : it)('should close all menus of every open menu on outside click', async () => {
      const otherMenu = fixtureSync(`
        <vaadin-context-menu>
          <button></button>
        </vaadin-context-menu>
      `);
      otherMenu.openOn = 'mouseover';
      otherMenu.items = [{ text: 'bar-0' }];
      await nextRender();
      await openMenu(otherMenu.firstElementChild);
      expect(rootMenu.opened).to.be.true;
      expect(otherMenu.opened).to.be.true;

      outsideClick();
      expect(rootMenu.opened).to.be.false;
      expect(subMenu.opened).to.be.false;
      expect(otherMenu.opened).to.be.false;
    });

    it('should close all menus on click on the menu light DOM content', () => {
      // Unlike a real click, a synthetic one is not blocked by the modal
      // overlay, so on touch it would also open the menu again.
      rootMenu.openOn = 'mouseover';

      target.click();
      expect(rootMenu.opened).to.be.false;
      expect(subMenu.opened).to.be.false;
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
  });

  describe('hover', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should update the submenu when activating other parent item', () => {
      activateItem(getMenuItems(rootMenu)[3]);

      expect(subMenu.opened).to.be.true;

      const items = getMenuItems(subMenu);
      expect(items.length).to.equal(3);
      expect(items[0].textContent).to.equal('foo-3-0');
      expect(items[1].textContent).to.equal('foo-3-1');
      expect(items[2].textContent).to.equal('foo-3-2');
    });

    it('should not change opened state of the submenu when activating other parent item', () => {
      const openedChangeSpy = sinon.spy();
      subMenu.addEventListener('opened-changed', openedChangeSpy);

      activateItem(getMenuItems(rootMenu)[3]);

      expect(openedChangeSpy).to.not.be.called;
    });

    it('should close the submenu on activating non-parent item', () => {
      activateItem(getMenuItems(rootMenu)[1]);
      expect(subMenu.opened).to.be.false;
    });

    (isTouch ? it.skip : it)('should focus closed parent item when hovering on non-parent item', () => {
      const parent = getMenuItems(rootMenu)[0];
      const nonParent = getMenuItems(rootMenu)[1];
      const focusSpy = sinon.spy(parent, 'focus');
      activateItem(nonParent);
      expect(focusSpy).to.be.called;
    });

    (isTouch ? it.skip : it)('should focus overlay part on closing sub-menu without focused item', async () => {
      const parent = getMenuItems(rootMenu)[3];
      await openMenu(parent);
      const nonParent = getMenuItems(rootMenu)[1];
      const focusSpy = sinon.spy(rootOverlay.$.overlay, 'focus');
      activateItem(nonParent);
      expect(focusSpy).to.be.called;
    });

    (isTouch ? it.skip : it)('should not focus overlay part if the parent menu list-box has focus', () => {
      activateItem(getMenuItems(rootMenu)[1]);
      const focusSpy = sinon.spy(rootOverlay.$.overlay, 'focus');
      activateItem(getMenuItems(rootMenu)[2]);
      expect(focusSpy).to.not.be.called;
    });
  });

  describe('closing with keyboard', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should close the submenu on left arrow', async () => {
      await sendKeys({ press: 'ArrowLeft' });
      expect(subMenu.opened).to.be.false;
      expect(getDeepActiveElement()).to.equal(getMenuItems(rootMenu)[0]);
    });

    it('should close the submenu on right arrow if RTL', async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextFrame();
      await sendKeys({ press: 'ArrowRight' });
      expect(subMenu.opened).to.be.false;
      expect(getDeepActiveElement()).to.equal(getMenuItems(rootMenu)[0]);
    });

    it('should close top-most menu on esc', async () => {
      await sendKeys({ press: 'Escape' });
      expect(subMenu.opened).to.be.false;
      expect(rootMenu.opened).to.be.true;
      expect(getMenuItems(rootMenu)[0].hasAttribute('focused')).to.be.true;
    });

    it('should close all menus on Tab', async () => {
      await sendKeys({ press: 'Tab' });
      expect(rootMenu.opened).to.be.false;
    });
  });

  describe('opening sub-menu with keyboard', () => {
    beforeEach(async () => {
      await openRoot();
      // Focus the parent item explicitly, as sendKeys sends to the browser
      getMenuItems(rootMenu)[0].focus();
    });

    it('should open item on right arrow', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(subMenu.opened).to.be.true;
    });

    it('should open item on left arrow if RTL', async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextFrame();
      await sendKeys({ press: 'ArrowLeft' });
      expect(subMenu.opened).to.be.true;
    });

    it('should open item on enter', async () => {
      await sendKeys({ press: 'Enter' });
      expect(subMenu.opened).to.be.true;
    });

    it('should open item on space', async () => {
      await sendKeys({ press: 'Space' });
      expect(subMenu.opened).to.be.true;
    });
  });

  describe('focus on sub-menu open', () => {
    beforeEach(async () => {
      await openRoot();
      // Move focus from the root item to the overlay itself: a sub-menu only
      // focuses its first item when the parent item has focus.
      rootOverlay.$.overlay.focus();
    });

    it('should not focus item if parent item is not focused', async () => {
      await openSubMenu(rootMenu);
      expect(subMenu.opened).to.be.true;
      await nextRender();
      expect(getMenuItems(subMenu)[0].hasAttribute('focused')).to.be.false;
    });

    it('should focus first item in submenu on overlay element arrow down', async () => {
      await openSubMenu(rootMenu);
      await sendKeys({ press: 'ArrowDown' });
      expect(getDeepActiveElement()).to.equal(getMenuItems(subMenu)[0]);
    });

    it('should focus last item in submenu on overlay element arrow up', async () => {
      await openSubMenu(rootMenu);
      const items = getMenuItems(subMenu);
      await sendKeys({ press: 'ArrowUp' });
      expect(getDeepActiveElement()).to.equal(items[items.length - 1]);
    });

    it('should focus first item after re-opening when using components', async () => {
      const rootItem = getMenuItems(rootMenu)[3];

      // Open the sub-menu with item components
      await openMenu(rootItem);
      const subMenu2 = getSubMenu(rootMenu);
      const items = getMenuItems(subMenu2);

      // Arrow Down to focus next item
      items[0].focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(items[1].hasAttribute('focus-ring')).to.be.true;

      // Arrow Left to close the sub-menu
      await sendKeys({ press: 'ArrowLeft' });
      await nextFrame();
      expect(rootItem.hasAttribute('focus-ring')).to.be.true;

      // Re-open sub-menu and check focus
      await openMenu(rootItem);
      expect(items[0].hasAttribute('focus-ring')).to.be.true;
    });

    it('should focus first non-disabled item after re-opening when using components', async () => {
      rootMenu.items[3].children[0].disabled = true;

      const rootItem = getMenuItems(rootMenu)[3];

      // Open the sub-menu with item components
      await openMenu(rootItem);
      const subMenu2 = getSubMenu(rootMenu);
      const items = getMenuItems(subMenu2);

      // Arrow Down to focus next item
      items[1].focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(items[2].hasAttribute('focus-ring')).to.be.true;

      // Arrow Left to close the sub-menu
      await sendKeys({ press: 'ArrowLeft' });
      await nextFrame();
      expect(rootItem.hasAttribute('focus-ring')).to.be.true;

      // Re-open sub-menu and check focus
      await openMenu(rootItem);
      expect(items[1].hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('expanded state', () => {
    beforeEach(async () => {
      await openRoot();
      await openSubMenu(rootMenu);
    });

    it('should have expanded attributes', async () => {
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.true;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('true');
      subMenu.close();
      await nextRender();
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.false;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('false');
    });

    it('should update expanded attributes when activating different parent items', async () => {
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.true;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('true');

      await activateItem(getMenuItems(rootMenu)[3]);
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.false;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('false');
      expect(getMenuItems(rootMenu)[3].hasAttribute('expanded')).to.be.true;
      expect(getMenuItems(rootMenu)[3].getAttribute('aria-expanded')).to.equal('true');

      await activateItem(getMenuItems(rootMenu)[0]);
      expect(getMenuItems(rootMenu)[0].hasAttribute('expanded')).to.be.true;
      expect(getMenuItems(rootMenu)[0].getAttribute('aria-expanded')).to.equal('true');
      expect(getMenuItems(rootMenu)[3].hasAttribute('expanded')).to.be.false;
      expect(getMenuItems(rootMenu)[3].getAttribute('aria-expanded')).to.equal('false');
    });
  });
});
