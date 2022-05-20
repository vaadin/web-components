import { expect } from '@esm-bundle/chai';
import { click, enterKeyDown, escKeyDown, fixtureSync, mousedown, mouseup, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/text-field/vaadin-text-field.js';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

customElements.define(
  'overlay-wrapper',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-overlay id="overlay" opened="[[opened]]">
          <template> overlay content </template>
        </vaadin-overlay>
      `;
    }

    static get properties() {
      return {
        opened: Boolean,
      };
    }
  },
);

describe('vaadin-overlay', () => {
  describe('moving overlay', () => {
    let parent, overlay;

    beforeEach(async () => {
      parent = fixtureSync(`
        <div id="parent">
          <vaadin-overlay>
            <template>
              overlay-content
            </template>
          </vaadin-overlay>
        </div>
      `);
      overlay = parent.children[0];
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should move under document body when open', () => {
      expect(overlay.parentElement).to.eql(document.body);
    });

    it('should move back to original place after closing', () => {
      overlay.opened = false;

      expect(overlay.parentElement).to.eql(parent);
    });
  });

  describe('pointer-events', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            overlay-content
          </template>
        </vaadin-overlay>
      `);
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not prevent clicking elements outside overlay when modeless (non-modal)', () => {
      overlay.modeless = true;
      expect(document.body.style.pointerEvents).to.eql('');
    });

    it('should prevent clicking elements outside overlay when modal', () => {
      expect(document.body.style.pointerEvents).to.eql('none');
    });

    it('should not prevent clicking document elements after modal is closed', () => {
      overlay.opened = false;
      expect(document.body.style.pointerEvents).to.eql('');
    });

    it('should allow pointer events on the overlayPart while skipping on the host', () => {
      expect(getComputedStyle(overlay.$.overlay).pointerEvents).to.equal('auto');
      expect(getComputedStyle(overlay).pointerEvents).to.equal('none');
    });
  });

  describe('backdrop', () => {
    let overlay, backdrop;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            overlay-content
          </template>
        </vaadin-overlay>
      `);
      backdrop = overlay.$.backdrop;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should set withBackdrop to false by default', () => {
      expect(overlay.withBackdrop).to.be.false;
    });

    it('should not show backdrop by default', () => {
      expect(backdrop.hidden).to.be.true;
    });

    it('should show backdrop when withBackdrop is true', () => {
      overlay.withBackdrop = true;

      expect(backdrop.hidden).to.be.false;
    });

    it('should reflect withBackdrop property to attribute', () => {
      overlay.withBackdrop = true;

      expect(overlay.hasAttribute('with-backdrop')).to.be.true;
    });
  });

  describe('Esc', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            overlay-content
          </template>
        </vaadin-overlay>
      `);
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should close on Esc', () => {
      escKeyDown(document.body);

      expect(overlay.opened).to.be.false;
    });

    it('should fire the vaadin-overlay-escape-press event when Esc pressed', async () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      escKeyDown(document.body);

      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire the vaadin-overlay-escape-press event other key pressed', async () => {
      const spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-escape-press', spy);

      enterKeyDown(document.body);

      expect(spy.called).to.be.false;
    });

    it('should not close on esc if vaadin-overlay-escape-press event was prevented', () => {
      overlay.addEventListener('vaadin-overlay-escape-press', (e) => e.preventDefault());

      escKeyDown(document.body);

      expect(overlay.opened).to.be.true;
    });
  });

  describe('click', () => {
    let parent, overlay, overlayPart, backdrop;

    beforeEach(async () => {
      parent = fixtureSync(`
        <div id="parent">
          <vaadin-overlay>
            <template>
              overlay-content
            </template>
          </vaadin-overlay>
        </div>
      `);
      overlay = parent.children[0];
      overlayPart = overlay.$.overlay;
      backdrop = overlay.$.backdrop;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    describe('close on click', () => {
      it('should not close on inside click', () => {
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });

      it('should close on outside click', () => {
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should close on backdrop click', () => {
        overlay.withBackdrop = true;

        click(backdrop);

        expect(overlay.opened).to.be.false;
      });
    });

    describe('vaadin-overlay-outside-click event', () => {
      it('should fire the vaadin-overlay-outside-click event on outside click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(parent);

        expect(spy.calledOnce).to.be.true;
      });

      it('should fire the vaadin-overlay-outside-click event on backdrop click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        overlay.withBackdrop = true;
        click(backdrop);

        expect(spy.calledOnce).to.be.true;
      });

      it('should not fire the vaadin-overlay-outside-click event on inside click', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-outside-click', spy);

        click(overlayPart);

        expect(spy.called).to.be.false;
      });

      it('should not close on outside click if vaadin-overlay-outside-click event was prevented', () => {
        overlay.addEventListener('vaadin-overlay-outside-click', (e) => e.preventDefault());

        click(parent);

        expect(overlay.opened).to.be.true;
      });

      it('should not close on backdrop click if vaadin-overlay-outside-click event was prevented', () => {
        overlay.addEventListener('vaadin-overlay-outside-click', (e) => e.preventDefault());

        click(backdrop);

        expect(overlay.opened).to.be.true;
      });
    });

    describe('vaadin-overlay-close event', () => {
      it('should prevent closing the overlay when preventing vaadin-overlay-close', (done) => {
        overlay.addEventListener('vaadin-overlay-close', (e) => {
          e.preventDefault();

          setTimeout(() => {
            expect(overlay.opened).to.be.true;
            done();
          }, 1);
        });
        click(parent);
      });
    });

    describe('vaadin-overlay-closing event', () => {
      it('should dispatch vaadin-overlay-closing when the overlay is closing', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', spy);
        click(parent);
        expect(spy.calledOnce).to.be.true;
      });

      it('should not dispatch vaadin-overlay-closing when preventing vaadin-overlay-close', () => {
        const spy = sinon.spy();
        overlay.addEventListener('vaadin-overlay-closing', spy);
        overlay.addEventListener('vaadin-overlay-close', (e) => e.preventDefault());
        click(parent);
        expect(spy.called).to.be.false;
      });
    });

    describe('moving mouse pointer during click', () => {
      it('should close if both mousedown and mouseup outside', () => {
        mousedown(parent);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should not close if mousedown outside and mouseup inside', () => {
        mousedown(parent);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });

      it('should not close if mousedown inside and mouseup outside', () => {
        mousedown(overlayPart);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.true;
      });

      it('should not close if both mousedown mouseup inside', () => {
        mousedown(overlayPart);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });
    });

    describe('mouseup after contextmenu event opening', () => {
      // On some platforms, contextmenu event is dispatched right on
      // mousedown, before mouseup. If the contextmenu event opens
      // the overlay, then one contextmenu-related mouseup event also occurs.

      it('should close on outside click after mouseup inside', () => {
        // Assume the overlay was opened on contextmenu event
        mouseup(overlayPart);

        mousedown(parent);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should close on outside click after mouseup outside', () => {
        // Assume the overlay was opened on contextmenu event,
        // but this time the cursor was moved outside before mouseup
        mouseup(parent);

        mousedown(parent);
        mouseup(parent);
        click(parent);

        expect(overlay.opened).to.be.false;
      });

      it('should not close on inside click after mouseup inside', () => {
        mouseup(overlayPart);

        mousedown(overlayPart);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });

      it('should not close on outside click after mouseup outside', () => {
        mouseup(parent);

        mousedown(overlayPart);
        mouseup(overlayPart);
        click(overlayPart);

        expect(overlay.opened).to.be.true;
      });
    });
  });

  describe('position and sizing', () => {
    let overlay, overlayPart;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            <div>overlay-content</div>
          </template>
        </vaadin-overlay>
      `);
      overlayPart = overlay.$.overlay;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should fit in the viewport by default', () => {
      const rect = overlay.getBoundingClientRect();
      expect(rect.left).to.be.gte(0);
      expect(rect.top).to.be.gte(0);
      expect(rect.right).to.be.lte(document.documentElement.clientWidth);
      expect(rect.bottom).to.be.lte(document.documentElement.clientHeight);
    });

    it('should fit in viewport when huge content is used', () => {
      const lastChild = overlay.lastElementChild;
      lastChild.setAttribute('style', 'display: block; width: 2000px; height: 2000px;');

      const rect = overlay.getBoundingClientRect();
      expect(rect.left).to.be.gte(0);
      expect(rect.top).to.be.gte(0);
      expect(rect.right).to.be.lte(document.documentElement.clientWidth);
      expect(rect.bottom).to.be.lte(document.documentElement.clientHeight);
    });

    it('should fit overlayPart in overlay', () => {
      const overlayRect = overlay.getBoundingClientRect();
      const overlayPartRect = overlayPart.getBoundingClientRect();

      expect(overlayPartRect.left).to.be.gte(overlayRect.left);
      expect(overlayPartRect.top).to.be.gte(overlayRect.top);
      expect(overlayPartRect.right).to.be.lte(overlayRect.right);
      expect(overlayPartRect.bottom).to.be.lte(overlayRect.bottom);
    });

    it('should center overlayPart in overlay with flex by default', () => {
      // The “default” fixture content is too large to test this
      overlay.content.textContent = 'foo';

      const overlayRect = overlay.getBoundingClientRect();
      const overlayPartRect = overlayPart.getBoundingClientRect();

      const halfWidthDifference = (overlayRect.width - overlayPartRect.width) / 2;
      const halfHeightDifference = (overlayRect.height - overlayPartRect.height) / 2;

      // Should not stretch the overlayPart in the overlay
      expect(halfWidthDifference).to.be.gte(0);
      expect(halfHeightDifference).to.be.gte(0);

      expect(overlayPartRect.left - overlayRect.left).to.be.closeTo(halfWidthDifference, 1);
      expect(overlayRect.right - overlayPartRect.right).to.be.closeTo(halfWidthDifference, 1);
      expect(overlayPartRect.top - overlayRect.top).to.be.closeTo(halfHeightDifference, 1);
      expect(overlayRect.bottom - overlayPartRect.bottom).to.be.closeTo(halfHeightDifference, 1);
    });

    it('should make overlayPart scrollable by setting overflow to auto', () => {
      expect(getComputedStyle(overlayPart).overflow).to.equal('auto');
    });
  });

  describe('wrapped overlay', () => {
    let overlay, parent;

    beforeEach(async () => {
      parent = fixtureSync(`
        <div id="parent">
          <vaadin-overlay>
            <template>
              <overlay-wrapper></-wrapper>
            </template>
          </vaadin-overlay>
        </div>
      `);
      overlay = parent.children[0];
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should not exit modal state when opened changes from undefined to false', () => {
      const wrapper = overlay.content.querySelector('overlay-wrapper');
      const inner = wrapper.shadowRoot.querySelector('vaadin-overlay');
      const spy = sinon.spy(inner, '_exitModalState');
      wrapper.opened = false;
      expect(spy.called).to.be.false;
    });
  });

  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  (iOS ? describe : describe.skip)('iOS incorrect viewport height workaround', () => {
    let overlay;

    beforeEach(async () => {
      overlay = fixtureSync(`
        <vaadin-overlay>
          <template>
            overlay-content
          </template>
        </vaadin-overlay>
      `);
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should set value to bottom when landscape and clientHeight > innerHeight', () => {
      // NOTE(web-padawan): have to use stubs to emulate the landscape mode.
      const clientHeight = sinon.stub(document.documentElement, 'clientHeight').get(() => 200);
      const innerHeight = sinon.stub(window, 'innerHeight').get(() => 175);
      const innerWidth = sinon.stub(window, 'innerWidth').get(() => 300);

      overlay._detectIosNavbar();
      expect(getComputedStyle(overlay).getPropertyValue('--vaadin-overlay-viewport-bottom')).to.be.ok;

      clientHeight.restore();
      innerHeight.restore();
      innerWidth.restore();
    });

    it('should apply the workaround on open', () => {
      overlay.opened = false;
      sinon.spy(overlay, '_detectIosNavbar');
      overlay.opened = true;
      expect(overlay._detectIosNavbar.called).to.be.true;
      overlay._detectIosNavbar.restore();
    });

    it('should apply the workaround on resize', () => {
      sinon.spy(overlay, '_detectIosNavbar');
      window.dispatchEvent(new CustomEvent('resize'));
      expect(overlay._detectIosNavbar.called).to.be.true;
      overlay._detectIosNavbar.restore();
    });
  });
});
