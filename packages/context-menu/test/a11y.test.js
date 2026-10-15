import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, oneEvent, outsideClick } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getMenuItems } from './helpers.js';

describe('a11y', () => {
  describe('focus restoration', () => {
    let contextMenu, contextMenuButton, overlay, firstGlobalFocusable, lastGlobalFocusable;

    beforeEach(async () => {
      const wrapper = fixtureSync(`
        <div>
          <input id="first-global-focusable" />
          <vaadin-context-menu open-on="click">
            <button>Open context menu</button>
          </vaadin-context-menu>
          <input id="last-global-focusable" />
        </div>
      `);
      [firstGlobalFocusable, contextMenu, lastGlobalFocusable] = wrapper.children;
      contextMenu.items = [{ text: 'Item 0' }, { text: 'Item 1', children: [{ text: 'Item 1/0' }] }];
      await nextRender();
      overlay = contextMenu._overlayElement;
      contextMenuButton = contextMenu.querySelector('button');
      contextMenuButton.focus();
    });

    it('should move focus to the menu on open', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      const menuItem = getMenuItems(contextMenu)[0];
      expect(getDeepActiveElement()).to.equal(menuItem);
    });

    it('should restore focus on outside click', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      outsideClick();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(contextMenuButton);
    });

    it('should restore focus on outside click when a sub-menu is open', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      // Move focus to Item 1
      await sendKeys({ press: 'ArrowDown' });
      // Open Item 1
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      outsideClick();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(contextMenuButton);
    });

    it('should restore focus on root menu item selection', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      // Select Item 0
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(contextMenuButton);
    });

    it('should restore focus on sub-menu item selection', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      // Move focus to Item 1
      await sendKeys({ press: 'ArrowDown' });
      // Open Item 1
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      // Select Item 1/1
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(contextMenuButton);
    });

    it('should move focus to the prev element outside the menu on Shift+Tab pressed inside', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Shift+Tab' });
      expect(getDeepActiveElement()).to.equal(firstGlobalFocusable);
    });

    it('should move focus to the next element outside the menu on Tab pressed inside', async () => {
      contextMenuButton.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(lastGlobalFocusable);
    });
  });
});
