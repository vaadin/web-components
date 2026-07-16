import { expect } from '@vaadin/chai-plugins';
import { arrowDownKeyDown, escKeyDown, fire, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';

describe('slotted list-box', () => {
  let menu, target, overlay, listBox;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
        <vaadin-context-menu-list-box slot="overlay">
          <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
          <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
          <vaadin-context-menu-item>Rename</vaadin-context-menu-item>
        </vaadin-context-menu-list-box>
      </vaadin-context-menu>
    `);
    await nextRender();
    target = menu.querySelector('#target');
    overlay = menu._overlayElement;
    listBox = menu.querySelector('vaadin-context-menu-list-box');
  });

  afterEach(() => {
    menu.close();
  });

  async function openMenu() {
    fire(target, 'vaadin-contextmenu');
    await oneEvent(overlay, 'vaadin-overlay-open');
  }

  it('should not initialize the overlay renderer', () => {
    expect(overlay.renderer).to.be.undefined;
  });

  it('should use the slotted list-box as the menu content on open', async () => {
    await openMenu();
    expect(overlay._menuListBox).to.equal(listBox);
    expect(listBox.items).to.have.lengthOf(3);
  });

  it('should focus the first item on open', async () => {
    await openMenu();
    expect(getDeepActiveElement()).to.equal(listBox.items[0]);
  });

  it('should move focus into the list-box on ArrowDown from the overlay', async () => {
    await openMenu();
    overlay.$.overlay.focus();
    arrowDownKeyDown(overlay.$.overlay);
    expect(getDeepActiveElement()).to.equal(listBox.items[0]);
  });

  it('should close the menu on item click', async () => {
    await openMenu();
    listBox.items[1].click();
    await nextRender();
    expect(menu.opened).to.be.false;
  });

  it('should close the menu on Escape', async () => {
    await openMenu();
    escKeyDown(getDeepActiveElement());
    await nextRender();
    expect(menu.opened).to.be.false;
  });
});

describe('slotted list-box with items', () => {
  let warnSpy;

  beforeEach(() => {
    clearWarnings();
    warnSpy = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warnSpy.restore();
  });

  it('should use the slotted list-box over the items property and warn once', async () => {
    const menu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
        <vaadin-context-menu-list-box slot="overlay">
          <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
          <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
        </vaadin-context-menu-list-box>
      </vaadin-context-menu>
    `);
    menu.items = [{ text: 'Ignored' }];
    await nextRender();

    expect(menu._overlayElement.renderer).to.be.undefined;
    expect(warnSpy.callCount).to.equal(1);
  });

  it('should keep the slotted list-box and preserve closeOn when items is set later', async () => {
    const menu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
        <vaadin-context-menu-list-box slot="overlay">
          <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
        </vaadin-context-menu-list-box>
      </vaadin-context-menu>
    `);
    await nextRender();

    menu.items = [{ text: 'Ignored' }];
    menu.renderer = () => {};
    await nextRender();

    expect(menu._overlayElement.renderer).to.be.undefined;
    expect(menu.closeOn).to.equal('click');
  });
});
