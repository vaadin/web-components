import { expect } from '@vaadin/chai-plugins';
import {
  aTimeout,
  esc,
  fixtureSync,
  makeSoloTouchEvent,
  nextFrame,
  nextRender,
  nextResize,
  oneEvent,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-app-layout.js';
import '../vaadin-drawer-toggle.js';

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

      it('should update content offset when navbar height changes', async () => {
        // Add content to navbar and measure original offset
        const navbarContent = document.createElement('div');
        navbarContent.style.height = '100px';
        navbarContent.setAttribute('slot', 'navbar');
        layout.appendChild(navbarContent);
        await nextResize(layout);
        const initialOffset = parseInt(getComputedStyle(layout).getPropertyValue('padding-top'));
        expect(initialOffset).to.be.greaterThan(0);
        // Increase navbar content size and measure increase
        navbarContent.style.height = '200px';
        await nextResize(layout);
        const updatedOffset = parseInt(getComputedStyle(layout).getPropertyValue('padding-top'));
        expect(updatedOffset).to.equal(initialOffset + 100);
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

      it('should not show empty navbar-bottom on resize', () => {
        expect(layout.$.navbarBottom.hasAttribute('hidden')).to.be.true;
        window.dispatchEvent(new Event('resize'));
        expect(layout.$.navbarBottom.hasAttribute('hidden')).to.be.true;
      });

      it('should remove hidden attribute on non-empty navbar-bottom on resize', () => {
        const header = document.createElement('h1');
        header.textContent = 'Header';
        header.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(header);
        expect(layout.$.navbarBottom.hasAttribute('hidden')).to.be.true;
        window.dispatchEvent(new Event('resize'));
        expect(layout.$.navbarBottom.hasAttribute('hidden')).to.be.false;
      });

      it('should update content offset when navbar height changes', async () => {
        // Add content to navbar and measure original offset
        const navbarContent = document.createElement('div');
        navbarContent.style.height = '100px';
        navbarContent.setAttribute('slot', 'navbar touch-optimized');
        layout.appendChild(navbarContent);
        await nextResize(layout);
        const initialOffset = parseInt(getComputedStyle(layout).getPropertyValue('padding-bottom'));
        expect(initialOffset).to.be.greaterThan(0);
        // Increase navbar content size and measure increase
        navbarContent.style.height = '200px';
        await nextResize(layout);
        const updatedOffset = parseInt(getComputedStyle(layout).getPropertyValue('padding-bottom'));
        expect(updatedOffset).to.equal(initialOffset + 100);
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
      drawer = layout.shadowRoot.querySelector('[part=drawer]');
      backdrop = layout.shadowRoot.querySelector('[part=backdrop]');
      // Wait for the initial resize observer callback
      await nextResize(layout);
      await nextFrame();
    }

    describe('desktop layout', () => {
      beforeEach(async () => {
        await fixtureLayout('desktop');
      });

      it('should be opened by default', () => {
        expect(layout.drawerOpened).to.be.true;
      });

      it('should have the CSS visibility set to visible by default', () => {
        expect(getComputedStyle(drawer).visibility).to.equal('visible');
      });

      it('should toggle the CSS visibility on drawerOpened property toggle', () => {
        layout.drawerOpened = false;
        expect(getComputedStyle(drawer).visibility).to.equal('hidden');
        layout.drawerOpened = true;
        expect(getComputedStyle(drawer).visibility).to.equal('visible');
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

      it('should fire "drawer-opened-changed" event on drawerOpened property toggle', () => {
        const spy = sinon.spy();
        layout.addEventListener('drawer-opened-changed', spy);
        layout.drawerOpened = false;
        expect(spy.calledOnce).to.be.true;
        layout.drawerOpened = true;
        expect(spy.calledTwice).to.be.true;
      });

      it('should hide/unhide drawer if corresponding slot depending on the number of content', async () => {
        const section = layout.querySelector('[slot="drawer"]');
        const initialPadding = getComputedStyle(layout).paddingInlineStart;
        section.parentNode.removeChild(section);
        await nextFrame();

        expect(drawer.hasAttribute('hidden')).to.be.true;
        expect(getComputedStyle(layout).paddingInlineStart).to.be.equal('0px');

        layout.appendChild(section);
        await nextFrame();

        expect(drawer.hasAttribute('hidden')).to.be.false;
        expect(getComputedStyle(layout).paddingInlineStart).to.be.equal(initialPadding);
      });

      it('should not close the drawer on navigation event', () => {
        window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
        expect(layout.drawerOpened).to.be.true;
      });

      it('should not close the drawer on Escape press', () => {
        esc(drawer);
        expect(layout.drawerOpened).to.be.true;
      });

      it('should not close the drawer on global Escape press', () => {
        esc(document.body);
        expect(layout.drawerOpened).to.be.true;
      });

      it('should set aria-expanded on the toggle to true by default', () => {
        expect(toggle.getAttribute('aria-expanded')).to.equal('true');
        layout.drawerOpened = true;
        expect(getComputedStyle(drawer).visibility).to.equal('visible');
      });

      it('should update aria-expanded on drawerOpened property change', () => {
        layout.drawerOpened = false;
        expect(toggle.getAttribute('aria-expanded')).to.equal('false');
        layout.drawerOpened = true;
        expect(toggle.getAttribute('aria-expanded')).to.equal('true');
      });

      it('should only update offset size once during the drawer transition', async () => {
        layout.primarySection = 'drawer';
        await nextResize(layout);
        await nextRender();

        layout.style.setProperty('--vaadin-app-layout-transition', '100ms');

        const spy = sinon.spy(layout, '_updateOffsetSize');
        toggle.click();
        await oneEvent(drawer, 'transitionend');

        expect(spy.callCount).to.be.equal(1);
        await nextFrame();

        expect(spy.callCount).to.be.equal(1);
      });

      it('should use the drawer width as offset width', async () => {
        fixtureSync(`
          <style>
            vaadin-app-layout::part(drawer) {
              width: 100px;
            }
          </style>
        `);

        await nextRender();
        const { width } = layout.$.drawer.getBoundingClientRect();

        expect(width).to.be.equal(100);
      });

      it('should update content offset when drawer width changes', async () => {
        // Disable border to not affect measurement
        fixtureSync(`
          <style>
            vaadin-app-layout::part(drawer) {
              border: none;
            }
          </style>
        `);

        // Allow drawer size based on content
        layout.style.setProperty('--vaadin-app-layout-drawer-width', 'auto');
        const drawerContent = document.querySelector('section[slot="drawer"]');
        drawerContent.style.width = '200px';
        await nextResize(layout);
        await nextRender();
        const initialOffset = parseInt(getComputedStyle(layout).getPropertyValue('padding-inline-start'));
        expect(initialOffset).to.equal(200);
        // Decrease drawer content size and measure decrease
        drawerContent.style.width = '100px';
        await nextResize(layout);
        await nextRender();
        const updatedOffset = parseInt(getComputedStyle(layout).getPropertyValue('padding-inline-start'));
        expect(updatedOffset).to.equal(100);
      });
    });

    describe('mobile layout', () => {
      beforeEach(async () => {
        await fixtureLayout('mobile');
      });

      it('should be closed by default', () => {
        expect(layout.drawerOpened).to.be.false;
      });

      it('should have the CSS visibility set to hidden by default', () => {
        expect(getComputedStyle(drawer).visibility).to.equal('hidden');
      });

      it('should toggle the CSS visibility on drawerOpened property toggle', () => {
        layout.drawerOpened = true;
        expect(getComputedStyle(drawer).visibility).to.equal('visible');
        layout.drawerOpened = false;
        expect(getComputedStyle(drawer).visibility).to.equal('hidden');
      });

      it('should not change tabindex attribute on consecutive drawer open/close', async () => {
        const spy = sinon.spy();
        new MutationObserver(spy).observe(drawer, { attributes: true, attributeFilter: ['tabindex'] });
        layout.drawerOpened = true;
        layout.drawerOpened = false;
        await nextFrame();
        expect(spy.called).to.be.false;
      });

      it('should keep drawer state when it resizes to overlay mode and back', () => {
        // Force it to desktop layout
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
        layout.drawerOpened = true;
        layout._updateOverlayMode();

        // Force it to mobile layout
        layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'true');
        layout._updateOverlayMode();

        expect(layout.drawerOpened).to.be.false;

        // Force it to desktop layout
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

      it('should update aria-label attribute on the drawer on i18n.drawer property change', () => {
        layout.i18n = { ...layout.i18n, drawer: 'New Value' };
        expect(drawer.getAttribute('aria-label')).to.equal('New Value');
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

        it('should close the drawer on global Escape press', () => {
          esc(document.body);
          expect(layout.drawerOpened).to.be.false;
        });

        it('should close the drawer on backdrop click', () => {
          backdrop.click();
          expect(layout.drawerOpened).to.be.false;
        });

        it('should close the drawer on backdrop touchend', () => {
          makeSoloTouchEvent('touchend', null, backdrop);
          expect(layout.drawerOpened).to.be.false;
        });

        it('should prevent touchend event on backdrop', () => {
          const event = makeSoloTouchEvent('touchend', null, backdrop);
          expect(event.defaultPrevented).to.be.true;
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

        it('should not call focus() on the drawer toggle on consecutive drawer close/open', async () => {
          const spy = sinon.spy(toggle, 'focus');
          layout.drawerOpened = false;
          layout.drawerOpened = true;
          await nextFrame();
          expect(spy.called).to.be.false;
        });

        it('should remove drawer tabindex when it resizes from the overlay mode', async () => {
          expect(drawer.hasAttribute('tabindex')).to.be.true;

          // Force it to desktop layout
          layout.style.setProperty('--vaadin-app-layout-drawer-overlay', 'false');
          layout._updateOverlayMode();
          await nextRender();

          expect(drawer.hasAttribute('tabindex')).to.be.false;
        });
      });
    });
  });
});
