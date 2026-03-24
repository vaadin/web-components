import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('overlay detection', () => {
  describe('horizontal', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 800px;">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    describe('layout resize', () => {
      it('should not set overlay when columns fit within the layout', () => {
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should set overlay when layout size is decreased below column minimums', async () => {
        layout.style.width = '400px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;
      });

      it('should remove overlay when layout size is increased to fit columns', async () => {
        layout.style.width = '400px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;

        layout.style.width = '800px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });
    });

    describe('property changes', () => {
      it('should set overlay when masterSize increases beyond available space', async () => {
        layout.masterSize = '600px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;
      });

      it('should remove overlay when masterSize decreases to fit', async () => {
        layout.style.width = '400px';
        await onceResized(layout);

        layout.masterSize = '100px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should remove overlay when masterSize decreases to fit while keep-detail-column-offscreen is set', async () => {
        layout.style.width = '400px';
        await onceResized(layout);

        layout.masterSize = '50px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });

      it('should set overlay when masterSize is set to 100%', async () => {
        layout.masterSize = '100%';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;
      });

      it('should not set overlay when detail is removed', async () => {
        layout.style.width = '400px';
        await onceResized(layout);

        layout.querySelector('[slot="detail"]').remove();
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;
      });
    });
  });

  describe('vertical', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout
          orientation="vertical"
          master-size="300px"
          detail-size="300px"
          style="height: 800px;"
        >
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('should not set overlay when rows fit within the layout', () => {
      expect(layout.hasAttribute('overlay')).to.be.false;
    });

    it('should set overlay when layout height is decreased below row minimums', async () => {
      layout.style.height = '400px';
      await onceResized(layout);
      expect(layout.hasAttribute('overlay')).to.be.true;
    });

    it('should remove overlay when layout height is increased to fit rows', async () => {
      layout.style.height = '400px';
      await onceResized(layout);

      layout.style.height = '800px';
      await onceResized(layout);
      expect(layout.hasAttribute('overlay')).to.be.false;
    });
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    const sizeProp = orientation === 'vertical' ? 'height' : 'width';

    describe(`${orientation} - sub-pixel rounding`, () => {
      let layout;

      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-master-detail-layout
            expand="master"
            master-size="300px"
            detail-size="300px"
            orientation="${orientation}"
            style="${sizeProp}: 800px;"
          >
            <div>Master</div>
            <div slot="detail">Detail</div>
          </vaadin-master-detail-layout>
        `);
        await onceResized(layout);
      });

      // Uses getComputedStyle() instead of offsetWidth/offsetHeight to obtain the
      // actual fractional host size for overflow comparison. offsetWidth/offsetHeight
      // round to integers, which can mask overflow when the fractional host size is
      // slightly less than the track sum (e.g. 599.6px rounds up to 600px, matching
      // the 300+300 track sum).
      it(`should not report false overlay due to sub-pixel rounding`, async () => {
        layout.style[sizeProp] = '600.4px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.false;

        layout.style[sizeProp] = '599.6px';
        await onceResized(layout);
        expect(layout.hasAttribute('overlay')).to.be.true;
      });
    });
  });
});
