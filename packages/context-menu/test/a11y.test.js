import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { getMenuItems } from './helpers.js';

describe('a11y', () => {
  describe('focus restoration', () => {
    let contextMenu, button, overlay;

    beforeEach(() => {
      contextMenu = fixtureSync(`
        <vaadin-context-menu open-on="click">
          <button>Open context menu</button>
        </vaadin-context-menu>
      `);
      contextMenu.items = [{ text: 'Item 0' }, { text: 'Item 1', children: [{ text: 'Item 1/0' }] }];
      button = contextMenu.querySelector('button');
      overlay = contextMenu.$.overlay;
      button.focus();
    });

    it('should move focus to the menu on open', async () => {
      button.click();
      await nextRender();
      const menuItem = getMenuItems(contextMenu)[0];
      expect(getDeepActiveElement()).to.equal(menuItem);
    });

    it('should restore focus on root menu item selection', async () => {
      button.click();
      await nextRender();
      // Select Item 0
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(button);
    });

    it('should restore focus on sub menu item selection', async () => {
      button.click();
      await nextRender();
      // Move focus to Item 1
      await sendKeys({ press: 'ArrowDown' });
      // Open Item 1
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      // Select Item 1/1
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(button);
    });
  });
});
