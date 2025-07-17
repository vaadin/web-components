import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, isIOS, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { Overlay } from '../src/vaadin-overlay.js';
import { createOverlay } from './helpers.js';

describe('vaadin-overlay', () => {
  describe('vaadin-overlay-open event', () => {
    let overlay, spy;

    beforeEach(() => {
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>');
      overlay.renderer = (root) => {
        root.textContent = 'overlay content';
      };
      spy = sinon.spy();
      overlay.addEventListener('vaadin-overlay-open', spy);
    });

    afterEach(() => {
      overlay.opened = false;
    });

    it('should fire when after a delay when setting opened property to true', async () => {
      overlay.opened = true;
      await nextFrame();
      await aTimeout(0);
      expect(spy).to.be.calledOnce;
    });

    it('should not fire when immediately setting opened property back to false', async () => {
      overlay.opened = true;
      overlay.opened = false;
      await nextFrame();
      await aTimeout(0);
      expect(spy).to.not.be.called;
    });
  });

  describe('moving overlay', () => {
    let parent, overlay;

    beforeEach(async () => {
      parent = document.createElement('div');
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>', parent);
      overlay.renderer = (root) => {
        root.textContent = 'overlay content';
      };
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
      overlay = createOverlay('overlay content');
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

  describe('modeless', () => {
    let overlay, owner;

    beforeEach(() => {
      overlay = createOverlay('overlay content');
      owner = document.createElement('div');
      overlay.owner = owner;
    });

    it('should reflect modeless to owner', () => {
      overlay.modeless = true;
      expect(owner.hasAttribute('modeless')).to.be.true;

      overlay.modeless = false;
      expect(owner.hasAttribute('modeless')).to.be.false;

      overlay.modeless = undefined;
      expect(owner.hasAttribute('modeless')).to.be.false;
    });
  });

  describe('backdrop', () => {
    let overlay, backdrop, owner;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      owner = document.createElement('div');
      overlay.owner = owner;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      backdrop = overlay.$.backdrop;
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

    it('should reflect withBackdrop to owner', () => {
      overlay.withBackdrop = true;
      expect(owner.hasAttribute('with-backdrop')).to.be.true;

      overlay.withBackdrop = false;
      expect(owner.hasAttribute('with-backdrop')).to.be.false;

      overlay.withBackdrop = undefined;
      expect(owner.hasAttribute('with-backdrop')).to.be.false;
    });
  });

  describe('position and sizing', () => {
    let overlay, overlayPart;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      overlayPart = overlay.$.overlay;
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
      overlay.textContent = 'foo';

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

  (isIOS ? describe : describe.skip)('iOS incorrect viewport height workaround', () => {
    let overlay;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
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

  describe('disconnected', () => {
    customElements.define(
      'overlay-wrapper',
      class extends HTMLElement {
        constructor() {
          super();

          this.attachShadow({ mode: 'open' });

          const overlay = document.createElement('wrapped-overlay');
          this.overlay = overlay;

          // Forward the slotted content from wrapper to overlay
          const slot = document.createElement('slot');
          overlay.appendChild(slot);

          overlay.renderer = (root) => {
            root.innerHTML = '<input placeholder="Input">';
          };

          this.shadowRoot.append(overlay);
        }

        get opened() {
          return this.overlay.opened;
        }

        set opened(opened) {
          this.overlay.opened = opened;
        }

        connectedCallback() {
          const root = document.createElement('div');
          this.overlay.__customRoot = root;
          this.append(root);
        }

        disconnectedCallback() {
          this.opened = false;
        }
      },
    );

    customElements.define(
      'wrapped-overlay',
      class extends Overlay {
        get _contentRoot() {
          return this.__customRoot;
        }

        _attachOverlay() {
          this.setAttribute('popover', 'manual');
          this.showPopover();
        }

        _detachOverlay() {
          this.hidePopover();
        }
      },
    );

    let owner, overlay;

    beforeEach(() => {
      owner = document.createElement('overlay-wrapper');
      document.body.appendChild(owner);
      overlay = owner.shadowRoot.querySelector('wrapped-overlay');
    });

    it('should not call overlay opening when overlay is disconnected', async () => {
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');

      const spy = sinon.spy(overlay, '_attachOverlay');

      owner.remove();
      owner.opened = true;

      expect(spy.called).to.be.false;
    });
  });
});
