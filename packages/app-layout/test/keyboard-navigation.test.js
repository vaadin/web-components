import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-app-layout.js';
import '../vaadin-drawer-toggle.js';

describe('keyboard navigation', () => {
  let layout, toggle, drawer, drawerLink, contentLink, outerInput;

  async function tab() {
    await sendKeys({ press: 'Tab' });
  }

  async function shiftTab() {
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
  }

  async function fixtureLayout(layoutMode) {
    const overlayMode = String(layoutMode === 'mobile');

    const wrapper = fixtureSync(`
      <div>
        <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: ${overlayMode}; --vaadin-app-layout-transition: none;">
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <section slot="drawer">
            <a href="#">Drawer Link</a>
          </section>
          <main>
            <a href="#">Content Link</a>
          </main>
        </vaadin-app-layout>
        <input placeholder="Outer input" />
      </div>
    `);
    [layout, outerInput] = wrapper.children;
    await nextRender();
    toggle = layout.querySelector(':scope > [slot=navbar]');
    drawer = layout.shadowRoot.querySelector('[part=drawer]');
    drawerLink = layout.querySelector(':scope > [slot=drawer] > a');
    contentLink = layout.querySelector(':scope > :not([slot]) > a');
  }

  describe('desktop layout', () => {
    beforeEach(async () => {
      await fixtureLayout('desktop');
    });

    it('should have focus outside the layout by default', () => {
      expect(layout.contains(document.activeElement)).to.be.false;
    });

    it('should move focus from the outside to the drawer toggle on Tab', async () => {
      await tab();
      expect(document.activeElement).to.equal(toggle);
    });

    it('should move focus from the drawer toggle to the drawer content on Tab', async () => {
      toggle.focus();
      await tab();
      expect(document.activeElement).to.equal(drawerLink);
    });

    it('should move focus from the drawer content to the layout content on Tab', async () => {
      drawerLink.focus();
      await tab();
      expect(document.activeElement).to.equal(contentLink);
    });

    it('should move focus from the layout content to outside the layout on Tab', async () => {
      contentLink.focus();
      await tab();
      expect(document.activeElement).to.equal(outerInput);
    });

    describe('drawer is closed', () => {
      beforeEach(async () => {
        toggle.focus();
        toggle.click();
        await nextFrame();
      });

      it('should move focus from the drawer toggle to the layout content on Tab', async () => {
        toggle.focus();
        await tab();
        expect(document.activeElement).to.equal(contentLink);
      });
    });
  });

  describe('mobile layout', () => {
    beforeEach(async () => {
      await fixtureLayout('mobile');
    });

    it('should have focus outside the layout by default', () => {
      expect(layout.contains(document.activeElement)).to.be.false;
    });

    it('should move focus from the outside to the drawer toggle on Tab', async () => {
      await tab();
      expect(document.activeElement).to.equal(toggle);
    });

    it('should move focus from the drawer toggle to the layout content on Tab', async () => {
      toggle.focus();
      await tab();
      expect(document.activeElement).to.equal(contentLink);
    });

    it('should move focus from the layout content to outside the layout on Tab', async () => {
      contentLink.focus();
      await tab();
      expect(document.activeElement).to.equal(outerInput);
    });

    it('should keep the drawer content not focusable even if there is an element with [tabindex] = 0', async () => {
      drawerLink.tabIndex = 0;
      await nextFrame();
      toggle.focus();
      await tab();
      expect(document.activeElement).not.to.equal(drawerLink);
    });

    describe('drawer is opened', () => {
      beforeEach(async () => {
        toggle.focus();
        toggle.click();
        await nextFrame();
      });

      it('should have focus on the drawer', () => {
        expect(layout.shadowRoot.activeElement).to.equal(drawer);
      });

      it('should move focus from the drawer to the drawer content on Tab', async () => {
        await tab();
        expect(document.activeElement).to.equal(drawerLink);
      });

      it('should move focus from the drawer content to the drawer on Tab', async () => {
        drawerLink.focus();
        await tab();
        expect(layout.shadowRoot.activeElement).to.equal(drawer);
      });

      it('should move focus from the drawer content to the drawer on Shift+Tab', async () => {
        drawerLink.focus();
        await shiftTab();
        expect(layout.shadowRoot.activeElement).to.equal(drawer);
      });

      it('should move focus from the drawer to the drawer content on Shift+Tab', async () => {
        drawer.focus();
        await shiftTab();
        expect(document.activeElement).to.equal(drawerLink);
      });

      describe('drawer is closed', () => {
        beforeEach(async () => {
          await sendKeys({ press: 'Escape' });
          await nextFrame();
        });

        it('should have focus on the drawer toggle', () => {
          expect(document.activeElement).to.equal(toggle);
        });

        it('should move focus from the drawer toggle to the layout content on Tab', async () => {
          await tab();
          expect(document.activeElement).to.equal(contentLink);
        });
      });
    });
  });
});
