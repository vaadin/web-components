import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('overlay', () => {
  describe('default (no overlaySize)', () => {
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

      it('should switch to overlay when detail is added to a narrow layout', async () => {
        const detailContent = layout.querySelector('[slot="detail"]');
        detailContent.remove();
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.appendChild(detailContent);
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;
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

  describe('overlaySize 100%', () => {
    describe('horizontal', () => {
      let layout, detail, backdrop;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            master-size="300px"
            detail-size="300px"
            overlay-size="100%"
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

      it('should make detail as wide as the layout', () => {
        expect(detail.offsetWidth).to.equal(layout.offsetWidth);
      });

      it('should switch back to split mode when layout grows', async () => {
        layout.style.width = '800px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should switch to overlay when detail is added to a narrow layout', async () => {
        const detailContent = layout.querySelector('[slot="detail"]');
        detailContent.remove();
        await onceResized(layout);

        layout.appendChild(detailContent);
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;
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
            overlay-size="100%"
            style="height: 400px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
        detail = layout.shadowRoot.querySelector('[part="detail"]');
      });

      it('should make detail as tall as the layout', () => {
        expect(detail.offsetHeight).to.equal(layout.offsetHeight);
      });
    });
  });

  describe('with detail-placeholder', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px" detail-size="300px">
          <div>Master</div>
          <div slot="detail">Detail</div>
          <div slot="detail-placeholder">Placeholder</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('should not expand master when resized to overlay with detail', async () => {
      layout.style.width = '400px';
      await onceResized(layout);

      expect(layout.hasAttribute('overlay')).to.be.true;
      expect(layout.hasAttribute('has-detail')).to.be.true;
      expect(layout.hasAttribute('has-detail-placeholder')).to.be.true;
      expect(layout.$.master.offsetWidth).to.equal(300);
    });

    it('should expand master after removing detail in overlay mode', async () => {
      layout.style.width = '400px';
      await onceResized(layout);

      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);
      expect(layout.hasAttribute('has-detail')).to.be.false;
      expect(layout.$.master.offsetWidth).to.equal(400);
    });
  });

  describe('overlayContainment page', () => {
    ['horizontal', 'vertical'].forEach((orientation) => {
      describe(orientation, () => {
        let layout, detail, backdrop;
        const isVertical = orientation === 'vertical';
        const sizeStyle = isVertical ? 'height: 400px;' : 'width: 400px;';
        const orientationAttr = isVertical ? 'orientation="vertical"' : '';

        beforeEach(async () => {
          layout = fixtureSync(`
            <vaadin-master-detail-layout
              ${orientationAttr}
              master-size="300px"
              detail-size="300px"
              overlay-containment="page"
              style="${sizeStyle}"
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

        it(`should set detail ${isVertical ? 'height' : 'width'} to detailSize`, () => {
          expect(getComputedStyle(detail)[isVertical ? 'height' : 'width']).to.equal('300px');
        });

        it('should make backdrop cover the full viewport', () => {
          expect(backdrop.offsetWidth).to.equal(window.innerWidth);
          expect(backdrop.offsetHeight).to.equal(window.innerHeight);
        });

        it('should make detail cover the full viewport with overlaySize 100%', async () => {
          layout.overlaySize = '100%';
          await onceResized(layout);
          expect(detail.offsetWidth).to.equal(window.innerWidth);
          expect(detail.offsetHeight).to.equal(window.innerHeight);
        });
      });
    });
  });
});
