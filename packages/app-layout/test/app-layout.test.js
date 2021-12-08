import { expect } from '@esm-bundle/chai';
import { aTimeout, esc, fixtureSync, nextFrame, nextRender, oneEvent } from '@vaadin/testing-helpers';
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
    let drawer, backdrop, toggle;

    async function fixtureLayout(layoutMode) {
      const overlayMode = String(layoutMode === 'mobile');

      layout = fixtureSync(`
        <vaadin-app-layout style="--vaadin-app-layout-drawer-overlay: ${overlayMode}; --vaadin-app-layout-transition: none;">
          <vaadin-drawer-toggle id="toggle" slot="navbar"></vaadin-drawer-toggle>
          <section slot="drawer">
            <p>Item 1</p>
            <p>Item 2</p>
            <p>Item 3</p>
          </section>
          <main>Page content</main>
        </vaadin-app-layout>
      `);
      await nextRender();
      toggle = layout.querySelector('#toggle');
      drawer = layout.$.drawer;
      backdrop = layout.$.backdrop;
    }

    describe('desktop layout', () => {
      beforeEach(async () => {
        await fixtureLayout('desktop');
      });

      it('should be opened by default', () => {
        expect(layout.drawerOpened).to.be.true;
      });

      it('should reflect drawerOpened property to the attribute', () => {
        layout.drawerOpened = false;
        expect(layout.hasAttribute('drawer-opened')).to.be.false;
        layout.drawerOpened = true;
        expect(layout.hasAttribute('drawer-opened')).to.be.true;
      });

      it('should toggle the drawer on toggle click', () => {
        toggle.click();
        expect(layout.drawerOpened).to.be.false;
        toggle.click();
        expect(layout.drawerOpened).to.be.true;
      });

      it('should fire "drawer-opened-changed" event on drawer opened toggle', () => {
        const spy = sinon.spy();
        layout.addEventListener('drawer-opened-changed', spy);
        layout.drawerOpened = false;
        expect(spy.calledOnce).to.be.true;
        layout.drawerOpened = true;
        expect(spy.calledTwice).to.be.true;
      });

      it('should hide drawer if corresponding slot has no content', () => {
        const section = layout.querySelector('[slot="drawer"]');
        section.parentNode.removeChild(section);
        layout._drawerChildObserver.flush();
        expect(drawer.hasAttribute('hidden')).to.be.true;
      });

      it('should not close the drawer on navigation event', () => {
        window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
        expect(layout.drawerOpened).to.be.true;
      });

      it('should not close the drawer on Escape press', () => {
        esc(drawer);
        expect(layout.drawerOpened).to.be.true;
      });
    });

    describe('mobile layout', () => {
      beforeEach(async () => {
        await fixtureLayout('mobile');
      });

      it('should be closed by default', () => {
        expect(layout.drawerOpened).to.be.false;
      });

      it('should reflect scrollHeight to a custom CSS property when the drawer has overflow', () => {
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

      it('should move focus to the drawer when opening the drawer', async () => {
        toggle.focus();
        layout.drawerOpened = true;
        await nextFrame();
        expect(layout.shadowRoot.activeElement).to.equal(drawer);
      });

      it('should move focus to the drawer after the opening animation completes', async () => {
        layout.style.setProperty('--vaadin-app-layout-transition', '100ms');
        toggle.focus();
        layout.drawerOpened = true;
        await nextFrame();
        expect(document.activeElement).to.equal(toggle);
        await oneEvent(drawer, 'transitionend');
        expect(layout.shadowRoot.activeElement).to.equal(drawer);
      });

      describe('opened', () => {
        beforeEach(async () => {
          layout.drawerOpened = true;
          await nextFrame();
        });

        it('should close the drawer on Escape press', () => {
          esc(drawer);
          expect(layout.drawerOpened).to.be.false;
        });

        it('should close the drawer on backdrop click', () => {
          backdrop.click();
          expect(layout.drawerOpened).to.be.false;
        });

        it('should close the drawer when calling helper method', () => {
          layout.constructor.dispatchCloseOverlayDrawerEvent();
          expect(layout.drawerOpened).to.be.false;
        });

        it('should close the drawer when dispatching custom event', () => {
          window.dispatchEvent(new CustomEvent('close-overlay-drawer'));
          expect(layout.drawerOpened).to.be.false;
        });

        it('should close the drawer on navigation event', () => {
          window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
          expect(layout.drawerOpened).to.be.false;
        });

        it('should move focus to the drawer toggle when closing the drawer', async () => {
          layout.drawerOpened = false;
          await nextFrame();
          expect(document.activeElement).to.equal(toggle);
        });

        it('should move focus to the drawer toggle after the closing animation completes', async () => {
          layout.style.setProperty('--vaadin-app-layout-transition', '100ms');
          layout.drawerOpened = false;
          await nextFrame();
          expect(layout.shadowRoot.activeElement).to.equal(drawer);
          await oneEvent(drawer, 'transitionend');
          expect(document.activeElement).to.equal(toggle);
        });
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
      await nextRender();
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
