import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('detail overlay mode', () => {
  describe('drawer', () => {
    let layout, detail, backdrop;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 400px;">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await nextRender();
      await nextResize(layout);
      detail = layout.shadowRoot.querySelector('[part="detail"]');
      backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
    });

    it('should use sticky positioning and show backdrop in drawer mode', () => {
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('sticky');
      expect(getComputedStyle(backdrop).display).to.equal('block');
    });

    it('should set detail width to detailSize in drawer mode', () => {
      expect(getComputedStyle(detail).width).to.equal('300px');
    });

    it('should update detail width when detailSize changes in drawer mode', () => {
      layout.detailSize = '600px';
      expect(getComputedStyle(detail).width).to.equal('600px');
    });

    it('should switch to drawer mode when detail is added to a narrow layout', async () => {
      const detailContent = layout.querySelector('[slot="detail"]');
      detailContent.remove();
      await nextRender();
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.appendChild(detailContent);
      await nextRender();
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('sticky');
    });
  });

  describe('full', () => {
    let layout, detail, backdrop;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout
          master-size="300px"
          detail-size="300px"
          detail-overlay-mode="full"
          style="width: 400px;"
        >
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await nextRender();
      await nextResize(layout);
      detail = layout.shadowRoot.querySelector('[part="detail"]');
      backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
    });

    it('should set overflow when columns do not fit', () => {
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should show backdrop in full mode', () => {
      expect(getComputedStyle(backdrop).display).to.equal('block');
    });

    it('should make detail cover the full layout width', () => {
      expect(detail.offsetWidth).to.be.at.least(layout.offsetWidth);
    });

    it('should make detail cover the full layout height', () => {
      expect(detail.offsetHeight).to.equal(layout.offsetHeight);
    });

    it('should use negative margin to shift detail over master area', () => {
      const marginStart = getComputedStyle(detail).marginInlineStart;
      expect(parseFloat(marginStart)).to.be.below(0);
    });

    it('should switch back to split mode when layout size is increased', async () => {
      layout.style.width = '800px';
      await nextResize(layout);

      expect(layout.hasAttribute('overflow')).to.be.false;
      expect(parseFloat(getComputedStyle(detail).marginInlineStart)).to.equal(0);
    });

    it('should switch to full mode when layout size is decreased', async () => {
      layout.style.width = '800px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(detail.offsetWidth).to.be.at.least(400);
    });

    it('should switch to full mode when detail is added to a narrow layout', async () => {
      const detailContent = layout.querySelector('[slot="detail"]');
      detailContent.remove();
      await nextRender();
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.appendChild(detailContent);
      await nextRender();
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(detail.offsetWidth).to.be.at.least(layout.offsetWidth);
    });

    it('should not use sticky positioning in full mode', () => {
      expect(getComputedStyle(detail).position).to.not.equal('sticky');
    });

    it('should not oscillate when layout size is decreased', async () => {
      layout.detailSize = null;
      layout.style.width = '800px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.style.width = '300px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      // Wait extra frame to confirm no oscillation
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should not oscillate when layout size is increased', async () => {
      // Start in full mode with overflow
      expect(layout.hasAttribute('overflow')).to.be.true;

      // Widen to a size that still requires overflow
      layout.style.width = '500px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      // Wait extra frame to confirm no oscillation
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
    });
  });
});
