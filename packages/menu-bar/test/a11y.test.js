import { expect } from '@vaadin/chai-plugins';
import { arrowDown, arrowRight, enter, fixtureSync, nextRender, oneEvent, outsideClick } from '@vaadin/testing-helpers';
import '../src/vaadin-menu-bar.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('a11y', () => {
  describe('ARIA attributes', () => {
    let menu, buttons, subMenu, overflow;

    beforeEach(async () => {
      menu = fixtureSync('<vaadin-menu-bar></vaadin-menu-bar>');
      menu.items = [
        {
          text: 'Menu Item 1',
          children: [{ text: 'Menu Item 1 1' }, { text: 'Menu Item 1 2' }],
        },
        { text: 'Menu Item 2' },
        {
          text: 'Menu Item 3',
          children: [{ text: 'Menu Item 3 1' }, { text: 'Menu Item 3 2' }],
        },
      ];
      await nextRender();
      subMenu = menu._subMenu;
      buttons = menu._buttons;
      overflow = menu._overflow;
    });

    it('should set role attribute on host element', () => {
      expect(menu.getAttribute('role')).to.equal('menubar');
    });

    it('should set role attribute on menu bar buttons', () => {
      buttons.forEach((btn) => {
        expect(btn.getAttribute('role')).to.equal('menuitem');
      });
    });

    it('should set role attribute on host element in tabNavigation', () => {
      menu.tabNavigation = true;
      expect(menu.getAttribute('role')).to.equal('group');
    });

    it('should set role attribute on menu bar buttons in tabNavigation', () => {
      menu.tabNavigation = true;
      buttons.forEach((btn) => {
        expect(btn.getAttribute('role')).to.equal('button');
      });
    });

    it('should update role attribute on menu bar buttons when changing items', () => {
      menu.items = [...menu.items, { text: 'New item' }];
      menu._buttons.forEach((btn) => {
        expect(btn.getAttribute('role')).to.equal('menuitem');
      });
    });

    it('should update role attribute on menu bar buttons when changing items in tabNavigation', () => {
      menu.tabNavigation = true;
      menu.items = [...menu.items, { text: 'New item' }];
      menu._buttons.forEach((btn) => {
        expect(btn.getAttribute('role')).to.equal('button');
      });

      menu.tabNavigation = false;
      menu._buttons.forEach((btn) => {
        expect(btn.getAttribute('role')).to.equal('menuitem');
      });
    });

    it('should set aria-haspopup attribute on buttons with nested items', () => {
      buttons.forEach((btn) => {
        const hasPopup = btn === overflow || btn.item.children ? 'true' : null;
        expect(btn.getAttribute('aria-haspopup')).to.equal(hasPopup);
      });
    });

    it('should set aria-expanded attribute on buttons with nested items', () => {
      buttons.forEach((btn) => {
        const expanded = btn === overflow || btn.item.children ? 'false' : null;
        expect(btn.getAttribute('aria-expanded')).to.equal(expanded);
      });
    });

    it('should toggle aria-expanded attribute on submenu open / close', async () => {
      buttons[0].click();
      await oneEvent(subMenu._overlayElement, 'vaadin-overlay-open');
      expect(buttons[0].getAttribute('aria-expanded')).to.equal('true');

      buttons[0].click();
      expect(buttons[0].getAttribute('aria-expanded')).to.equal('false');
    });
  });

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
      await oneEvent(overlay, 'vaadin-overlay-open');
      expect(getDeepActiveElement()).to.equal(overlay.$.overlay);
    });

    it('should restore focus on outside click', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await oneEvent(overlay, 'vaadin-overlay-open');
      outsideClick();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore focus on outside click when a sub-menu is open', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await oneEvent(overlay, 'vaadin-overlay-open');
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
      await oneEvent(overlay, 'vaadin-overlay-open');
      // Select Item 0/0
      enter(getDeepActiveElement());
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });

    it('should restore focus on nested sub-menu item selection', async () => {
      // Open Item 0
      arrowDown(getDeepActiveElement());
      await oneEvent(overlay, 'vaadin-overlay-open');
      // Move to Item 0/1
      arrowDown(getDeepActiveElement());
      await nextRender();
      // Open Item 0/1
      arrowRight(getDeepActiveElement());
      const nestedSubMenu = overlay.querySelector('vaadin-menu-bar-submenu');
      await oneEvent(nestedSubMenu._overlayElement, 'vaadin-overlay-open');
      // Select Item 0/1/0
      enter(getDeepActiveElement());
      await nextRender();
      expect(getDeepActiveElement()).to.equal(buttons[0]);
    });
  });
});
