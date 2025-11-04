import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-menu-bar.js';

describe('keyboard navigation', () => {
  let menu, buttons, firstGlobalFocusable, lastGlobalFocusable;

  function updateItemsAndButtons() {
    menu.items = [...menu.items];
    buttons = menu._buttons;
  }

  beforeEach(() => {
    const wrapper = fixtureSync(`
      <div>
        <input id="first-global-focusable" />
        <vaadin-menu-bar></vaadin-menu-bar>
        <input id="last-global-focusable" />
      </div>
    `);
    [firstGlobalFocusable, menu, lastGlobalFocusable] = wrapper.children;
  });

  describe('root level buttons', () => {
    beforeEach(async () => {
      menu.items = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3', disabled: true }, { text: 'Item 4' }];
      await nextRender();
      buttons = menu._buttons;
    });

    describe('default mode', () => {
      describe('LTR', () => {
        it('should move focus to next button on Arrow Right keydown', async () => {
          buttons[0].focus();
          const spy = sinon.spy(buttons[1], 'focus');
          await sendKeys({ press: 'ArrowRight' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[1].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to prev button on Arrow Left keydown', async () => {
          buttons[1].focus();
          const spy = sinon.spy(buttons[0], 'focus');
          await sendKeys({ press: 'ArrowLeft' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[0].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to first button on Home keydown', async () => {
          buttons[1].focus();
          const spy = sinon.spy(buttons[0], 'focus');
          await sendKeys({ press: 'Home' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[0].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to second button if first is disabled on Home keydown', async () => {
          menu.items[0].disabled = true;
          updateItemsAndButtons();
          buttons[3].focus();
          const spy = sinon.spy(buttons[1], 'focus');
          await sendKeys({ press: 'Home' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[1].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to last button on End keydown', async () => {
          buttons[0].focus();
          const spy = sinon.spy(buttons[3], 'focus');
          await sendKeys({ press: 'End' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[3].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to the closest enabled button if last is disabled on End keydown', async () => {
          menu.items[3].disabled = true;
          updateItemsAndButtons();
          buttons[0].focus();
          const spy = sinon.spy(buttons[1], 'focus');
          await sendKeys({ press: 'End' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[1].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to first button on Arrow Right, if last button has focus', async () => {
          buttons[3].focus();
          const spy = sinon.spy(buttons[0], 'focus');
          await sendKeys({ press: 'ArrowRight' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[0].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to last button on Arrow Left, if first button has focus', async () => {
          buttons[0].focus();
          const spy = sinon.spy(buttons[3], 'focus');
          await sendKeys({ press: 'ArrowLeft' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[3].hasAttribute('focused')).to.be.true;
        });
      });

      describe('RTL mode', () => {
        beforeEach(() => {
          menu.setAttribute('dir', 'rtl');
        });

        it('should move focus to next button on Arrow Left keydown', async () => {
          buttons[0].focus();
          const spy = sinon.spy(buttons[1], 'focus');
          await sendKeys({ press: 'ArrowLeft' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[1].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to prev button on Arrow Right keydown', async () => {
          buttons[1].focus();
          const spy = sinon.spy(buttons[0], 'focus');
          await sendKeys({ press: 'ArrowRight' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[0].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to first button on Arrow Left, if last button has focus', async () => {
          buttons[3].focus();
          const spy = sinon.spy(buttons[0], 'focus');
          await sendKeys({ press: 'ArrowLeft' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[0].hasAttribute('focused')).to.be.true;
        });

        it('should move focus to last button on Arrow Right", if first button has focus', async () => {
          buttons[0].focus();
          const spy = sinon.spy(buttons[3], 'focus');
          await sendKeys({ press: 'ArrowRight' });
          expect(spy.calledOnce).to.be.true;
          expect(buttons[3].hasAttribute('focused')).to.be.true;
        });
      });

      describe('overflow', () => {
        beforeEach(async () => {
          menu.items = [{ text: 'Item Foo' }, { text: 'Item Bar' }];
          await nextRender();
          buttons = menu._buttons;
        });

        it('should move focus back to the overflow button on Shift + Tab after Tab', async () => {
          // Hide all buttons except overflow
          menu.style.width = '100px';
          await nextResize(menu);

          firstGlobalFocusable.focus();
          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(menu._overflow);

          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(lastGlobalFocusable);

          await sendKeys({ press: 'Shift+Tab' });
          expect(document.activeElement).to.equal(menu._overflow);
        });

        it('should move focus back to the overflow button on Tab after Shift + Tab', async () => {
          // Show 1 button + overflow
          menu.style.width = '120px';
          await nextResize(menu);

          lastGlobalFocusable.focus();
          await sendKeys({ press: 'Shift+Tab' });
          expect(document.activeElement).to.equal(menu._overflow);

          await sendKeys({ press: 'Shift+Tab' });
          expect(document.activeElement).to.equal(firstGlobalFocusable);

          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(menu._overflow);
        });

        it('should move focus back to the overflow button on Tab after button is hidden', async () => {
          lastGlobalFocusable.focus();
          await sendKeys({ press: 'Shift+Tab' });
          expect(document.activeElement).to.equal(buttons[1]);

          await sendKeys({ press: 'Shift+Tab' });
          expect(document.activeElement).to.equal(firstGlobalFocusable);

          // Hide all buttons except overflow
          menu.style.width = '100px';
          await nextResize(menu);

          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(menu._overflow);
        });

        it('should not skip buttons on Tab after overflow becomes hidden', async () => {
          // Hide all buttons except overflow
          menu.style.width = '100px';
          await nextResize(menu);

          firstGlobalFocusable.focus();
          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(menu._overflow);

          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(lastGlobalFocusable);

          // Show all buttons and hide overflow
          menu.style.width = '100%';
          await nextResize(menu);

          await sendKeys({ press: 'Shift+Tab' });
          expect(document.activeElement).to.equal(buttons[1]);
        });
      });
    });

    describe('tab navigation mode', () => {
      beforeEach(() => {
        menu.tabNavigation = true;
      });

      it('should move focus to next button on Tab keydown', async () => {
        buttons[0].focus();
        await sendKeys({ press: 'Tab' });
        expect(buttons[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to prev button on Shift Tab keydown', async () => {
        buttons[1].focus();
        await sendKeys({ press: 'Shift+Tab' });
        expect(buttons[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to fourth button if third is disabled on Tab keydown', async () => {
        buttons[1].focus();
        await sendKeys({ press: 'Tab' });
        expect(buttons[3].hasAttribute('focused')).to.be.true;
      });

      it('should move focus out of the menu bar on last button Tab keydown', async () => {
        buttons[3].focus();
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement).to.equal(lastGlobalFocusable);
      });

      it('should move focus out of the menu bar on first button Shift Tab keydown', async () => {
        buttons[0].focus();
        await sendKeys({ press: 'Shift+Tab' });
        expect(document.activeElement).to.equal(firstGlobalFocusable);
      });

      it('should move focus out of the menu bar on Tab if tab navigation is disabled', async () => {
        menu.tabNavigation = false;
        buttons[0].focus();
        await sendKeys({ press: 'Tab' });
        expect(document.activeElement).to.equal(lastGlobalFocusable);
      });

      it('should move focus out of the menu bar on Shift Tab if tab navigation is disabled', async () => {
        menu.tabNavigation = false;
        buttons[0].focus();
        await sendKeys({ press: 'ArrowRight' });
        await sendKeys({ press: 'Shift+Tab' });
        expect(document.activeElement).to.equal(firstGlobalFocusable);
      });
    });
  });

  describe('submenu items', () => {
    let subMenu;

    beforeEach(async () => {
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
        { text: 'Menu Item 4', children: [{ text: 'Menu Item 4 1' }] },
      ];
      await nextUpdate(menu);
      buttons = menu._buttons;
      subMenu = menu._subMenu;
    });

    describe('default mode', () => {
      it('should switch menubar button with items and open submenu on item Arrow Left', async () => {
        buttons[0].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Move to previous button with submenu
        await sendKeys({ press: 'ArrowLeft' });
        await nextRender();

        expect(subMenu.opened).to.be.true;
        expect(subMenu.listenOn).to.equal(buttons[3]);
      });

      it('should switch menubar button without items and focus it on item Arrow Left', async () => {
        buttons[2].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Move to previous button without submenu
        await sendKeys({ press: 'ArrowLeft' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(buttons[1]);
      });

      it('should switch menubar button with items and open submenu on item Arrow Right', async () => {
        buttons[2].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Move to next button with submenu
        await sendKeys({ press: 'ArrowRight' });
        await nextRender();

        expect(subMenu.opened).to.be.true;
        expect(subMenu.listenOn).to.equal(buttons[3]);
      });

      it('should switch menubar button without items and focus it on item Arrow Right', async () => {
        buttons[0].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Move to next button without submenu
        await sendKeys({ press: 'ArrowRight' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(buttons[1]);
      });

      it('should switch submenu again on subsequent item Arrow Left', async () => {
        buttons[0].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        await sendKeys({ press: 'ArrowLeft' });
        await nextRender();

        await sendKeys({ press: 'ArrowLeft' });
        await nextRender();

        expect(subMenu.opened).to.be.true;
        expect(subMenu.listenOn).to.equal(buttons[2]);
      });

      it('should switch submenu again on subsequent item Arrow Right', async () => {
        buttons[2].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        await sendKeys({ press: 'ArrowRight' });
        await nextRender();

        await sendKeys({ press: 'ArrowRight' });
        await nextRender();

        expect(subMenu.opened).to.be.true;
        expect(subMenu.listenOn).to.equal(buttons[0]);
      });
    });

    describe('tab navigation mode', () => {
      beforeEach(() => {
        menu.tabNavigation = true;
      });

      it('should switch menubar button with items and open submenu on item Tab', async () => {
        buttons[2].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Tab to next button with submenu
        await sendKeys({ press: 'Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.true;
        expect(subMenu.listenOn).to.equal(buttons[3]);
      });

      it('should switch menubar button with items and open submenu on Shift Tab', async () => {
        buttons[3].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Shift Tab to previous button with submenu
        await sendKeys({ press: 'Shift+Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.true;
        expect(subMenu.listenOn).to.equal(buttons[2]);
      });

      it('should switch menubar button without items and open submenu on item Tab', async () => {
        buttons[0].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Tab to next button without submenu
        await sendKeys({ press: 'Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(buttons[1]);
      });

      it('should switch menubar button without items and open submenu on item Shift Tab', async () => {
        buttons[2].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Tab to next button without submenu
        await sendKeys({ press: 'Shift+Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(buttons[1]);
      });

      it('should move focus out of the menu bar on last submenu item Tab', async () => {
        buttons[3].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Tab outside the menu bar
        await sendKeys({ press: 'Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(lastGlobalFocusable);
      });

      it('should move focus out of the menu bar on first submenu item Shift Tab', async () => {
        buttons[0].focus();

        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Shift + Tab outside the menu bar
        await sendKeys({ press: 'Shift+Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(firstGlobalFocusable);
      });

      it('should move focus out of the menu bar on last available submenu item Tab', async () => {
        menu.items[3].disabled = true;
        updateItemsAndButtons();

        buttons[2].focus();
        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Tab outside the menu bar (since next button is disabled)
        await sendKeys({ press: 'Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(lastGlobalFocusable);
      });

      it('should move focus out of the menu bar on first available submenu item Tab', async () => {
        menu.items[0].disabled = true;
        menu.items[1].disabled = true;
        updateItemsAndButtons();

        buttons[2].focus();
        await sendKeys({ press: 'ArrowDown' });
        await nextRender();
        expect(subMenu.opened).to.be.true;
        expect(document.activeElement).to.equal(subMenu.querySelector('vaadin-menu-bar-item'));

        // Tab outside the menu bar (since previous buttons are disabled)
        await sendKeys({ press: 'Shift+Tab' });
        await nextRender();

        expect(subMenu.opened).to.be.false;
        expect(document.activeElement).to.equal(firstGlobalFocusable);
      });
    });
  });

  describe('single button', () => {
    beforeEach(async () => {
      menu.items = [{ text: 'Item 1', children: [{ text: 'Item 1 1' }] }];
      await nextUpdate(menu);
      buttons = menu._buttons;
      firstGlobalFocusable.focus();
    });

    it('should be focusable on Shift + Tab after closing and moving focus by default', async () => {
      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);

      await sendKeys({ press: 'Shift+Tab' });
      expect(document.activeElement).to.equal(buttons[0]);
    });

    it('should be focusable on Shift + Tab after closing and moving focus with Tab navigation', async () => {
      menu.tabNavigation = true;

      await sendKeys({ press: 'Tab' });

      await sendKeys({ press: 'ArrowDown' });
      await nextRender();

      await sendKeys({ press: 'Escape' });

      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(lastGlobalFocusable);

      await sendKeys({ press: 'Shift+Tab' });
      expect(document.activeElement).to.equal(buttons[0]);
    });
  });
});
