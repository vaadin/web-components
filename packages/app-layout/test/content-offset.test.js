import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
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
});
