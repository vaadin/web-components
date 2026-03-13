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

  describe('container resize', () => {
    it('should not set overflow when columns fit within the container', () => {
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should set overflow when container shrinks below column minimums', async () => {
      layout.style.width = '400px';
      await nextResize(layout);

      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should remove overflow when container grows to fit columns', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.style.width = '800px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.false;
    });
  });

  describe('property changes', () => {
    it('should set overflow when masterSize increases beyond available space', () => {
      layout.masterSize = '600px';
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should set overflow when detailSize increases beyond available space', () => {
      layout.detailSize = '600px';
      expect(layout.hasAttribute('overflow')).to.be.true;
    });

    it('should remove overflow when masterSize decreases to fit', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.masterSize = '100px';
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should remove overflow when detailSize decreases to fit', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.detailSize = '100px';
      expect(layout.hasAttribute('overflow')).to.be.false;
    });

    it('should not set overflow when detail is removed', async () => {
      layout.style.width = '400px';
      await nextResize(layout);
      expect(layout.hasAttribute('overflow')).to.be.true;

      layout.querySelector('[slot="detail"]').remove();
      await nextRender();
      expect(layout.hasAttribute('overflow')).to.be.false;
    });
  });
});
