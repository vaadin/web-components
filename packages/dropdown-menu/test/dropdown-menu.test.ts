import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fire, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.css';
import type { DropdownMenuButton } from '../src/vaadin-dropdown-menu-button.js';
import type { DropdownMenuOverlay } from '../src/vaadin-dropdown-menu-overlay.js';
import type { DropdownMenu } from '../vaadin-dropdown-menu.js';
import { getButton, getOverlay, getOverlayPart, openMenu } from './helpers.js';

describe('vaadin-dropdown-menu', () => {
  let menu: DropdownMenu;
  let button: DropdownMenuButton;
  let overlay: DropdownMenuOverlay;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>');
    menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }];
    await nextRender();
    button = getButton(menu);
    overlay = getOverlay(menu);
  });

  afterEach(async () => {
    menu.close();
    await resetMouse();
  });

  describe('custom element definition', () => {
    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-dropdown-menu')).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get('vaadin-dropdown-menu') as any).is).to.equal('vaadin-dropdown-menu');
    });
  });

  describe('opening', () => {
    it('should open on button click', async () => {
      await openMenu(menu);
      expect(menu.opened).to.be.true;
    });

    it('should position the overlay below the button start', async () => {
      await openMenu(menu);
      const buttonRect = button.getBoundingClientRect();
      const overlayRect = getOverlayPart(overlay).getBoundingClientRect();
      expect(overlayRect.top).to.be.at.least(buttonRect.bottom);
      expect(overlayRect.left).to.be.closeTo(buttonRect.left, 1);
    });

    it('should position the overlay below the button end with bottom-end', async () => {
      menu.position = 'bottom-end';
      await openMenu(menu);
      const buttonRect = button.getBoundingClientRect();
      const overlayRect = getOverlayPart(overlay).getBoundingClientRect();
      expect(overlayRect.top).to.be.at.least(buttonRect.bottom);
      expect(overlayRect.right).to.be.closeTo(buttonRect.right, 1);
    });

    it('should position the overlay above the button with top-start', async () => {
      menu.style.marginTop = '200px';
      menu.position = 'top-start';
      await openMenu(menu);
      const buttonRect = button.getBoundingClientRect();
      const overlayRect = getOverlayPart(overlay).getBoundingClientRect();
      expect(overlayRect.bottom).to.be.at.most(buttonRect.top);
      expect(overlayRect.left).to.be.closeTo(buttonRect.left, 1);
    });

    it('should fall back to bottom-start when position is set to empty value', async () => {
      menu.position = '' as any;
      await openMenu(menu);
      const buttonRect = button.getBoundingClientRect();
      const overlayRect = getOverlayPart(overlay).getBoundingClientRect();
      expect(menu.position).to.equal('bottom-start');
      expect(overlayRect.top).to.be.at.least(buttonRect.bottom);
    });

    it('should fire opened-changed event on open', async () => {
      const spy = sinon.spy();
      menu.addEventListener('opened-changed', spy);
      await openMenu(menu);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0].detail.value).to.be.true;
    });

    it('should not open on contextmenu event on the button', async () => {
      fire(button, 'contextmenu');
      await nextRender();
      expect(menu.opened).to.be.false;
    });

    it('should not open when disabled', async () => {
      menu.disabled = true;
      await nextUpdate(menu);
      button.click();
      await nextRender();
      expect(menu.opened).to.be.false;
    });

    it('should close when disabled is set while opened', async () => {
      await openMenu(menu);
      menu.disabled = true;
      expect(menu.opened).to.be.false;
    });
  });

  describe('closing', () => {
    beforeEach(async () => {
      await openMenu(menu);
    });

    it('should close and stay closed on button click', async () => {
      await sendMouseToElement({ type: 'click', element: button });
      await nextRender();
      expect(menu.opened).to.be.false;
    });

    it('should toggle active attribute on the button while opened', async () => {
      menu.close();
      const opened = oneEvent(overlay, 'vaadin-overlay-open');
      await sendMouseToElement({ type: 'click', element: button });
      await opened;
      expect(button.hasAttribute('active')).to.be.true;
      menu.close();
      expect(button.hasAttribute('active')).to.be.false;
    });

    it('should keep pointer-events on the host while opened', () => {
      expect(getComputedStyle(document.body).pointerEvents).to.equal('none');
      expect(getComputedStyle(menu).pointerEvents).to.equal('auto');
    });

    it('should close on outside click and restore body pointer-events', async () => {
      await sendMouse({ type: 'click', position: [400, 400] });
      await nextRender();
      expect(menu.opened).to.be.false;
      expect(document.body.style.pointerEvents).to.equal('');
    });

    it('should fire closed event after closing', async () => {
      const closed = oneEvent(menu, 'closed');
      menu.close();
      await closed;
    });
  });

  describe('text selection', () => {
    let paragraph: HTMLElement;

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <p>Some text</p>
          <vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>
        </div>
      `);
      menu = wrapper.querySelector('vaadin-dropdown-menu')!;
      menu.items = [{ text: 'Item 1' }];
      paragraph = wrapper.querySelector('p')!;
      await nextRender();
    });

    it('should not clear page text selection on open', async () => {
      const selection = document.getSelection()!;
      selection.selectAllChildren(paragraph);
      const spy = sinon.spy(selection, 'removeAllRanges');
      await openMenu(menu);
      spy.restore();
      expect(spy).to.be.not.called;
    });
  });
});
