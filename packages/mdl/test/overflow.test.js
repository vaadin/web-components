import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('overflow detection', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 800px;">
        <div>Master</div>
        <div slot="detail">Detail</div>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
    await nextResize(layout);
  });

  describe('layout resize', () => {
    it('should not set overflow when columns fit within the layout', () => {
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should set overflow when layout size is decreased below column minimums', async () => {
      layout.style.width = '400px';
      await nextResize(layout);

      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should remove overflow when layout size is increased to fit columns', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.style.width = '800px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
    });
  });

  describe('property changes', () => {
    it('should set overflow when masterSize increases beyond available space', async () => {
      layout.masterSize = '600px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should set overflow when detailSize increases beyond available space', async () => {
      layout.detailSize = '600px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should remove overflow when masterSize decreases to fit', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.masterSize = '100px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should remove overflow when detailSize decreases to fit', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.detailSize = '100px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should set overflow when masterSize is set to 100%', async () => {
      layout.masterSize = '100%';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should not set overflow when detail is removed', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.querySelector('[slot="detail"]').remove();
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
    });
  });
});
