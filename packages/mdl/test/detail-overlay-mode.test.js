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

    it('should use absolute positioning and show backdrop in drawer mode', () => {
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('absolute');
      expect(getComputedStyle(backdrop).display).to.equal('block');
    });

    it('should set detail width to detailSize in drawer mode', () => {
      expect(getComputedStyle(detail).width).to.equal('300px');
    });

    it('should update detail width when detailSize changes in drawer mode', async () => {
      layout.detailSize = '600px';
      await nextRender();
      expect(getComputedStyle(detail).width).to.equal('600px');
    });

    it('should align detail to the inline end', () => {
      const detailStyle = getComputedStyle(detail);
      expect(detailStyle.insetInlineEnd).to.equal('0px');
    });

    it('should switch to drawer mode when detail is added to a narrow layout', async () => {
      const detailContent = layout.querySelector('[slot="detail"]');
      detailContent.remove();
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.appendChild(detailContent);
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(getComputedStyle(detail).position).to.equal('absolute');
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

    it('should cover the full layout width using inset-inline', () => {
      const detailStyle = getComputedStyle(detail);
      expect(detailStyle.insetInlineStart).to.equal('0px');
      expect(detailStyle.insetInlineEnd).to.equal('0px');
    });

    it('should cover the full layout height using inset-block', () => {
      const detailStyle = getComputedStyle(detail);
      expect(detailStyle.insetBlockStart).to.equal('0px');
      expect(detailStyle.insetBlockEnd).to.equal('0px');
    });

    it('should make detail as wide as the layout', () => {
      expect(detail.offsetWidth).to.equal(layout.offsetWidth);
    });

    it('should switch back to split mode when layout size is increased', async () => {
      layout.style.width = '800px';
      await nextResize(layout);

      expect(layout.hasAttribute('overflow')).to.be.false;
      expect(getComputedStyle(detail).position).to.not.equal('absolute');
    });

    it('should switch to full mode when layout size is decreased', async () => {
      layout.style.width = '800px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(detail.offsetWidth).to.equal(400);
    });

    it('should switch to full mode when detail is added to a narrow layout', async () => {
      const detailContent = layout.querySelector('[slot="detail"]');
      detailContent.remove();
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;

      layout.appendChild(detailContent);
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
      expect(detail.offsetWidth).to.equal(layout.offsetWidth);
    });
  });
});
