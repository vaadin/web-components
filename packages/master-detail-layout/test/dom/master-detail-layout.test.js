import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-master-detail-layout.js';
import { onceResized } from '../helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('vaadin-master-detail-layout', () => {
  let layout;

  describe('host', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout>
          <div>Master content</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('masterSize', async () => {
      layout.masterSize = '300px';
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('detailSize', async () => {
      layout.detailSize = '400px';
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('masterSize and detailSize', async () => {
      layout.masterSize = '300px';
      layout.detailSize = '400px';
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    beforeEach(async () => {
      layout = fixtureSync(`<vaadin-master-detail-layout></vaadin-master-detail-layout>`);
      await onceResized(layout);
    });

    it('default', async () => {
      await expect(layout).shadowDom.to.equalSnapshot();
    });
  });

  describe('detail', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px">
          <div>Master content</div>
          <div slot="detail">Detail content</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('overflow', async () => {
      layout.style.width = '400px';
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('hidden', async () => {
      layout.querySelector('[slot="detail"]').hidden = true;
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('detail placeholder', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px">
          <div>Master content</div>
          <div slot="detail-placeholder">Detail placeholder content</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('overflow', async () => {
      layout.style.width = '400px';
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('removed', async () => {
      layout.querySelector('[slot="detail-placeholder"]').remove();
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('nested layouts', () => {
    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout
          master-size="100px"
          overlay-size="100px"
        >
          <div>Master 0</div>
          <vaadin-master-detail-layout
            slot="detail"
            master-size="100px"
            detail-size="400px"
            overlay-size="100px"
          >
            <div>Master 1</div>
            <vaadin-master-detail-layout
              slot="detail"
              master-size="100px"
              overlay-size="100px"
            >
              <div>Master 2</div>
              <vaadin-master-detail-layout
                slot="detail"
                master-size="100px"
                detail-size="100px"
              >
                <div>Master 3</div>
                <div slot="detail">Detail</div>
              </vaadin-master-detail-layout>
            </vaadin-master-detail-layout>
          </vaadin-master-detail-layout>
        </vaadin-master-detail-layout>
      `);
    });

    it('default', async () => {
      await nextFrame();
      await expect(layout).dom.to.equalSnapshot();
    });

    it('overflow', async () => {
      layout.style.width = '200px';
      await nextFrame();
      await expect(layout).dom.to.equalSnapshot();
    });
  });
});
