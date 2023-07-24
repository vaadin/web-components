import { expect } from '@esm-bundle/chai';
import { fixtureSync, isIOS, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { createOverlay } from './helpers.js';

describe('vaadin-overlay', () => {
  describe('moving overlay', () => {
    let parent, overlay;

    beforeEach(async () => {
      parent = document.createElement('div');
      overlay = fixtureSync('<vaadin-overlay></vaadin-overlay>', parent);
      overlay.renderer = (root) => {
        root.textContent = 'overlay content';
      };
      await nextRender();
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
    });

    it('should move under document body when open', () => {
      expect(overlay.parentElement).to.eql(document.body);
    });

    it('should move back to original place after closing', async () => {
      overlay.opened = false;
      await nextRender();
      expect(overlay.parentElement).to.eql(parent);
    });
  });

  describe('pointer-events', () => {
    let overlay;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      await nextRender();
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
    });

    it('should not prevent clicking elements outside overlay when modeless (non-modal)', async () => {
      overlay.modeless = true;
      await nextRender();
      expect(document.body.style.pointerEvents).to.eql('');
    });

    it('should prevent clicking elements outside overlay when modal', () => {
      expect(document.body.style.pointerEvents).to.eql('none');
    });

    it('should not prevent clicking document elements after modal is closed', async () => {
      overlay.opened = false;
      await nextRender();
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
      overlay = createOverlay('overlay content');
      await nextRender();
      backdrop = overlay.$.backdrop;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
    });

    it('should set withBackdrop to false by default', () => {
      expect(overlay.withBackdrop).to.be.false;
    });

    it('should not show backdrop by default', () => {
      expect(backdrop.hidden).to.be.true;
    });

    it('should show backdrop when withBackdrop is true', async () => {
      overlay.withBackdrop = true;
      await nextRender();
      expect(backdrop.hidden).to.be.false;
    });

    it('should reflect withBackdrop property to attribute', async () => {
      overlay.withBackdrop = true;
      await nextRender();
      expect(overlay.hasAttribute('with-backdrop')).to.be.true;
    });
  });

  describe('position and sizing', () => {
    let overlay, overlayPart;

    beforeEach(async () => {
      overlay = createOverlay('overlay content');
      await nextRender();
      overlayPart = overlay.$.overlay;
      overlay.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
    });

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
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

    afterEach(async () => {
      overlay.opened = false;
      await nextRender();
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
