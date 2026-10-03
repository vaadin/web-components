import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { arrowUpKeyDown, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.css';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import type { DropdownMenuButton } from '../src/vaadin-dropdown-menu-button.js';
import type { DropdownMenuOverlay } from '../src/vaadin-dropdown-menu-overlay.js';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';
import { getButton, getMenuItems, getOverlay, getOverlayPart } from './helpers.js';

const fixtures = {
  items: `
    <div>
      <button id="before">Before</button>
      <vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>
      <button id="after">After</button>
    </div>
  `,
  slotted: `
    <div>
      <button id="before">Before</button>
      <vaadin-dropdown-menu label="Actions">
        <vaadin-context-menu-list-box slot="overlay">
          <vaadin-context-menu-item>Item 1</vaadin-context-menu-item>
          <vaadin-context-menu-item>Item 2</vaadin-context-menu-item>
          <vaadin-context-menu-item>Item 3</vaadin-context-menu-item>
        </vaadin-context-menu-list-box>
      </vaadin-dropdown-menu>
      <button id="after">After</button>
    </div>
  `,
};

(['items', 'slotted'] as const).forEach((mode) => {
  describe(`vaadin-dropdown-menu - keyboard (${mode})`, () => {
    let menu: DropdownMenu;
    let button: DropdownMenuButton;
    let overlay: DropdownMenuOverlay;
    let before: HTMLButtonElement;
    let after: HTMLButtonElement;

    beforeEach(async () => {
      const wrapper = fixtureSync(fixtures[mode]);
      menu = wrapper.querySelector('vaadin-dropdown-menu')!;
      if (mode === 'items') {
        menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3', keepOpen: true }];
      }
      before = wrapper.querySelector('#before')!;
      after = wrapper.querySelector('#after')!;
      await nextRender();
      button = getButton(menu);
      overlay = getOverlay(menu);
      before.focus();
      await sendKeys({ press: 'Tab' });
    });

    afterEach(async () => {
      menu.close();
      await resetMouse();
    });

    async function openWithKey(key: string) {
      const opened = oneEvent(overlay, 'vaadin-overlay-open');
      await sendKeys({ press: key });
      await opened;
    }

    describe('opening', () => {
      ['Enter', 'Space', 'ArrowDown'].forEach((key) => {
        it(`should open and focus the first item on ${key}`, async () => {
          await openWithKey(key);
          expect(menu.opened).to.be.true;
          expect(getDeepActiveElement()).to.equal(getMenuItems(menu)[0]);
        });
      });

      it('should open and focus the last item on ArrowUp', async () => {
        await openWithKey('ArrowUp');
        expect(menu.opened).to.be.true;
        expect(getDeepActiveElement()).to.equal(getMenuItems(menu)[2]);
      });

      it('should focus the first item on ArrowDown on the button when opened', async () => {
        await openWithKey('ArrowUp');
        button.focus();
        await sendKeys({ press: 'ArrowDown' });
        expect(getDeepActiveElement()).to.equal(getMenuItems(menu)[0]);
      });

      it('should focus the last item on ArrowUp on the button when opened', async () => {
        await openWithKey('ArrowDown');
        button.focus();
        await sendKeys({ press: 'ArrowUp' });
        expect(getDeepActiveElement()).to.equal(getMenuItems(menu)[2]);
      });
    });

    describe('closing', () => {
      it('should close and focus the button on Escape', async () => {
        await openWithKey('Enter');
        await sendKeys({ press: 'Escape' });
        expect(menu.opened).to.be.false;
        expect(getDeepActiveElement()).to.equal(button);
      });

      it('should close and focus the button on Escape after pointer open', async () => {
        const opened = oneEvent(overlay, 'vaadin-overlay-open');
        await sendMouseToElement({ type: 'click', element: button });
        await opened;
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(menu.opened).to.be.false;
        expect(getDeepActiveElement()).to.equal(button);
      });

      it('should close and focus the next element on Tab', async () => {
        await openWithKey('Enter');
        await sendKeys({ press: 'Tab' });
        expect(menu.opened).to.be.false;
        expect(getDeepActiveElement()).to.equal(after);
      });

      it('should close and focus the previous element on Shift+Tab', async () => {
        await openWithKey('Enter');
        await sendKeys({ press: 'Shift+Tab' });
        expect(menu.opened).to.be.false;
        expect(getDeepActiveElement()).to.equal(before);
      });

      it('should close and focus the next element on Tab after pointer open', async () => {
        const opened = oneEvent(overlay, 'vaadin-overlay-open');
        await sendMouseToElement({ type: 'click', element: button });
        await opened;
        await sendKeys({ press: 'Tab' });
        expect(menu.opened).to.be.false;
        expect(getDeepActiveElement()).to.equal(after);
      });
    });

    describe('focus', () => {
      it('should focus the first item without focus-ring on pointer open', async () => {
        const opened = oneEvent(overlay, 'vaadin-overlay-open');
        await sendMouseToElement({ type: 'click', element: button });
        await opened;
        const item = getMenuItems(menu)[0];
        expect(getDeepActiveElement()).to.equal(item);
        expect(item.hasAttribute('focus-ring')).to.be.false;
        expect(menu.hasAttribute('focus-ring')).to.be.false;
      });

      it('should focus the button on Escape when the overlay part has focus', async () => {
        await openWithKey('Enter');
        getOverlayPart(overlay).focus();
        await sendKeys({ press: 'Escape' });
        await nextRender();
        expect(menu.opened).to.be.false;
        expect(getDeepActiveElement()).to.equal(button);
      });

      it('should focus the first item on open after a cancelled ArrowUp open', async () => {
        arrowUpKeyDown(button);
        menu.close();
        await nextRender();
        await openWithKey('Enter');
        expect(getDeepActiveElement()).to.equal(getMenuItems(menu)[0]);
      });

      it('should toggle focus-ring attribute on keyboard focus', async () => {
        expect(menu.hasAttribute('focus-ring')).to.be.true;
        await sendKeys({ press: 'Tab' });
        expect(menu.hasAttribute('focus-ring')).to.be.false;
      });

      it('should set focus-ring attribute on programmatic focus after pointer interaction', async () => {
        await sendMouseToElement({ type: 'click', element: after });
        menu.focus();
        await Promise.resolve();
        expect(menu.hasAttribute('focus-ring')).to.be.true;
      });
    });

    if (mode === 'items') {
      describe('keepOpen', () => {
        ['Enter', 'Space'].forEach((key) => {
          it(`should keep the menu open on ${key} on a keepOpen item`, async () => {
            const spy = sinon.spy();
            menu.addEventListener('item-selected', spy);
            await openWithKey('ArrowUp');
            await sendKeys({ press: key });
            await nextRender();
            expect(spy).to.be.calledOnce;
            expect(menu.opened).to.be.true;
          });
        });
      });
    }
  });
});
