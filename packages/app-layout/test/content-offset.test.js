import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-app-layout.js';

describe('content offset', () => {
  let layout;

  describe('initial render', () => {
    it('should set content offset for the drawer', () => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: 200px;">
          <section slot="drawer">Drawer</section>
          <main>Content</main>
        </vaadin-app-layout>
      `);
      expect(getComputedStyle(layout).paddingInlineStart).to.equal('200px');
    });

    it('should set content offset for the top navbar', () => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: false;">
          <div slot="navbar" style="height: 100px;">Navbar</div>
          <main>Content</main>
        </vaadin-app-layout>
      `);
      const navbar = layout.shadowRoot.querySelector('[part~="navbar-top"]');
      const offset = parseFloat(getComputedStyle(layout).paddingTop);
      expect(offset).to.be.greaterThan(100);
      expect(offset).to.be.closeTo(navbar.getBoundingClientRect().height, 1);
    });

    it('should set content offset for the bottom navbar', () => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: true;">
          <div slot="navbar touch-optimized" style="height: 100px;">Navbar</div>
          <main>Content</main>
        </vaadin-app-layout>
      `);
      const navbar = layout.shadowRoot.querySelector('[part~="navbar-bottom"]');
      const offset = parseFloat(getComputedStyle(layout).paddingBottom);
      expect(offset).to.be.greaterThan(100);
      expect(offset).to.be.closeTo(navbar.getBoundingClientRect().height, 1);
    });

    it('should apply overlay mode', () => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: true; --vaadin-app-layout-drawer-width: 200px;">
          <section slot="drawer">Drawer</section>
          <main>Content</main>
        </vaadin-app-layout>
      `);
      expect(layout.overlay).to.be.true;
      expect(layout.drawerOpened).to.be.false;
      expect(getComputedStyle(layout).paddingInlineStart).to.equal('0px');
    });

    it('should move touch-optimized navbar items to navbar-bottom', () => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: true;">
          <div slot="navbar touch-optimized">Navbar</div>
          <main>Content</main>
        </vaadin-app-layout>
      `);
      expect(layout.querySelector('div').getAttribute('slot')).to.equal('navbar-bottom');
    });

    it('should not set content offset for an empty drawer', () => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: 200px;">
          <main>Content</main>
        </vaadin-app-layout>
      `);
      expect(getComputedStyle(layout).paddingInlineStart).to.equal('0px');
    });
  });

  describe('slot change', () => {
    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: 200px; --vaadin-app-layout-touch-optimized: false; --vaadin-app-layout-transition-duration: 0s;">
          <main>Content</main>
        </vaadin-app-layout>
      `);
    });

    it('should toggle drawer visibility and content offset when drawer content changes', async () => {
      const drawer = layout.shadowRoot.querySelector('[part="drawer"]');
      const section = document.createElement('section');
      section.setAttribute('slot', 'drawer');
      layout.appendChild(section);
      await aTimeout(0);
      expect(drawer.hasAttribute('hidden')).to.be.false;
      expect(getComputedStyle(layout).paddingInlineStart).to.equal('200px');

      section.remove();
      await aTimeout(0);
      expect(drawer.hasAttribute('hidden')).to.be.true;
      expect(getComputedStyle(layout).paddingInlineStart).to.equal('0px');
    });

    it('should toggle navbar visibility and content offset when navbar content changes', async () => {
      const navbar = layout.shadowRoot.querySelector('[part~="navbar-top"]');
      const item = document.createElement('div');
      item.setAttribute('slot', 'navbar');
      item.style.height = '100px';
      layout.appendChild(item);
      await aTimeout(0);
      expect(navbar.hasAttribute('hidden')).to.be.false;
      expect(parseFloat(getComputedStyle(layout).paddingTop)).to.be.greaterThan(100);

      item.remove();
      await aTimeout(0);
      expect(navbar.hasAttribute('hidden')).to.be.true;
      expect(getComputedStyle(layout).paddingTop).to.equal('0px');
    });

    it('should show navbar-bottom and set content offset when touch-optimized navbar content is added', async () => {
      layout.style.setProperty('--vaadin-app-layout-touch-optimized', 'true');
      const navbar = layout.shadowRoot.querySelector('[part~="navbar-bottom"]');
      const item = document.createElement('div');
      item.setAttribute('slot', 'navbar touch-optimized');
      item.style.height = '100px';
      layout.appendChild(item);
      await aTimeout(0);
      expect(navbar.hasAttribute('hidden')).to.be.false;
      expect(parseFloat(getComputedStyle(layout).paddingBottom)).to.be.greaterThan(100);
    });

    it('should move touch-optimized item to navbar-bottom', async () => {
      layout.style.setProperty('--vaadin-app-layout-touch-optimized', 'true');
      const item = document.createElement('div');
      item.setAttribute('slot', 'navbar touch-optimized');
      layout.appendChild(item);
      await aTimeout(0);
      expect(item.getAttribute('slot')).to.equal('navbar-bottom');
    });

    it('should move touch-optimized item to navbar when not touch-optimized', async () => {
      const item = document.createElement('div');
      item.setAttribute('slot', 'navbar touch-optimized');
      layout.appendChild(item);
      await aTimeout(0);
      expect(item.getAttribute('slot')).to.equal('navbar');
    });
  });

  describe('resize', () => {
    describe('navbar', () => {
      let item;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: false; --vaadin-app-layout-transition-duration: 0s;">
            <div slot="navbar" style="height: 100px;">Navbar</div>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        item = layout.querySelector('[slot="navbar"]');
        await nextResize(layout);
        await nextFrame();
      });

      it('should update content offset when navbar height changes', async () => {
        const offset = parseInt(getComputedStyle(layout).paddingTop);
        item.style.height = '200px';
        await nextResize(layout);
        await nextFrame();
        expect(parseInt(getComputedStyle(layout).paddingTop)).to.equal(offset + 100);
      });
    });

    describe('navbar-bottom', () => {
      let item;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: true; --vaadin-app-layout-transition-duration: 0s;">
            <div slot="navbar touch-optimized" style="height: 100px;">Navbar</div>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        item = layout.querySelector('[slot="navbar-bottom"]');
        await nextResize(layout);
        await nextFrame();
      });

      it('should update content offset when navbar-bottom height changes', async () => {
        const offset = parseInt(getComputedStyle(layout).paddingBottom);
        item.style.height = '200px';
        await nextResize(layout);
        await nextFrame();
        expect(parseInt(getComputedStyle(layout).paddingBottom)).to.equal(offset + 100);
      });
    });

    describe('drawer', () => {
      let drawer, section;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-app-layout primary-section="drawer" style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: auto; --vaadin-app-layout-transition-duration: 0s;">
            <section slot="drawer" style="width: 200px;">Drawer</section>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        drawer = layout.shadowRoot.querySelector('[part="drawer"]');
        section = layout.querySelector('[slot="drawer"]');
        await nextResize(layout);
        await nextFrame();
      });

      it('should update content offset when drawer width changes', async () => {
        section.style.width = '100px';
        await nextResize(layout);
        await nextFrame();
        expect(getComputedStyle(layout).paddingInlineStart).to.equal('100px');
      });

      it('should update content offset once after the drawer transition', async () => {
        layout.style.setProperty('--vaadin-app-layout-transition-duration', '100ms');
        const spy = sinon.spy(layout, '__setDrawerOffsetSize');
        layout.drawerOpened = false;
        await oneEvent(drawer, 'transitionend');
        expect(spy).to.be.not.called;
        await nextResize(layout);
        await nextFrame();
        expect(spy).to.be.calledOnce;
      });
    });
  });
});
