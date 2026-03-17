import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('overflow detection', () => {
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
      it('should not set overflow when columns fit within the layout', () => {
        expect(layout.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow when layout size is decreased below column minimums', async () => {
        layout.style.width = '400px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.true;
      });

      it('should remove overflow when layout size is increased to fit columns', async () => {
        layout.style.width = '400px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.true;

        layout.style.width = '800px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.false;
      });
    });

    describe('property changes', () => {
      it('should set overflow when masterSize increases beyond available space', async () => {
        layout.masterSize = '600px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.true;
      });

      it('should remove overflow when masterSize decreases to fit', async () => {
        layout.style.width = '400px';
        await onceResized(layout);

        layout.masterSize = '100px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow when masterSize decreases to fit while preserve-master-width is set', async () => {
        layout.style.width = '400px';
        await onceResized(layout);

        layout.masterSize = '50px';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow when masterSize is set to 100%', async () => {
        layout.masterSize = '100%';
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.true;
      });

      it('should not set overflow when detail is removed', async () => {
        layout.style.width = '400px';
        await onceResized(layout);

        layout.querySelector('[slot="detail"]').remove();
        await onceResized(layout);
        expect(layout.hasAttribute('overflow')).to.be.false;
      });
    });
  });

  describe('sub-pixel rounding', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 600.4px;">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('should not report overflow when track sizes sum exceeds host offsetWidth only due to sub-pixel rounding', async () => {
      // The host has a fractional width (600.4px), so offsetWidth rounds down to 600.
      // With expand="both", the grid tracks are: 300px 1fr 300px 1fr.
      // The 1fr tracks split the remaining ~0.4px, making the first three tracks
      // sum to ~600.2px which exceeds offsetWidth (600) without Math.round().
      // Wait for a second resize cycle since the rAF write may trigger another
      // ResizeObserver callback.
      await onceResized(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
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

    it('should not set overflow when rows fit within the layout', () => {
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should set overflow when layout height is decreased below row minimums', async () => {
      layout.style.height = '400px';
      await onceResized(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should remove overflow when layout height is increased to fit rows', async () => {
      layout.style.height = '400px';
      await onceResized(layout);

      layout.style.height = '800px';
      await onceResized(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
    });
  });
});
