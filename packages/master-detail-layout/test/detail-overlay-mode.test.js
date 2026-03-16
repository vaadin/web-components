import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('detail overlay mode', () => {
  describe('drawer', () => {
    describe('horizontal', () => {
      let layout, detail, backdrop;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 400px;">
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
        backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      });

      it('should use absolute positioning and show backdrop', () => {
        expect(getComputedStyle(detail).position).to.equal('absolute');
        expect(getComputedStyle(backdrop).display).to.equal('block');
      });

      it('should set detail width to detailSize', () => {
        expect(getComputedStyle(detail).width).to.equal('300px');
      });

      it('should align detail to the inline end with full block height', () => {
        const s = getComputedStyle(detail);
        expect(s.insetInlineEnd).to.equal('0px');
        expect(s.insetBlockStart).to.equal('0px');
        expect(s.insetBlockEnd).to.equal('0px');
      });

      it('should switch to drawer when detail is added to a narrow layout', async () => {
        const detailContent = layout.querySelector('[slot="detail"]');
        detailContent.remove();
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.false;

        layout.appendChild(detailContent);
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.true;
        expect(getComputedStyle(detail).position).to.equal('absolute');
      });
    });

    describe('vertical', () => {
      let layout, detail;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            orientation="vertical"
            master-size="300px"
            detail-size="300px"
            style="height: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
      });

      it('should set detail height to detailSize', () => {
        expect(getComputedStyle(detail).height).to.equal('300px');
      });

      it('should align detail to the block end with full inline width', () => {
        const s = getComputedStyle(detail);
        expect(s.insetBlockEnd).to.equal('0px');
        expect(s.insetInlineStart).to.equal('0px');
        expect(s.insetInlineEnd).to.equal('0px');
      });
    });
  });

  describe('full', () => {
    describe('horizontal', () => {
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
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
        backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      });

      it('should show backdrop', () => {
        expect(getComputedStyle(backdrop).display).to.equal('block');
      });

      it('should cover the full layout using inset', () => {
        const s = getComputedStyle(detail);
        expect(s.insetInlineStart).to.equal('0px');
        expect(s.insetInlineEnd).to.equal('0px');
        expect(s.insetBlockStart).to.equal('0px');
        expect(s.insetBlockEnd).to.equal('0px');
      });

      it('should make detail as wide as the layout', () => {
        expect(detail.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should switch back to split mode when layout grows', async () => {
        layout.style.width = '800px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.false;
      });

      it('should switch to full mode when detail is added to a narrow layout', async () => {
        const detailContent = layout.querySelector('[slot="detail"]');
        detailContent.remove();
        await onceResized(layout);

        layout.appendChild(detailContent);
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.true;
        expect(detail.offsetWidth).to.equal(layout.offsetWidth);
      });
    });

    describe('vertical', () => {
      let layout, detail;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            orientation="vertical"
            master-size="300px"
            detail-size="300px"
            detail-overlay-mode="full"
            style="height: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
      });

      it('should cover the full layout using inset', () => {
        const s = getComputedStyle(detail);
        expect(s.insetBlockStart).to.equal('0px');
        expect(s.insetBlockEnd).to.equal('0px');
        expect(s.insetInlineStart).to.equal('0px');
        expect(s.insetInlineEnd).to.equal('0px');
      });

      it('should make detail as tall as the layout', () => {
        expect(detail.offsetHeight).to.equal(layout.offsetHeight);
      });
    });
  });

  describe('drawer-viewport', () => {
    describe('horizontal', () => {
      let layout, detail, backdrop;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            master-size="300px"
            detail-size="300px"
            detail-overlay-mode="drawer-viewport"
            style="width: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
        backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      });

      it('should use fixed positioning for detail and backdrop', () => {
        expect(getComputedStyle(detail).position).to.equal('fixed');
        expect(getComputedStyle(backdrop).position).to.equal('fixed');
      });

      it('should set detail width to detailSize and align to inline end', () => {
        expect(getComputedStyle(detail).width).to.equal('300px');
        expect(getComputedStyle(detail).insetInlineEnd).to.equal('0px');
      });

      it('should make backdrop cover the full viewport', () => {
        expect(backdrop.offsetWidth).to.equal(window.innerWidth);
        expect(backdrop.offsetHeight).to.equal(window.innerHeight);
      });
    });

    describe('vertical', () => {
      let layout, detail, backdrop;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            orientation="vertical"
            master-size="300px"
            detail-size="300px"
            detail-overlay-mode="drawer-viewport"
            style="height: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
        backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      });

      it('should use fixed positioning for detail and backdrop', () => {
        expect(getComputedStyle(detail).position).to.equal('fixed');
        expect(getComputedStyle(backdrop).position).to.equal('fixed');
      });

      it('should set detail height to detailSize and align to block end', () => {
        expect(getComputedStyle(detail).height).to.equal('300px');
        expect(getComputedStyle(detail).insetBlockEnd).to.equal('0px');
      });

      it('should make backdrop cover the full viewport', () => {
        expect(backdrop.offsetWidth).to.equal(window.innerWidth);
        expect(backdrop.offsetHeight).to.equal(window.innerHeight);
      });
    });
  });

  describe('full-viewport', () => {
    describe('horizontal', () => {
      let layout, detail, backdrop;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            master-size="300px"
            detail-size="300px"
            detail-overlay-mode="full-viewport"
            style="width: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
        backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      });

      it('should use fixed positioning for detail and backdrop', () => {
        expect(getComputedStyle(detail).position).to.equal('fixed');
        expect(getComputedStyle(backdrop).position).to.equal('fixed');
      });

      it('should make detail cover the full viewport', () => {
        expect(detail.offsetWidth).to.equal(window.innerWidth);
        expect(detail.offsetHeight).to.equal(window.innerHeight);
      });

      it('should make backdrop cover the full viewport', () => {
        expect(backdrop.offsetWidth).to.equal(window.innerWidth);
        expect(backdrop.offsetHeight).to.equal(window.innerHeight);
      });
    });

    describe('vertical', () => {
      let layout, detail, backdrop;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            orientation="vertical"
            master-size="300px"
            detail-size="300px"
            detail-overlay-mode="full-viewport"
            style="height: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
        backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
      });

      it('should use fixed positioning for detail and backdrop', () => {
        expect(getComputedStyle(detail).position).to.equal('fixed');
        expect(getComputedStyle(backdrop).position).to.equal('fixed');
      });

      it('should make detail cover the full viewport', () => {
        expect(detail.offsetWidth).to.equal(window.innerWidth);
        expect(detail.offsetHeight).to.equal(window.innerHeight);
      });

      it('should make backdrop cover the full viewport', () => {
        expect(backdrop.offsetWidth).to.equal(window.innerWidth);
        expect(backdrop.offsetHeight).to.equal(window.innerHeight);
      });
    });
  });
});
