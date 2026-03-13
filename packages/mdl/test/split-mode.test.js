import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

/**
 * Returns resolved grid column widths in pixels.
 */
function getColumnWidths(layout) {
  const { gridTemplateColumns } = getComputedStyle(layout);
  return gridTemplateColumns.split(' ').map(parseFloat);
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
  });

  describe('expand both (default)', () => {
    it('should split space equally when no sizes are set', () => {
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.equal(300);
      expect(detailWidth).to.equal(300);
    });

    it('should use masterSize as minimum and expand both columns proportionally', () => {
      layout.masterSize = '200px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      // Both expand: master starts at 200px, detail at 0, both grow with 1fr
      // Grid distributes remaining space proportionally
      expect(masterWidth).to.be.greaterThan(200);
      expect(detailWidth).to.be.greaterThan(0);
      expect(masterWidth + detailWidth).to.equal(600);
    });

    it('should use detailSize as minimum and expand both columns proportionally', () => {
      layout.detailSize = '200px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.be.greaterThan(0);
      expect(detailWidth).to.be.greaterThan(200);
      expect(masterWidth + detailWidth).to.equal(600);
    });

    it('should use both sizes as minimums and expand both columns', () => {
      layout.masterSize = '200px';
      layout.detailSize = '200px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.equal(300);
      expect(detailWidth).to.equal(300);
    });
  });

  describe('expand master', () => {
    beforeEach(() => {
      layout.expand = 'master';
    });

    it('should give all remaining space to master when no sizes are set', () => {
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      // Detail column: minmax(0, 0) collapses, master takes all space
      expect(masterWidth).to.equal(600);
      expect(detailWidth).to.equal(0);
    });

    it('should fix detail at detailSize and give the rest to master', () => {
      layout.detailSize = '200px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.equal(400);
      expect(detailWidth).to.equal(200);
    });

    it('should use masterSize as minimum for the expanding master column', () => {
      layout.masterSize = '400px';
      layout.detailSize = '100px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.equal(500);
      expect(detailWidth).to.equal(100);
    });
  });

  describe('expand detail', () => {
    beforeEach(() => {
      layout.expand = 'detail';
    });

    it('should give all remaining space to detail when no sizes are set', () => {
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      // Master column: minmax(0, 0) collapses, detail takes all space
      expect(masterWidth).to.equal(0);
      expect(detailWidth).to.equal(600);
    });

    it('should fix master at masterSize and give the rest to detail', () => {
      layout.masterSize = '200px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.equal(200);
      expect(detailWidth).to.equal(400);
    });

    it('should use detailSize as minimum for the expanding detail column', () => {
      layout.masterSize = '100px';
      layout.detailSize = '400px';
      const [masterWidth, detailWidth] = getColumnWidths(layout);
      expect(masterWidth).to.equal(100);
      expect(detailWidth).to.equal(500);
    });
  });
});
