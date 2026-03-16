import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

/**
 * Returns master and detail part widths in pixels.
 */
function getPartWidths(layout) {
  const master = layout.shadowRoot.querySelector('[part="master"]');
  const detail = layout.shadowRoot.querySelector('[part="detail"]');
  return [master.offsetWidth, detail.offsetWidth];
}

describe('split mode', () => {
  let layout;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout style="width: 600px;">
        <div>Master</div>
        <div slot="detail">Detail</div>
      </vaadin-master-detail-layout>
    `);
    await nextRender();
    await nextResize(layout);
  });

  describe('expand both (default)', () => {
    it('should expand both columns equally when both sizes are the same', async () => {
      layout.masterSize = '200px';
      layout.detailSize = '200px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.equal(300);
      expect(detailWidth).to.equal(300);
    });

    it('should use masterSize as minimum and expand both columns', async () => {
      layout.masterSize = '300px';
      layout.detailSize = '100px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.be.at.least(300);
      expect(detailWidth).to.be.at.least(100);
      expect(masterWidth + detailWidth).to.equal(600);
    });

    it('should use detailSize as minimum and expand both columns', async () => {
      layout.masterSize = '100px';
      layout.detailSize = '300px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.be.at.least(100);
      expect(detailWidth).to.be.at.least(300);
      expect(masterWidth + detailWidth).to.equal(600);
    });
  });

  describe('expand master', () => {
    beforeEach(() => {
      layout.expand = 'master';
    });

    it('should fix detail at detailSize and expand master to fill the rest', async () => {
      layout.masterSize = '100px';
      layout.detailSize = '200px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.equal(400);
      expect(detailWidth).to.equal(200);
    });

    it('should use masterSize as minimum for the expanding master column', async () => {
      layout.masterSize = '400px';
      layout.detailSize = '100px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.equal(500);
      expect(detailWidth).to.equal(100);
    });
  });

  describe('expand detail', () => {
    beforeEach(() => {
      layout.expand = 'detail';
    });

    it('should fix master at masterSize and expand detail to fill the rest', async () => {
      layout.masterSize = '200px';
      layout.detailSize = '100px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.equal(200);
      expect(detailWidth).to.equal(400);
    });

    it('should use detailSize as minimum for the expanding detail column', async () => {
      layout.masterSize = '100px';
      layout.detailSize = '400px';
      await nextResize(layout);
      const [masterWidth, detailWidth] = getPartWidths(layout);
      expect(masterWidth).to.equal(100);
      expect(detailWidth).to.equal(500);
    });
  });
});
