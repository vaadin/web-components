import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

function getPartSizes(layout, dimension) {
  const master = layout.shadowRoot.querySelector('[part="master"]');
  const detail = layout.shadowRoot.querySelector('[part="detail"]');
  const prop = dimension === 'height' ? 'offsetHeight' : 'offsetWidth';
  return [master[prop], detail[prop]];
}

describe('split mode', () => {
  describe('horizontal', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout style="width: 600px;">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    describe('expand both', () => {
      it('should expand both columns equally when both sizes are the same', async () => {
        layout.expand = 'both';
        layout.masterSize = '200px';
        layout.detailSize = '200px';
        await onceResized(layout);
        const [masterWidth, detailWidth] = getPartSizes(layout, 'width');
        expect(masterWidth).to.equal(300);
        expect(detailWidth).to.equal(300);
      });

      it('should use masterSize as minimum and expand both columns', async () => {
        layout.expand = 'both';
        layout.masterSize = '300px';
        layout.detailSize = '100px';
        await onceResized(layout);
        const [masterWidth, detailWidth] = getPartSizes(layout, 'width');
        expect(masterWidth).to.be.at.least(300);
        expect(detailWidth).to.be.at.least(100);
        expect(masterWidth + detailWidth).to.equal(600);
      });

      it('should use detailSize as minimum and expand both columns', async () => {
        layout.expand = 'both';
        layout.masterSize = '100px';
        layout.detailSize = '300px';
        await onceResized(layout);
        const [masterWidth, detailWidth] = getPartSizes(layout, 'width');
        expect(masterWidth).to.be.at.least(100);
        expect(detailWidth).to.be.at.least(300);
        expect(masterWidth + detailWidth).to.equal(600);
      });
    });

    describe('expand master (default)', () => {
      it('should fix detail and expand master to fill the rest', async () => {
        layout.masterSize = '100px';
        layout.detailSize = '200px';
        await onceResized(layout);
        const [masterWidth, detailWidth] = getPartSizes(layout, 'width');
        expect(masterWidth).to.equal(400);
        expect(detailWidth).to.equal(200);
      });
    });

    describe('expand detail', () => {
      it('should fix master and expand detail to fill the rest', async () => {
        layout.expand = 'detail';
        layout.masterSize = '200px';
        layout.detailSize = '100px';
        await onceResized(layout);
        const [masterWidth, detailWidth] = getPartSizes(layout, 'width');
        expect(masterWidth).to.equal(200);
        expect(detailWidth).to.equal(400);
      });
    });
  });

  describe('vertical', () => {
    let layout;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-master-detail-layout orientation="vertical" style="height: 600px;">
          <div>Master</div>
          <div slot="detail">Detail</div>
        </vaadin-master-detail-layout>
      `);
      await onceResized(layout);
    });

    describe('expand both', () => {
      it('should expand both rows equally when both sizes are the same', async () => {
        layout.expand = 'both';
        layout.masterSize = '200px';
        layout.detailSize = '200px';
        await onceResized(layout);
        const [masterHeight, detailHeight] = getPartSizes(layout, 'height');
        expect(masterHeight).to.equal(300);
        expect(detailHeight).to.equal(300);
      });
    });

    describe('expand master (default)', () => {
      it('should fix detail and expand master to fill the rest', async () => {
        layout.masterSize = '100px';
        layout.detailSize = '200px';
        await onceResized(layout);
        const [masterHeight, detailHeight] = getPartSizes(layout, 'height');
        expect(masterHeight).to.equal(400);
        expect(detailHeight).to.equal(200);
      });
    });

    describe('expand detail', () => {
      it('should fix master and expand detail to fill the rest', async () => {
        layout.expand = 'detail';
        layout.masterSize = '200px';
        layout.detailSize = '100px';
        await onceResized(layout);
        const [masterHeight, detailHeight] = getPartSizes(layout, 'height');
        expect(masterHeight).to.equal(200);
        expect(detailHeight).to.equal(400);
      });
    });
  });
});
