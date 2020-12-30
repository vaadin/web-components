import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { tap } from '@polymer/iron-test-helpers/mock-interactions.js';
import { arrowDown, arrowLeft, arrowRight, arrowUp, esc, isIOS, nextRender, onceOpened } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-menu-bar.js';

describe('sub-menu', () => {
  let menu, buttons, subMenu, item;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [
          { text: 'Menu Item 1 1' },
          {
            text: 'Menu Item 1 2',
            children: [{ text: 'Menu Item 1 2 1' }]
          }
        ]
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }]
      }
    ];
    await nextRender(menu);
    subMenu = menu._subMenu;
    buttons = menu._buttons;
  });

  afterEach(() => {
    if (subMenu && subMenu.opened) {
      subMenu.close();
    }
  });

  it('should open sub-menu when button with nested items clicked', async () => {
    buttons[0].click();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
  });

  it('should not open sub-menu when button without nested items clicked', async () => {
    buttons[1].click();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
  });

  it('should reopen sub-menu when different button with nested items clicked', async () => {
    buttons[0].click();
    await nextRender(subMenu);
    expect(subMenu.listenOn).to.equal(buttons[0]);
    const spy = sinon.spy(subMenu, 'close');
    buttons[2].click();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[2]);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus the overlay when sub-menu opened on click', async () => {
    const spy = sinon.spy(subMenu.$.overlay.$.overlay, 'focus');
    buttons[0].click();
    await nextRender(subMenu);
    expect(spy.calledOnce).to.be.true;
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    expect(item.hasAttribute('focused')).to.be.false;
  });

  it('should focus the first item on overlay arrow down after open on click', async () => {
    buttons[0].click();
    await nextRender(subMenu);
    const overlay = subMenu.$.overlay.$.overlay;
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    const spy = sinon.spy(item, 'focus');
    arrowDown(overlay);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus the last item on overlay arrow up after open on click', async () => {
    buttons[0].click();
    await nextRender(subMenu);
    const overlay = subMenu.$.overlay.$.overlay;
    const items = subMenu.$.overlay.querySelectorAll('vaadin-context-menu-item');
    const last = items[items.length - 1];
    const spy = sinon.spy(last, 'focus');
    arrowUp(overlay);
    expect(spy.calledOnce).to.be.true;
  });

  (isIOS ? it.skip : it)('should open sub-menu on arrow down', async () => {
    const spy = sinon.spy();
    menu._container.addEventListener('keydown', spy);
    arrowDown(buttons[0]);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(spy.firstCall.args[0].defaultPrevented).to.be.true;
  });

  (isIOS ? it.skip : it)('should focus first sub-menu item when opened on arrow down', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    const spy = sinon.spy(item, 'focus');
    await nextRender(subMenu);
    expect(spy.calledOnce).to.be.true;
  });

  (isIOS ? it.skip : it)('should open sub-menu and focus last item on arrow up', async () => {
    arrowUp(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    const items = subMenu.$.overlay.querySelectorAll('vaadin-context-menu-item');
    const last = items[items.length - 1];
    const spy = sinon.spy(last, 'focus');
    await nextRender(subMenu);
    expect(spy.calledOnce).to.be.true;
  });

  (isIOS ? it.skip : it)('should close sub-menu on first item arrow up', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    expect(item).to.be.ok;
    await nextRender(subMenu);
    arrowUp(item);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
  });

  (isIOS ? it.skip : it)('should switch menubar button with items and open submenu on arrow left', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    await nextRender(subMenu);
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    arrowLeft(item);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[2]);
  });

  (isIOS ? it.skip : it)('should switch menubar button without items and focus it on arrow left', async () => {
    arrowDown(buttons[2]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    await nextRender(subMenu);
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    arrowLeft(item);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
    expect(buttons[1].hasAttribute('focused')).to.be.true;
    expect(buttons[1].hasAttribute('focus-ring')).to.be.true;
  });

  (isIOS ? it.skip : it)('should switch menubar button with items and open submenu on arrow right', async () => {
    arrowDown(buttons[2]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    await nextRender(subMenu);
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    arrowRight(item);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[0]);
  });

  (isIOS ? it.skip : it)('should switch menubar button without items and focus it on arrow right', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    await nextRender(subMenu);
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    arrowRight(item);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
    expect(buttons[1].hasAttribute('focused')).to.be.true;
    expect(buttons[1].hasAttribute('focus-ring')).to.be.true;
  });

  (isIOS ? it.skip : it)('should focus first item on arrow down after opened on arrow left', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    let item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    await nextRender(subMenu);
    arrowLeft(item);
    await nextRender(subMenu);
    item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    const spy = sinon.spy(item, 'focus');
    arrowDown(buttons[2]);
    expect(spy.calledOnce).to.be.true;
  });

  (isIOS ? it.skip : it)('should focus last item on arrow up after opened on arrow left', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    await nextRender(subMenu);
    arrowLeft(item);
    await nextRender(subMenu);
    const items = subMenu.$.overlay.querySelectorAll('vaadin-context-menu-item');
    const last = items[items.length - 1];
    const spy = sinon.spy(last, 'focus');
    arrowUp(buttons[2]);
    expect(spy.calledOnce).to.be.true;
  });

  (isIOS ? it.skip : it)('should switch submenu again on subsequent arrow left', async () => {
    (menu.items[1] = { text: 'Menu Item 2', children: [{ text: 'Menu Item 2 1' }] }), menu.render();
    buttons = menu._buttons;
    await nextRender(menu);
    arrowDown(buttons[0]);
    await nextRender(subMenu);
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    arrowLeft(item);
    await nextRender(subMenu);
    arrowLeft(buttons[2]);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[1]);
    expect(buttons[1].hasAttribute('focused')).to.be.true;
  });

  (isIOS ? it.skip : it)('should close submenu on Esc after switch on arrow left', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    expect(subMenu.opened).to.be.true;
    await nextRender(subMenu);
    const item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    arrowLeft(item);
    await nextRender(subMenu);
    esc(buttons[2]);
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
    expect(buttons[2].hasAttribute('focused')).to.be.true;
  });

  it('should close sub-menu on outside click', async () => {
    buttons[0].click();
    await nextRender(subMenu);

    document.body.click();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
  });

  it('should close and dispatch item-selected event on select', async () => {
    buttons[0].click();
    await nextRender(subMenu);

    const spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    item.click();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.deep.equal({ text: 'Menu Item 1 1' });
  });

  it('should not close submenu on item contextmenu event', async () => {
    buttons[0].click();
    await nextRender(subMenu);
    item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
    item.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
  });

  (isIOS ? it.skip : it)('should not close on parent item click', async () => {
    arrowUp(buttons[0]);
    await onceOpened(subMenu);
    const items = subMenu.$.overlay.querySelectorAll('vaadin-context-menu-item');
    const last = items[items.length - 1];
    await nextRender(subMenu);
    last.click();
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
  });

  it('should dispatch item-selected event on leaf button click', () => {
    const spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    buttons[1].click();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.deep.equal({ text: 'Menu Item 2' });
  });

  (isIOS ? it.skip : it)('should position bottom-aligned sub-menu to button top', async () => {
    menu.style.position = 'absolute';
    menu.style.bottom = '50px';
    buttons[0].click();
    await nextRender(subMenu);
    const overlayRect = subMenu.$.overlay.getBoundingClientRect();
    const buttonRect = buttons[0].getBoundingClientRect();
    expect(overlayRect.top + overlayRect.height).to.be.closeTo(buttonRect.top, 1);
  });

  // TODO: Previously these tests were relying on iframe which had fixed size of WCT.
  // Consider changing them so that they no longer depend on the browser window size.
  describe.skip('sub-menu position', () => {
    (isIOS ? it.skip : it)('should position end-aligned sub-menu to button right in LTR', async () => {
      document.body.style.position = 'relative';
      document.body.style.width = '450px';
      document.body.style.minWidth = '450px';
      menu.style.position = 'absolute';
      menu.style.right = '0px';
      buttons[2].click();
      await nextRender(subMenu);
      const overlayRect = subMenu.$.overlay.getBoundingClientRect();
      const buttonRect = buttons[2].getBoundingClientRect();
      expect(overlayRect.right).to.be.closeTo(buttonRect.right, 1);
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.minWidth = '';
    });

    (isIOS ? it.skip : it)('should position sub-menu in RTL to button right', async () => {
      document.body.style.position = 'relative';
      document.body.style.width = '450px';
      document.body.style.minWidth = '450px';
      document.body.style.overflow = 'hidden';
      menu.style.position = 'absolute';
      menu.style.left = '0px';
      // set dir on document to also it apply to submenu
      document.documentElement.setAttribute('dir', 'rtl');
      buttons[0].click();
      await nextRender(subMenu);
      const overlayRect = subMenu.$.overlay.getBoundingClientRect();
      const buttonRect = buttons[0].getBoundingClientRect();
      expect(overlayRect.right).to.be.closeTo(buttonRect.right, 1);
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.minWidth = '';
      document.body.style.overflow = '';
    });

    (isIOS ? it.skip : it)('should position end-aligned sub-menu in RTL to button left', async () => {
      document.body.style.position = 'relative';
      document.body.style.width = '470px';
      document.body.style.minWidth = '470px';
      document.body.style.overflow = 'hidden';
      menu.style.position = 'absolute';
      menu.style.left = '0px';
      // set dir on document to also it apply to submenu
      document.documentElement.setAttribute('dir', 'rtl');
      buttons[2].click();
      await nextRender(subMenu);
      const overlayRect = subMenu.$.overlay.getBoundingClientRect();
      const buttonRect = buttons[2].getBoundingClientRect();
      expect(overlayRect.left).to.be.closeTo(buttonRect.left, 1);
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.minWidth = '';
      document.body.style.overflow = '';
    });
  });

  it('should close sub-menu on items change', async () => {
    buttons[0].click();
    await nextRender(subMenu);

    menu.splice('items', 0, 1, { text: 'Menu Item 1' });
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
  });

  describe('expanded attribute', () => {
    it('should toggle expanded attribute on button with nested items clicked', async () => {
      buttons[0].click();
      await nextRender(subMenu);
      expect(buttons[0].hasAttribute('expanded')).to.be.true;

      buttons[0].click();
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
    });

    it('should toggle expanded attribute on button with nested items toggled with the keyboard', async () => {
      arrowDown(buttons[0]);
      await nextRender(subMenu);
      expect(buttons[0].hasAttribute('expanded')).to.be.true;

      item = subMenu.$.overlay.querySelector('vaadin-context-menu-item');
      arrowUp(item);
      await nextRender(subMenu);
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
    });

    it('should remove expanded attribute and restore focus when sub-menu closed on Esc', async () => {
      arrowDown(buttons[0]);
      await nextRender(subMenu);
      expect(buttons[0].hasAttribute('expanded')).to.be.true;

      esc(subMenu.$.overlay);
      await nextRender(subMenu);
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
      expect(buttons[0].hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove expanded attribute when submenu closed on overlay backdrop click', async () => {
      buttons[0].click();
      await nextRender(subMenu);

      subMenu.$.overlay.$.backdrop.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
      await nextRender(subMenu);
      expect(subMenu.opened).to.be.false;
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
    });
  });
});

describe('open on hover', () => {
  let menu, buttons, subMenu;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [{ text: 'Menu Item 1 1' }, { text: 'Menu Item 1 2' }]
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }]
      }
    ];
    menu.openOnHover = true;
    await nextRender(menu);
    subMenu = menu._subMenu;
    buttons = menu._buttons;
  });

  afterEach(() => {
    if (subMenu && subMenu.opened) {
      subMenu.close();
    }
  });

  it('should set pointer events to `auto` when opened and remove when closed', async () => {
    expect(menu.style.pointerEvents).to.be.empty;

    buttons[0].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(menu.style.pointerEvents).to.equal('auto');

    buttons[2].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(menu.style.pointerEvents).to.equal('auto');

    document.body.click();
    await nextRender(subMenu);
    expect(menu.style.pointerEvents).to.be.empty;
  });

  it('should open sub-menu on mouseover on button with nested items', async () => {
    buttons[0].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[0]);
  });

  it('should close open sub-menu on mouseover on button without nested items', async () => {
    buttons[0].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    buttons[1].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.false;
  });

  it('should switch opened sub-menu on hover also when open-on-hover is false', async () => {
    menu.openOnHover = false;
    buttons[0].click();
    await nextRender(subMenu);
    buttons[2].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[2]);
  });

  it('should not select value of button without nested items', async () => {
    const spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    buttons[1].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    expect(spy.called).to.be.false;
  });

  it('should not close sub-menu on expanded button mouseover', async () => {
    buttons[0].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    buttons[0].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
    expect(subMenu.opened).to.be.true;
  });
});

describe('accessibility', () => {
  let menu, buttons, subMenu, overflow;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [{ text: 'Menu Item 1 1' }, { text: 'Menu Item 1 2' }]
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }]
      }
    ];
    await nextRender(menu);
    subMenu = menu._subMenu;
    buttons = menu._buttons;
    overflow = menu._overflow;
  });

  afterEach(() => {
    if (subMenu && subMenu.opened) {
      subMenu.close();
    }
  });

  it('should set role attribute on host element', () => {
    expect(menu.getAttribute('role')).to.equal('menubar');
  });

  it('should set role attribute on menu bar buttons', () => {
    buttons.forEach((btn) => {
      expect(btn.getAttribute('role')).to.equal('menuitem');
    });
  });

  it('should set aria-haspopup attribute on buttons with nested items', () => {
    buttons.forEach((btn) => {
      const hasPopup = btn === overflow || btn.item.children ? 'true' : null;
      expect(btn.getAttribute('aria-haspopup')).to.equal(hasPopup);
    });
  });

  it('should set aria-expanded attribute on buttons with nested items', () => {
    buttons.forEach((btn) => {
      const expanded = btn === overflow || btn.item.children ? 'false' : null;
      expect(btn.getAttribute('aria-expanded')).to.equal(expanded);
    });
  });

  it('should toggle aria-expanded attribute on submenu open / close', async () => {
    buttons[0].click();
    await nextRender(subMenu);
    expect(buttons[0].getAttribute('aria-expanded')).to.equal('true');

    buttons[0].click();
    expect(buttons[0].getAttribute('aria-expanded')).to.equal('false');
  });
});

describe('theme attribute', () => {
  let menu, subMenu, buttons;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar theme="foo"></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [
          { text: 'Menu Item 1 1' },
          {
            text: 'Menu Item 1 2'
          }
        ]
      },
      { text: 'Menu Item 2' },
      { text: 'Menu Item 3' }
    ];
    await nextRender(menu);
    subMenu = menu._subMenu;
    buttons = menu._buttons;

    // open submenu
    menu.openOnHover = true;
    buttons[0].dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
    await nextRender(subMenu);
  });

  afterEach(() => {
    if (subMenu && subMenu.opened) {
      subMenu.close();
    }
  });

  it('should propagate theme attribute to the submenu', () => {
    expect(subMenu.getAttribute('theme')).to.be.equal('foo');
  });

  it('should remove theme attribute from the submenu', () => {
    menu.removeAttribute('theme');
    expect(subMenu.hasAttribute('theme')).to.be.false;
  });
});

describe('touch', () => {
  let menu, buttons, subMenu, items, item;

  const open = (openTarget) => {
    const menu = openTarget.parentElement.parentElement.__dataHost;
    if (menu) {
      menu.__openListenerActive = true;
      const overlay = menu.$.overlay;
      overlay.__openingHandler && overlay.__openingHandler();
    }
    openTarget.dispatchEvent(new CustomEvent('mouseover', { bubbles: true, composed: true }));
  };

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [
          { text: 'Menu Item 1 1' },
          {
            text: 'Menu Item 1 2',
            children: [
              { text: 'Menu Item 1 2 1', children: [{ text: 'Menu Item 1 2 1 1' }] },
              { text: 'Menu Item 1 2 2' }
            ]
          }
        ]
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }]
      }
    ];
    await nextRender(menu);
    subMenu = menu._subMenu;
    buttons = menu._buttons;
  });

  afterEach(() => {
    if (subMenu && subMenu.opened) {
      subMenu.close();
    }
  });

  const isSafari = /Safari/i.test(navigator.userAgent);
  (isSafari ? it.skip : it)('should close submenu on mobile when selecting an item in the nested one', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    await nextRender(subMenu);
    const subMenu2 = subMenu.$.overlay.querySelector('vaadin-menu-bar-submenu');
    items = subMenu.$.overlay.querySelectorAll('vaadin-context-menu-item');
    item = items[items.length - 1];
    open(item);
    await nextRender(subMenu2);
    items = subMenu2.$.overlay.querySelectorAll('vaadin-context-menu-item');
    item = items[items.length - 1];
    tap(item, { emulateTouch: true });
    await nextRender(subMenu2);
    expect(subMenu2.opened).to.be.false;
  });

  it('should not close submenu on mobile when opening the nested submenu', async () => {
    arrowDown(buttons[0]);
    await onceOpened(subMenu);
    await nextRender(subMenu);
    const subMenu2 = subMenu.$.overlay.querySelector('vaadin-menu-bar-submenu');
    items = subMenu.$.overlay.querySelectorAll('vaadin-context-menu-item');
    item = items[items.length - 1];
    open(item);
    await nextRender(subMenu2);
    const subMenu3 = subMenu2.$.overlay.querySelector('vaadin-menu-bar-submenu');
    item = subMenu2.$.overlay.querySelector('vaadin-context-menu-item');
    expect(item).to.be.ok;
    open(item);
    await nextRender(subMenu3);
    expect(subMenu3.opened).to.be.true;
    subMenu3.dispatchEvent(new CustomEvent('close-all-menus'));
  });
});
