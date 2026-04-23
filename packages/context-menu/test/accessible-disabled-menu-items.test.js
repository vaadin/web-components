import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getMenuItems, getSubMenu, openMenu } from './helpers.js';

describe('accessible disabled menu items', () => {
  let rootMenu, subMenu, target, items;

  before(() => {
    window.Vaadin.featureFlags ??= {};
    window.Vaadin.featureFlags.accessibleDisabledMenuItems = true;
  });

  after(() => {
    window.Vaadin.featureFlags.accessibleDisabledMenuItems = false;
  });

  beforeEach(async () => {
    rootMenu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
      </vaadin-context-menu>
    `);
    rootMenu.openOn = isTouch ? 'click' : 'mouseover';
    target = rootMenu.firstElementChild;
    rootMenu.items = [
      { text: 'Item 0' },
      { text: 'Item 1', disabled: true },
      { text: 'Item 2', disabled: true, children: [{ text: 'SubItem 0' }] },
      { text: 'Item 3' },
    ];
    await nextRender();
    await openMenu(target);
    items = getMenuItems(rootMenu);
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should allow programmatic focus on disabled item', () => {
    items[1].focus();
    expect(document.activeElement).to.equal(items[1]);
  });

  it('should include disabled items in arrow key navigation', async () => {
    items[0].focus();
    await sendKeys({ press: 'ArrowDown' });
    expect(document.activeElement).to.equal(items[1]);

    await sendKeys({ press: 'ArrowDown' });
    expect(document.activeElement).to.equal(items[2]);

    await sendKeys({ press: 'ArrowDown' });
    expect(document.activeElement).to.equal(items[3]);

    await sendKeys({ press: 'ArrowUp' });
    expect(document.activeElement).to.equal(items[2]);
  });

  it('should not select a disabled item on click', async () => {
    await sendMouseToElement({ type: 'click', element: items[1] });
    expect(items[1].selected).to.be.false;
  });

  it('should not open sub-menu on disabled parent item hover', async () => {
    await sendMouseToElement({ type: 'move', element: items[2] });
    subMenu = getSubMenu(rootMenu);
    expect(subMenu.opened).to.be.false;
    expect(items[2].hasAttribute('expanded')).to.be.false;
  });

  it('should not open sub-menu on disabled parent item Enter', async () => {
    items[2].focus();
    await sendKeys({ press: 'Enter' });
    subMenu = getSubMenu(rootMenu);
    expect(subMenu.opened).to.be.false;
    expect(items[2].hasAttribute('expanded')).to.be.false;
  });

  it('should set --_vaadin-item-disabled-pointer-events on disabled item', () => {
    expect(items[1].style.getPropertyValue('--_vaadin-item-disabled-pointer-events')).to.equal('auto');
  });
});

describe('accessible disabled menu items (feature flag disabled)', () => {
  let rootMenu, target, items;

  beforeEach(async () => {
    rootMenu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
      </vaadin-context-menu>
    `);
    rootMenu.openOn = isTouch ? 'click' : 'mouseover';
    target = rootMenu.firstElementChild;
    rootMenu.items = [{ text: 'Item 0' }, { text: 'Item 1', disabled: true }, { text: 'Item 2' }];
    await nextRender();
    await openMenu(target);
    items = getMenuItems(rootMenu);
  });

  it('should not allow programmatic focus on disabled item', () => {
    items[1].focus();
    expect(document.activeElement).to.not.equal(items[1]);
  });

  it('should skip disabled items in arrow key navigation', async () => {
    items[0].focus();
    await sendKeys({ press: 'ArrowDown' });
    expect(document.activeElement).to.equal(items[2]);
  });
});
