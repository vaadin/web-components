import { expect } from '@vaadin/chai-plugins';
import {
  arrowDown,
  arrowLeft,
  arrowUp,
  click,
  enter,
  esc,
  fire,
  fixtureSync,
  isDesktopSafari as isSafari,
  nextRender,
  nextUpdate,
  oneEvent,
  space,
  touchend,
  touchstart,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './menu-bar-test-styles.js';
import '../src/vaadin-menu-bar.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

const menuOpenEvent = isTouch ? 'click' : 'mouseover';

describe('sub-menu', () => {
  let menu, buttons, subMenu, subMenuOverlay, item;

  const createComponent = (text) => {
    const item = document.createElement('vaadin-menu-bar-item');
    item.textContent = text;
    return item;
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
            children: [{ text: 'Menu Item 1 2 1' }],
          },
        ],
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [
          {
            component: createComponent('Menu Item 3 1'),
          },
          {
            component: createComponent('Menu Item 3 2'),
          },
          {
            component: createComponent('Menu Item 3 3'),
          },
        ],
      },
    ];
    await nextRender();
    subMenu = menu._subMenu;
    subMenuOverlay = subMenu._overlayElement;
    buttons = menu._buttons;
  });

  it('should open sub-menu when button with nested items clicked', async () => {
    buttons[0].click();
    await nextRender();
    expect(subMenu.opened).to.be.true;
  });

  it('should not open sub-menu when button without nested items clicked', async () => {
    buttons[1].click();
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  it('should reopen sub-menu when different button with nested items clicked', async () => {
    buttons[0].click();
    await nextRender();
    expect(subMenu.listenOn).to.equal(buttons[0]);
    const spy = sinon.spy(subMenu, 'close');
    buttons[2].click();
    await nextRender();
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[2]);
    expect(spy.calledOnce).to.be.true;
  });

  it('should set pointer events to `auto` when opened on click', async () => {
    buttons[0].click();
    await nextRender();
    expect(menu.style.pointerEvents).to.equal('auto');
  });

  it('should reset pointer events after closing on click', async () => {
    buttons[0].click();
    await nextRender();

    buttons[0].click();
    await nextRender();
    expect(menu.style.pointerEvents).to.be.empty;
  });

  it('should not stop click event from propagating when opened ', async () => {
    const event = new CustomEvent('click', { bubbles: true });
    const spy = sinon.spy(event, 'stopPropagation');
    buttons[0].dispatchEvent(event);
    await nextRender();
    expect(spy.called).to.be.false;
  });

  it('should focus the overlay when sub-menu opened on click', async () => {
    const spy = sinon.spy(subMenuOverlay.$.overlay, 'focus');
    buttons[0].click();
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    expect(spy.calledOnce).to.be.true;
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    expect(item.hasAttribute('focused')).to.be.false;
  });

  it('should focus the first item on overlay arrow down after open on click', async () => {
    buttons[0].click();
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const overlay = subMenuOverlay.$.overlay;
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    const spy = sinon.spy(item, 'focus');
    arrowDown(overlay);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus the last item on overlay arrow up after open on click', async () => {
    buttons[0].click();
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const overlay = subMenuOverlay.$.overlay;
    const items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    const last = items[items.length - 1];
    const spy = sinon.spy(last, 'focus');
    arrowUp(overlay);
    expect(spy.calledOnce).to.be.true;
  });

  it('should open sub-menu on arrow down', async () => {
    const spy = sinon.spy();
    menu._container.addEventListener('keydown', spy);
    arrowDown(buttons[0]);
    await nextRender();
    expect(subMenu.opened).to.be.true;
    expect(spy.firstCall.args[0].defaultPrevented).to.be.true;
  });

  it('should focus first sub-menu item when opened on arrow down', async () => {
    arrowDown(buttons[0]);
    await nextUpdate(subMenu);
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    const spy = sinon.spy(item, 'focus');
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus the first item on button space', async () => {
    space(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    expect(item.hasAttribute('focused')).to.be.true;
  });

  it('should focus the first item on button enter', async () => {
    enter(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    expect(item.hasAttribute('focused')).to.be.true;
  });

  it('should open sub-menu and focus last item on arrow up', async () => {
    arrowUp(buttons[0]);
    await nextUpdate(subMenu);
    const items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    const last = items[items.length - 1];
    const spy = sinon.spy(last, 'focus');
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus first item after re-opening when using components', async () => {
    arrowDown(buttons[2]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');

    const items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    arrowDown(items[0]);
    expect(items[1].hasAttribute('focus-ring')).to.be.true;

    // Close and re-open
    esc(items[1]);
    arrowDown(buttons[2]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');

    expect(items[0].hasAttribute('focus-ring')).to.be.true;
  });

  it('should focus first non-disabled item after re-opening when using components', async () => {
    menu.items[2].children[0].disabled = true;

    arrowDown(buttons[2]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');

    const items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    expect(items[1].hasAttribute('focus-ring')).to.be.true;

    // Close and re-open
    esc(items[1]);
    arrowDown(buttons[2]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');

    expect(items[1].hasAttribute('focus-ring')).to.be.true;
  });

  it('should close sub-menu on first item arrow up', async () => {
    arrowDown(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    expect(item).to.be.ok;
    await nextRender();
    arrowUp(item);
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  it('should focus first item on arrow down after opened on arrow left', async () => {
    arrowDown(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    expect(subMenu.opened).to.be.true;
    let item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    await nextRender();
    arrowLeft(item);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    const spy = sinon.spy(item, 'focus');
    arrowDown(buttons[2]);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus last item on arrow up after opened on arrow left', async () => {
    arrowDown(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    expect(subMenu.opened).to.be.true;
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    await nextRender();
    arrowLeft(item);
    await nextRender();
    const items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    const last = items[items.length - 1];
    const spy = sinon.spy(last, 'focus');
    arrowUp(buttons[2]);
    expect(spy.calledOnce).to.be.true;
  });

  it('should close submenu on Esc after switch on arrow left', async () => {
    arrowDown(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    expect(subMenu.opened).to.be.true;
    await nextRender();
    const item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    arrowLeft(item);
    await nextRender();
    esc(buttons[2]);
    await nextRender();
    expect(subMenu.opened).to.be.false;
    expect(buttons[2].hasAttribute('focused')).to.be.true;
  });

  it('should close sub-menu on outside click', async () => {
    buttons[0].click();
    await nextRender();

    document.body.click();
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  it('should close and dispatch item-selected event on select', async () => {
    buttons[0].click();
    await nextRender();

    const spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    item.click();
    await nextRender();
    expect(subMenu.opened).to.be.false;
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.deep.equal({ text: 'Menu Item 1 1' });
  });

  it('should close sub-menu programmatically', async () => {
    buttons[0].click();
    await nextRender();
    expect(subMenu.opened).to.be.true;

    menu.close();
    expect(subMenu.opened).to.be.false;
  });

  it('should not close submenu on item contextmenu event', async () => {
    buttons[0].click();
    await nextRender();
    item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
    item.dispatchEvent(new CustomEvent('contextmenu', { bubbles: true, composed: true }));
    await nextRender();
    expect(subMenu.opened).to.be.true;
  });

  it('should not close on parent item click', async () => {
    arrowUp(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    const last = items[items.length - 1];
    await nextRender();
    last.click();
    await nextRender();
    expect(subMenu.opened).to.be.true;
  });

  it('should reopen sub-menu after updating items', async () => {
    buttons[0].click();
    await nextRender();

    document.body.click();
    await nextRender();

    menu.items = [menu.items[0]];
    await nextRender();

    buttons = menu._buttons;
    buttons[0].click();
    await nextRender();
    expect(subMenu.opened).to.be.true;
  });

  it('should dispatch item-selected event on leaf button click', () => {
    const spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    buttons[1].click();
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].detail.value).to.deep.equal({ text: 'Menu Item 2' });
  });

  it('should position bottom-aligned sub-menu to button top', async () => {
    menu.style.position = 'absolute';
    menu.style.bottom = '50px';
    buttons[0].click();
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const overlayRect = subMenuOverlay.getBoundingClientRect();
    const buttonRect = buttons[0].getBoundingClientRect();
    expect(overlayRect.top + overlayRect.height).to.be.closeTo(buttonRect.top, 1);
  });

  describe('sub-menu position', () => {
    describe('LTR', () => {
      beforeEach(() => {
        menu.style.position = 'absolute';
        menu.style.right = '0px';
      });

      it('should position end-aligned sub-menu to button right in LTR', async () => {
        buttons[2].click();
        await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
        const overlayRect = subMenuOverlay.getBoundingClientRect();
        const buttonRect = buttons[2].getBoundingClientRect();
        expect(overlayRect.right).to.be.closeTo(buttonRect.right, 1);
      });
    });

    describe('RTL', () => {
      beforeEach(() => {
        document.documentElement.setAttribute('dir', 'rtl');
        menu.style.position = 'absolute';
        menu.style.left = '0px';
      });

      afterEach(() => {
        document.documentElement.removeAttribute('dir');
      });

      it('should position sub-menu in RTL to button right', async () => {
        buttons[0].click();
        await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
        const overlayRect = subMenuOverlay.getBoundingClientRect();
        const buttonRect = buttons[0].getBoundingClientRect();
        expect(overlayRect.right).to.be.closeTo(buttonRect.right, 1);
      });

      it('should position end-aligned sub-menu in RTL to button left', async () => {
        buttons[2].click();
        await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
        const overlayRect = subMenuOverlay.getBoundingClientRect();
        const buttonRect = buttons[2].getBoundingClientRect();
        expect(overlayRect.left).to.be.closeTo(buttonRect.left, 1);
      });
    });
  });

  it('should not close sub-menu on items change if item has not changed', async () => {
    buttons[0].click();
    await nextRender();

    menu.items = [...menu.items, { text: 'Menu Item 1' }];
    await nextRender();
    expect(subMenu.opened).to.be.true;
  });

  it('should close sub-menu on items change if item no longer has children', async () => {
    buttons[0].click();
    await nextRender();

    menu.items = [{ text: 'Menu Item 0' }, ...menu.items];
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  it('should close sub-menu on items change if item has empty children', async () => {
    buttons[0].click();
    await nextRender();

    menu.items = [{ text: 'Menu Item 0', children: [] }, ...menu.items];
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  describe('expanded attribute', () => {
    it('should toggle expanded attribute on button with nested items clicked', async () => {
      buttons[0].click();
      await nextRender();
      expect(buttons[0].hasAttribute('expanded')).to.be.true;

      buttons[0].click();
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
    });

    it('should toggle expanded attribute on button with nested items toggled with the keyboard', async () => {
      arrowDown(buttons[0]);
      await nextRender();
      expect(buttons[0].hasAttribute('expanded')).to.be.true;

      item = subMenuOverlay.querySelector('vaadin-menu-bar-item');
      arrowUp(item);
      await nextRender();
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
    });

    it('should remove expanded attribute and restore focus when sub-menu closed on Esc', async () => {
      arrowDown(buttons[0]);
      await nextRender();
      expect(buttons[0].hasAttribute('expanded')).to.be.true;

      esc(subMenuOverlay);
      await nextRender();
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
      expect(buttons[0].hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove expanded attribute when submenu closed on overlay backdrop click', async () => {
      buttons[0].click();
      await nextRender();

      subMenuOverlay.$.backdrop.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
      await nextRender();
      expect(subMenu.opened).to.be.false;
      expect(buttons[0].hasAttribute('expanded')).to.be.false;
    });
  });
});

describe('open on hover', () => {
  let menu, buttons, subMenu;

  const openOnHoverEvent = 'mouseover';

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [{ text: 'Menu Item 1 1' }, { text: 'Menu Item 1 2' }],
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }],
      },
    ];
    menu.openOnHover = true;
    await nextRender();
    subMenu = menu._subMenu;
    buttons = menu._buttons;
  });

  it('should set pointer events to `auto` when opened and remove when closed', async () => {
    expect(menu.style.pointerEvents).to.be.empty;

    fire(buttons[0], openOnHoverEvent);
    await nextRender();
    expect(menu.style.pointerEvents).to.equal('auto');

    fire(buttons[2], openOnHoverEvent);
    await nextRender();
    expect(menu.style.pointerEvents).to.equal('auto');

    document.body.click();
    await nextRender();
    expect(menu.style.pointerEvents).to.be.empty;
  });

  it('should open sub-menu on mouseover on button with nested items', async () => {
    fire(buttons[0], openOnHoverEvent);
    await nextRender();
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[0]);
  });

  it('should close open sub-menu on mouseover on button without nested items', async () => {
    fire(buttons[0], openOnHoverEvent);
    await nextRender();
    fire(buttons[1], openOnHoverEvent);
    await nextRender();
    expect(subMenu.opened).to.be.false;
  });

  it('should switch opened sub-menu on hover also when open-on-hover is false', async () => {
    menu.openOnHover = false;
    await nextUpdate(menu);
    buttons[0].click();
    await nextRender();
    fire(buttons[2], openOnHoverEvent);
    await nextRender();
    expect(subMenu.opened).to.be.true;
    expect(subMenu.listenOn).to.equal(buttons[2]);
  });

  it('should not select value of button without nested items', () => {
    const spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    fire(buttons[1], openOnHoverEvent);
    expect(spy.called).to.be.false;
  });

  it('should not close sub-menu on expanded button mouseover', async () => {
    fire(buttons[0], openOnHoverEvent);
    await nextRender();
    fire(buttons[0], openOnHoverEvent);
    await nextRender();
    expect(subMenu.opened).to.be.true;
  });
});

describe('theme attribute', () => {
  let menu, subMenu, subMenuOverlay, buttons;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-menu-bar theme="foo"></vaadin-menu-bar>');
    menu.items = [
      {
        text: 'Menu Item 1',
        children: [
          { text: 'Menu Item 1 1', theme: 'sub-item-theme' },
          {
            text: 'Menu Item 1 2',
          },
        ],
      },
      { text: 'Menu Item 2' },
      { text: 'Menu Item 3' },
    ];
    await nextRender();
    subMenu = menu._subMenu;
    subMenuOverlay = subMenu._overlayElement;
    buttons = menu._buttons;

    // Open submenu
    menu.openOnHover = true;
    buttons[0].dispatchEvent(new CustomEvent(menuOpenEvent, { bubbles: true, composed: true }));
    await nextRender();
  });

  it('should propagate theme attribute to the submenu', () => {
    expect(subMenu.getAttribute('theme')).to.be.equal('foo');
  });

  it('should remove theme attribute from the submenu', async () => {
    menu.removeAttribute('theme');
    await nextUpdate(menu);
    expect(subMenu.hasAttribute('theme')).to.be.false;
  });

  it('should override the component theme attribute with the item.theme property', async () => {
    let items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');

    expect(items[0].getAttribute('theme')).to.equal('sub-item-theme');
    expect(items[1].getAttribute('theme')).to.equal('foo');

    subMenu.close();
    await nextUpdate(menu);

    menu.removeAttribute('theme');
    await nextUpdate(menu);

    buttons[0].dispatchEvent(new CustomEvent(menuOpenEvent, { bubbles: true, composed: true }));
    await nextRender();

    items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');

    expect(items[0].getAttribute('theme')).to.equal('sub-item-theme');
    expect(items[1].hasAttribute('theme')).to.be.false;
  });
});

describe('touch', () => {
  let menu, buttons, subMenu, subMenuOverlay, items, item;

  const open = (openTarget) => {
    const menu = openTarget.parentElement.parentElement.owner;
    if (menu) {
      menu.__openListenerActive = true;
      const overlay = menu._overlayElement;
      overlay.__openingHandler?.();
    }
    fire(openTarget, menuOpenEvent);
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
              { text: 'Menu Item 1 2 2' },
            ],
          },
        ],
      },
      { text: 'Menu Item 2' },
      {
        text: 'Menu Item 3',
        children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }],
      },
    ];
    await nextRender();
    subMenu = menu._subMenu;
    subMenuOverlay = subMenu._overlayElement;
    buttons = menu._buttons;
  });

  (isSafari ? it.skip : it)('should close submenu on mobile when selecting an item in the nested one', async () => {
    arrowDown(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const subMenu2 = subMenuOverlay.querySelector('vaadin-menu-bar-submenu');
    items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    item = items[items.length - 1];
    open(item);
    await nextRender();
    items = subMenu2._overlayElement.querySelectorAll('vaadin-menu-bar-item');
    item = items[items.length - 1];
    touchstart(item);
    touchend(item);
    click(item);
    await nextRender();
    expect(subMenu2.opened).to.be.false;
  });

  it('should not close submenu on mobile when opening the nested submenu', async () => {
    arrowDown(buttons[0]);
    await oneEvent(subMenuOverlay, 'vaadin-overlay-open');
    const subMenu2 = subMenuOverlay.querySelector('vaadin-menu-bar-submenu');
    items = subMenuOverlay.querySelectorAll('vaadin-menu-bar-item');
    item = items[items.length - 1];
    open(item);
    await nextRender();
    const subMenu3 = subMenu2._overlayElement.querySelector('vaadin-menu-bar-submenu');
    item = subMenu2._overlayElement.querySelector('vaadin-menu-bar-item');
    expect(item).to.be.ok;
    open(item);
    await nextRender();
    expect(subMenu3.opened).to.be.true;
    subMenu3.dispatchEvent(new CustomEvent('close-all-menus'));
  });
});
