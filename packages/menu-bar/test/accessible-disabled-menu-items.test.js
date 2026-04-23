import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-menu-bar.js';

describe('accessible disabled menu items', () => {
  let menuBar, buttons, subMenu;

  before(() => {
    window.Vaadin.featureFlags ??= {};
    window.Vaadin.featureFlags.accessibleDisabledMenuItems = true;
  });

  after(() => {
    window.Vaadin.featureFlags.accessibleDisabledMenuItems = false;
  });

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <input id="first-global-focusable" />
        <vaadin-menu-bar></vaadin-menu-bar>
        <input id="last-global-focusable" />
      </div>
    `);
    menuBar = wrapper.querySelector('vaadin-menu-bar');
    menuBar.items = [
      {
        text: 'Item 0',
        children: [{ text: 'SubItem 0' }, { text: 'SubItem 1', disabled: true }, { text: 'SubItem 2' }],
      },
    ];
    await nextRender();
    buttons = menuBar._buttons;
    subMenu = menuBar._subMenu;
  });

  afterEach(async () => {
    await resetMouse();
  });

  function getSubMenuItems() {
    return [...subMenu.querySelectorAll('vaadin-menu-bar-item')];
  }

  it('should include disabled sub-menu item in arrow key navigation', async () => {
    buttons[0].focus();
    await sendKeys({ press: 'ArrowDown' });
    await nextRender();

    let items = getSubMenuItems();
    expect(document.activeElement).to.equal(items[0]);

    await sendKeys({ press: 'ArrowDown' });
    items = getSubMenuItems();
    expect(document.activeElement).to.equal(items[1]);
    expect(items[1].disabled).to.be.true;

    await sendKeys({ press: 'ArrowDown' });
    items = getSubMenuItems();
    expect(document.activeElement).to.equal(items[2]);
  });

  it('should allow programmatic focus on disabled sub-menu item', async () => {
    buttons[0].focus();
    await sendKeys({ press: 'ArrowDown' });
    await nextRender();

    const items = getSubMenuItems();
    items[1].focus();
    expect(document.activeElement).to.equal(items[1]);
  });

  it('should not select a disabled sub-menu item on click', async () => {
    buttons[0].focus();
    await sendKeys({ press: 'ArrowDown' });
    await nextRender();

    const spy = sinon.spy();
    menuBar.addEventListener('item-selected', spy);

    const items = getSubMenuItems();
    await sendMouseToElement({ type: 'click', element: items[1] });

    expect(spy.called).to.be.false;
  });
});
