import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getMenuItems, outsideClick } from './helpers.js';

describe('a11y', () => {
  describe('focus restoration', () => {
    let contextMenu, contextMenuButton, beforeButton, afterButton;

    beforeEach(() => {
      const wrapper = fixtureSync(`
        <div>
          <button>Before</button>
          <vaadin-context-menu open-on="click">
            <button>Open context menu</button>
          </vaadin-context-menu>
          <button>After</button>
      `);
      [beforeButton, contextMenu, afterButton] = wrapper.children;
      contextMenu.items = [{ text: 'Item 0' }, { text: 'Item 1', children: [{ text: 'Item 1/0' }] }];
      contextMenuButton = contextMenu.querySelector('button');
      contextMenuButton.focus();
    });

    it('should move focus to the menu on open', async () => {
      contextMenuButton.click();
      await nextRender();
      const menuItem = getMenuItems(contextMenu)[0];
      expect(getDeepActiveElement()).to.equal(menuItem);
    });

    it('should restore focus on outside click', async () => {
      contextMenuButton.click();
      await nextRender();
      outsideClick();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(contextMenuButton);
    });

    it('should restore focus on outside click when a sub-menu is open', async () => {
      contextMenuButton.click();
      await nextRender();
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
      await nextRender();
      // Select Item 0
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(contextMenuButton);
    });

    it('should restore focus on sub-menu item selection', async () => {
      contextMenuButton.click();
      await nextRender();
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
      await nextRender();
      await sendKeys({ down: 'Shift' });
      await sendKeys({ press: 'Tab' });
      await sendKeys({ up: 'Shift' });
      expect(getDeepActiveElement()).to.equal(beforeButton);
    });

    it('should move focus to the next element outside the menu on Tab pressed inside', async () => {
      contextMenuButton.click();
      await nextRender();
      await sendKeys({ press: 'Tab' });
      expect(getDeepActiveElement()).to.equal(afterButton);
    });
  });
});
