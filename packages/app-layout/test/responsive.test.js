import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-app-layout.js';

describe('responsive', () => {
  describe('drawer', () => {
    let layout;

    describe('initial render', () => {
      it('should set content offset for drawer', () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: 200px;">
            <section slot="drawer">Drawer</section>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        expect(getComputedStyle(layout).paddingInlineStart).to.equal('200px');
      });

      it('should not set content offset for an empty drawer', () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: 200px;">
            <main>Content</main>
          </vaadin-app-layout>
        `);
        expect(getComputedStyle(layout).paddingInlineStart).to.equal('0px');
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
    });

    describe('slot change', () => {
      beforeEach(() => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: false; --vaadin-app-layout-drawer-width: 200px; --vaadin-app-layout-transition-duration: 0s;">
            <main>Content</main>
          </vaadin-app-layout>
        `);
      });

      it('should update content offset when drawer content changes', async () => {
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
    });

    describe('resize', () => {
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

      it('should toggle overlay mode when overlay property changes on resize', async () => {
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
        layout.style.width = '500px';
        await nextResize(layout);
        await nextFrame();
        expect(layout.overlay).to.be.true;
        expect(getComputedStyle(layout).paddingInlineStart).to.equal('0px');

        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
        layout.style.width = '600px';
        await nextResize(layout);
        await nextFrame();
        expect(layout.overlay).to.be.false;
        expect(getComputedStyle(layout).paddingInlineStart).to.equal('200px');
      });
    });
  });

  describe('touch-optimized: false', () => {
    let layout;

    describe('initial render', () => {
      it('should keep touch-optimized content in top navbar', () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: false;">
            <div slot="navbar touch-optimized">Navbar</div>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        expect(layout.querySelector('div').getAttribute('slot')).to.equal('navbar');
      });

      it('should set content offset for top navbar', () => {
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
    });

    describe('slot change', () => {
      let navbar;

      beforeEach(() => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: false; --vaadin-app-layout-transition-duration: 0s;">
            <main>Content</main>
          </vaadin-app-layout>
        `);
        navbar = layout.shadowRoot.querySelector('[part~="navbar-top"]');
      });

      it('should keep touch-optimized content in top navbar', async () => {
        const item = document.createElement('div');
        item.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(item);
        await aTimeout(0);
        expect(item.getAttribute('slot')).to.equal('navbar');
      });

      it('should update content offset when top navbar content changes', async () => {
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
    });

    describe('resize', () => {
      let item;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: false; --vaadin-app-layout-transition-duration: 0s;">
            <div slot="navbar touch-optimized" style="height: 100px;">Navbar</div>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        item = layout.querySelector('[slot="navbar"]');
        await nextResize(layout);
        await nextFrame();
      });

      it('should update content offset when top navbar height changes', async () => {
        const offset = parseInt(getComputedStyle(layout).paddingTop);
        item.style.height = '200px';
        await nextResize(layout);
        await nextFrame();
        expect(parseInt(getComputedStyle(layout).paddingTop)).to.equal(offset + 100);
      });

      it('should move touch-optimized content to bottom navbar when touch-optimized becomes true', async () => {
        const navbarTop = layout.shadowRoot.querySelector('[part~="navbar-top"]');
        const navbarBottom = layout.shadowRoot.querySelector('[part~="navbar-bottom"]');
        layout.style.setProperty('--vaadin-app-layout-touch-optimized', 'true');
        layout.style.width = '500px';
        await nextResize(layout);
        await nextFrame();
        expect(item.getAttribute('slot')).to.equal('navbar-bottom');
        expect(navbarTop.hasAttribute('hidden')).to.be.true;
        expect(navbarBottom.hasAttribute('hidden')).to.be.false;
        expect(getComputedStyle(layout).paddingTop).to.equal('0px');
        expect(parseFloat(getComputedStyle(layout).paddingBottom)).to.be.greaterThan(100);
      });
    });
  });

  describe('touch-optimized: true', () => {
    let layout;

    describe('initial render', () => {
      it('should move touch-optimized content to bottom navbar', () => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: true;">
            <div slot="navbar touch-optimized">Navbar</div>
            <main>Content</main>
          </vaadin-app-layout>
        `);
        expect(layout.querySelector('div').getAttribute('slot')).to.equal('navbar-bottom');
      });

      it('should set content offset for bottom navbar', () => {
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
    });

    describe('slot change', () => {
      let navbar;

      beforeEach(() => {
        layout = fixtureSync(`
          <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: true; --vaadin-app-layout-transition-duration: 0s;">
            <main>Content</main>
          </vaadin-app-layout>
        `);
        navbar = layout.shadowRoot.querySelector('[part~="navbar-bottom"]');
      });

      it('should move touch-optimized content to bottom navbar', async () => {
        const item = document.createElement('div');
        item.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(item);
        await aTimeout(0);
        expect(item.getAttribute('slot')).to.equal('navbar-bottom');
      });

      it('should set content offset when bottom navbar content is added', async () => {
        const item = document.createElement('div');
        item.setAttribute('slot', 'navbar touch-optimized');
        item.style.height = '100px';
        layout.appendChild(item);
        await aTimeout(0);
        expect(navbar.hasAttribute('hidden')).to.be.false;
        expect(parseFloat(getComputedStyle(layout).paddingBottom)).to.be.greaterThan(100);
      });
    });

    describe('resize', () => {
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

      it('should update content offset when bottom navbar height changes', async () => {
        const offset = parseInt(getComputedStyle(layout).paddingBottom);
        item.style.height = '200px';
        await nextResize(layout);
        await nextFrame();
        expect(parseInt(getComputedStyle(layout).paddingBottom)).to.equal(offset + 100);
      });

      it('should move touch-optimized content to top navbar when touch-optimized becomes false', async () => {
        const navbarTop = layout.shadowRoot.querySelector('[part~="navbar-top"]');
        const navbarBottom = layout.shadowRoot.querySelector('[part~="navbar-bottom"]');
        layout.style.setProperty('--vaadin-app-layout-touch-optimized', 'false');
        layout.style.width = '500px';
        await nextResize(layout);
        await nextFrame();
        expect(item.getAttribute('slot')).to.equal('navbar');
        expect(navbarTop.hasAttribute('hidden')).to.be.false;
        expect(navbarBottom.hasAttribute('hidden')).to.be.true;
        expect(parseFloat(getComputedStyle(layout).paddingTop)).to.be.greaterThan(100);
        expect(getComputedStyle(layout).paddingBottom).to.equal('0px');
      });
    });
  });
});
