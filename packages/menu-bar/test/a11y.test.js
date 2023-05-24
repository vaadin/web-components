import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '../vaadin-menu-bar.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('a11y', () => {
  describe('focus restoration', () => {
    let menuBar, overlay, buttons;

    beforeEach(() => {
      menuBar = fixtureSync(`<vaadin-menu-bar></vaadin-menu-bar>`);
      menuBar.items = [
        {
          text: 'Item 0',
          children: [
            { text: 'Item 0/0' },
            {
              text: 'Item 0/1',
              children: [{ text: 'Item 0/1/0' }],
            },
          ],
        },
      ];
      overlay = menuBar._subMenu.$.overlay;
      buttons = menuBar.querySelectorAll('vaadin-menu-bar-button');
      buttons[0].focus();
    });

    it('should move focus to the sub-menu on open', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      const menuItem = overlay.querySelector('[role=menuitem]');
      expect(getDeepActiveElement()).to.equal(menuItem);
    });

    it('should restore focus on sub-menu item selection', async () => {
      // Open Item 0
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      // Select Item 0/0
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore focus on nested sub-menu item selection', async () => {
      // Open Item 0
      await sendKeys({ press: 'ArrowDown' });
      await nextRender();
      // Move to Item 0/1
      await sendKeys({ press: 'ArrowDown' });
      // Open Item 0/1
      await sendKeys({ press: 'ArrowRight' });
      await nextRender();
      // Select Item 0/1/0
      await sendKeys({ press: 'Enter' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });
  });
});
