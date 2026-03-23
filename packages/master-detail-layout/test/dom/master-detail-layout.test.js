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
          <div slot="detail">Detail content</div>
          <div slot="detail-placeholder">Detail placeholder</div>
        </vaadin-master-detail-layout>
      `);
      await nextFrame();
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('masterSize', async () => {
      layout.masterSize = '300px';
      await expect(layout).dom.to.equalSnapshot();
    });

    it('detailSize', async () => {
      layout.detailSize = '400px';
      await expect(layout).dom.to.equalSnapshot();
    });

    it('masterSize and detailSize', async () => {
      layout.masterSize = '300px';
      layout.detailSize = '400px';
      await expect(layout).dom.to.equalSnapshot();
    });

    it('no detail', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('no detail placeholder', async () => {
      layout.querySelector('[slot="detail-placeholder"]').remove();
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    beforeEach(async () => {
      layout = fixtureSync(`<vaadin-master-detail-layout></vaadin-master-detail-layout>`);
      await nextFrame();
    });

    it('default', async () => {
      await expect(layout).shadowDom.to.equalSnapshot();
    });
  });

  describe('overflow', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout master-size="300px" detail-size="300px" style="width: 400px;">
          <div>Master content</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });

    it('with detail', async () => {
      const detail = document.createElement('div');
      detail.setAttribute('slot', 'detail');
      detail.textContent = 'Detail content';
      layout.appendChild(detail);
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });

    it('with detail placeholder', async () => {
      const detailPlaceholder = document.createElement('div');
      detailPlaceholder.setAttribute('slot', 'detail-placeholder');
      detailPlaceholder.textContent = 'Detail placeholder';
      layout.appendChild(detailPlaceholder);
      await onceResized(layout);
      await expect(layout).dom.to.equalSnapshot();
    });
  });
});
