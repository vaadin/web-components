import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-app-layout.js';
import '../vaadin-drawer-toggle.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior';
import { PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

describe('vaadin-app-layout', () => {
  let layout;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      layout = fixtureSync('<vaadin-app-layout></vaadin-app-layout>');
      tagName = layout.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('primarySection', () => {
    beforeEach(() => {
      layout = fixtureSync('<vaadin-app-layout></vaadin-app-layout>');
    });

    it('should be set to navbar by default', () => {
      expect(layout.primarySection).to.equal('navbar');
    });

    it('should reflect to primary-section attribute', () => {
      expect(layout.getAttribute('primary-section')).to.equal('navbar');
    });

    it('should fire "primary-section-changed" event when property changes', () => {
      const spy = sinon.spy();
      layout.addEventListener('primary-section-changed', spy);
      layout.primarySection = 'drawer';
      expect(spy.calledOnce).to.be.true;
    });

    it('should fallback to navbar if invalid "primarySection" is set', () => {
      layout.primarySection = 'foobar';
      expect(layout.primarySection).to.equal('navbar');
    });
  });

  describe('navbar', () => {
    beforeEach(() => {
      layout = fixtureSync('<vaadin-app-layout></vaadin-app-layout>');
    });

    describe('default', () => {
      beforeEach(() => {
        layout.style.setProperty('--vaadin-app-layout-touch-optimized', 'false');
      });

      it('should move added node to navbar', async () => {
        const toggle = document.createElement('vaadin-drawer-toggle');
        toggle.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(toggle);
        await aTimeout(0);
        expect(toggle.getAttribute('slot')).to.equal('navbar');
      });

      it('should make node added to navbar visible', async () => {
        const toggle = document.createElement('vaadin-drawer-toggle');
        toggle.setAttribute('slot', 'navbar');
        layout.appendChild(toggle);
        await aTimeout(0);
        expect(toggle.offsetHeight).to.be.greaterThan(0);
      });
    });

    describe('touch-optimized', () => {
      beforeEach(() => {
        layout.style.setProperty('--vaadin-app-layout-touch-optimized', 'true');
      });

      it('should move added node to navbar-bottom', async () => {
        const toggle = document.createElement('vaadin-drawer-toggle');
        toggle.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(toggle);
        await aTimeout(0);
        expect(toggle.getAttribute('slot')).to.equal('navbar-bottom');
      });

      it('should make node added to navbar-bottom visible', async () => {
        const toggle = document.createElement('vaadin-drawer-toggle');
        toggle.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(toggle);
        await aTimeout(0);
        expect(toggle.offsetHeight).to.be.greaterThan(0);
      });

      it('should remove hidden attribute on navbar-bottom on resize', async () => {
        expect(layout.$.navbarBottom.hasAttribute('hidden')).to.be.true;
        window.dispatchEvent(new Event('resize'));
        expect(layout.$.navbarBottom.hasAttribute('hidden')).to.be.false;
      });
    });
  });

  describe('drawer', () => {
    let drawer;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <h2 slot="navbar">App name</h2>
          <section slot="drawer">
            <p>Item 1</p>
            <p>Item 2</p>
            <p>Item 3</p>
          </section>
          <main>Page content</main>
        </vaadin-app-layout>
      `);
      await nextFrame();
      drawer = layout.$.drawer;
    });

    it('should reflect to drawer-opened attribute', () => {
      layout.drawerOpened = true;
      expect(layout.hasAttribute('drawer-opened')).to.be.true;
    });

    it('should toggle drawer on vaadin-drawer-toggle click', () => {
      const toggle = layout.querySelector('vaadin-drawer-toggle');
      const currentDrawerState = layout.drawerOpened;
      toggle.click();
      expect(layout.drawerOpened).to.be.not.equal(currentDrawerState);
    });

    it('should fire "drawer-opened-changed" event when property changes', () => {
      layout.drawerOpened = false;
      const spy = sinon.spy();
      layout.addEventListener('drawer-opened-changed', spy);
      layout.drawerOpened = true;
      expect(spy.calledOnce).to.be.true;
    });

    it('should hide drawer if corresponding slot has no content', () => {
      const section = layout.querySelector('[slot="drawer"]');
      section.parentNode.removeChild(section);
      layout._drawerChildObserver.flush();
      expect(drawer.hasAttribute('hidden')).to.be.true;
    });

    it('should not close on navigation event when not in overlay mode', () => {
      // force it to desktop layout
      layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
      layout._updateOverlayMode();
      layout.drawerOpened = true;
      window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
      expect(layout.drawerOpened).to.be.true;
    });

    describe('overlay mode', () => {
      beforeEach(() => {
        // force overlay=true to show backdrop
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
        layout._updateOverlayMode();
      });

      it('should close drawer when backdrop is clicked', () => {
        layout.drawerOpened = true;
        const backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
        backdrop.click();
        expect(layout.drawerOpened).to.be.false;
      });

      it('should close drawer when calling helper method', () => {
        layout.drawerOpened = true;
        layout.constructor.dispatchCloseOverlayDrawerEvent();
        expect(layout.drawerOpened).to.be.false;
      });

      it('should close drawer when dispatching custom event', () => {
        layout.drawerOpened = true;
        window.dispatchEvent(new CustomEvent('close-overlay-drawer'));
        expect(layout.drawerOpened).to.be.false;
      });

      it('should set custom CSS property to scrollHeight when drawer has overflow', () => {
        const drawer = layout.$.drawer;
        drawer.style.height = '50px';
        layout.drawerOpened = true;
        const height = getComputedStyle(layout).getPropertyValue('--_vaadin-app-layout-drawer-scroll-size');
        expect(height).to.equal(`${drawer.scrollHeight}px`);
      });

      it('should keep drawer state when it resizes to overlay mode and back', () => {
        // force it to desktop layout
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
        layout.drawerOpened = true;
        layout._updateOverlayMode();

        // force it to mobile layout
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
        layout._updateOverlayMode();

        expect(layout.drawerOpened).to.be.false;

        // force it to desktop layout
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
        layout._updateOverlayMode();
        expect(layout.drawerOpened).to.be.true;
      });

      it('should close on navigation event when in overlay mode', () => {
        layout.drawerOpened = true;
        window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
        expect(layout.drawerOpened).to.be.false;
      });

      it('should only close on custom navigation event when in overlay mode', () => {
        layout.drawerOpened = true;
        layout.closeDrawerOn = 'foo-bar';
        window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
        expect(layout.drawerOpened).to.be.true;
        window.dispatchEvent(new CustomEvent('foo-bar'));
        expect(layout.drawerOpened).to.be.false;
      });
    });
  });

  describe('notify children about resize', () => {
    class ResizeAwareElement extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
      static get is() {
        return 'resize-aware';
      }
    }

    customElements.define(ResizeAwareElement.is, ResizeAwareElement);

    let resizeAwareChild;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <h2 slot="navbar">App name</h2>
          <section slot="drawer">
            <p>Item 1</p>
            <p>Item 2</p>
            <p>Item 3</p>
          </section>
          <resize-aware></resize-aware>
        </vaadin-app-layout>
      `);
      // force non-overlay mode as default
      layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
      layout._updateOverlayMode();
      await nextFrame();
      resizeAwareChild = layout.querySelector('resize-aware');
      sinon.stub(resizeAwareChild, 'notifyResize');
    });

    afterEach(() => {
      resizeAwareChild.notifyResize.restore();
    });

    it('should notify when drawer opens or closes', () => {
      layout.drawerOpened = false;
      expect(resizeAwareChild.notifyResize.calledOnce).to.be.true;

      resizeAwareChild.notifyResize.resetHistory();
      layout.drawerOpened = true;
      expect(resizeAwareChild.notifyResize.calledOnce).to.be.true;
    });

    it('should notify when drawer is hidden due to empty content', () => {
      const section = layout.querySelector('[slot="drawer"]');
      section.parentNode.removeChild(section);
      layout._drawerChildObserver.flush();

      expect(resizeAwareChild.notifyResize.calledOnce).to.be.true;
    });

    it('should notify when content is added to drawer', () => {
      const newContent = document.createElement('div');
      newContent.setAttribute('slot', 'drawer');
      layout.appendChild(newContent);
      layout._drawerChildObserver.flush();

      expect(resizeAwareChild.notifyResize.calledOnce).to.be.true;
    });

    it('should notify when switching between regular and overlay mode', () => {
      // force overlay mode
      layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
      layout._updateOverlayMode();

      expect(resizeAwareChild.notifyResize.calledOnce).to.be.true;

      // remove overlay mode
      resizeAwareChild.notifyResize.resetHistory();
      layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
      layout._updateOverlayMode();

      expect(resizeAwareChild.notifyResize.calledOnce).to.be.true;
    });
  });
});
