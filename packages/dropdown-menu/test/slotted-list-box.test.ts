import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.css';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';
import { getMenuItems, openMenu } from './helpers.js';

describe('vaadin-dropdown-menu - slotted list-box', () => {
  let menu: DropdownMenu;
  let listBox: HTMLElement & { selected: number | null | undefined };
  let items: HTMLElement[];
  let spy: sinon.SinonSpy;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-dropdown-menu label="Actions">
        <vaadin-context-menu-list-box slot="overlay">
          <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
          <vaadin-context-menu-item disabled>Copy</vaadin-context-menu-item>
          <hr>
          <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
        </vaadin-context-menu-list-box>
      </vaadin-dropdown-menu>
    `);
    await nextRender();
    listBox = menu.querySelector('vaadin-context-menu-list-box')!;
    spy = sinon.spy();
    menu.addEventListener('item-selected', spy);
    await openMenu(menu);
    items = getMenuItems(menu);
  });

  afterEach(async () => {
    menu.close();
    await resetMouse();
  });

  it('should render the slotted list-box on open', () => {
    expect(listBox.checkVisibility()).to.be.true;
  });

  it('should fire item-selected with the item element and close on item click', () => {
    items[0].click();
    expect(spy).to.be.calledOnce;
    expect(spy.firstCall.args[0].detail.value).to.equal(items[0]);
    expect(menu.opened).to.be.false;
  });

  ['Enter', 'Space'].forEach((key) => {
    it(`should fire item-selected with the item element and close on ${key}`, async () => {
      items[3].focus();
      await sendKeys({ press: key });
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.equal(items[3]);
      expect(menu.opened).to.be.false;
    });
  });

  it('should reset the list-box selection after selecting an item', () => {
    items[0].click();
    expect(listBox.selected).to.be.null;
  });

  it('should not fire item-selected and close on disabled item click', async () => {
    await sendMouseToElement({ type: 'click', element: items[1] });
    expect(spy).to.be.not.called;
    expect(menu.opened).to.be.false;
  });

  it('should not fire item-selected and close on separator click', async () => {
    await sendMouseToElement({ type: 'click', element: items[2] });
    expect(spy).to.be.not.called;
    expect(menu.opened).to.be.false;
  });

  it('should throw when combined with items', () => {
    expect(() => {
      menu.items = [{ text: 'Item' }];
    }).to.throw(Error);
  });
});
