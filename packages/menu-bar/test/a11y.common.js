import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowRight, enter, fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('a11y', () => {
  describe('focus restoration', () => {
    let menuBar, overlay, buttons;

    beforeEach(async () => {
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
      await nextRender();
      overlay = menuBar._subMenu._overlayElement;
      buttons = menuBar.querySelectorAll('vaadin-menu-bar-button');
      buttons[0].focus();
    });

    it('should move focus to the sub-menu on open', async () => {
      buttons[0].click();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(overlay.$.overlay);
    });

    it('should restore focus on outside click', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await nextRender();
      outsideClick();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore focus on outside click when a sub-menu is open', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await nextRender();
      // Move to Item 0/1
      arrowDown(getDeepActiveElement());
      await nextRender();
      // Open Item 0/1
      arrowRight(getDeepActiveElement());
      outsideClick();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore focus on sub-menu item selection', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await nextRender();
      // Select Item 0/0
      enter(getDeepActiveElement());
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore focus on nested sub-menu item selection', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await nextRender();
      // Move to Item 0/1
      arrowDown(getDeepActiveElement());
      await nextRender();
      // Open Item 0/1
      arrowRight(getDeepActiveElement());
      await nextRender();
      // Select Item 0/1/0
      enter(getDeepActiveElement());
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });
  });
});
