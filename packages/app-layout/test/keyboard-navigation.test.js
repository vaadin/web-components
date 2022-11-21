import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import '../vaadin-app-layout.js';
import '../vaadin-drawer-toggle.js';

describe('keyboard navigation', () => {
  let layout, toggle, drawer, drawerLink, contentLink, savedViewport;

  async function tab() {
    await sendKeys({ press: 'Tab' });
  }

  async function shiftTab() {
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
  }

  async function fixtureLayout() {
    layout = fixtureSync(`
      <vaadin-app-layout style="--vaadin-app-layout-transition: none;">
        <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
        <section slot="drawer">
          <a href="#">Drawer Link</a>
        </section>
        <main>
          <a href="#">Content Link</a>
        </main>
      </vaadin-app-layout>
    `);
    await nextRender();
    toggle = layout.querySelector(':scope > [slot=navbar]');
    drawer = layout.shadowRoot.querySelector('[part=drawer]');
    drawerLink = layout.querySelector(':scope > [slot=drawer] > a');
    contentLink = layout.querySelector(':scope > :not([slot]) > a');
  }

  before(() => {
    savedViewport = { width: window.innerWidth, height: window.innerHeight };
  });

  after(async () => {
    await setViewport(savedViewport);
  });

  describe('desktop layout', () => {
    before(async () => {
      await setViewport({ width: 1000, height: 1000 });
    });

    beforeEach(async () => {
      await fixtureLayout();
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
      expect(layout.contains(document.activeElement)).to.be.false;
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
    before(async () => {
      await setViewport({ width: 500, height: 500 });
    });

    beforeEach(async () => {
      await fixtureLayout();
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
      expect(layout.contains(document.activeElement)).to.be.false;
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
