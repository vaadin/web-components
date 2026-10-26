import { expect } from '@vaadin/chai-plugins';
import sinon from 'sinon';
import {
  getAnchor,
  getAnchorScrollLeftDelta,
  getAnchorScrollTop,
  getFitScale,
  getMostVisibleIndex,
  getVisiblePages,
} from '../src/pdf-viewer-layout.js';

describe('layout', () => {
  describe('fit scale', () => {
    it('should fit the page width to the available width', () => {
      expect(getFitScale(300, 600)).to.equal(0.5);
    });

    it('should return 0 without available width', () => {
      expect(getFitScale(0, 600)).to.equal(0);
    });
  });

  describe('visible pages', () => {
    // Pages of 100px with a gap of 10px: page 0 at 0, page 1 at 110, page 2 at 220...
    const getBounds = (index: number) => ({ top: index * 110, height: 100 });

    it('should return the pages that intersect the view with their visible height', () => {
      expect(getVisiblePages(10, getBounds, 150, 350)).to.deep.equal([
        { index: 1, height: 60 },
        { index: 2, height: 100 },
        { index: 3, height: 20 },
      ]);
    });

    it('should return the next page with height 0 when the view only shows a gap', () => {
      expect(getVisiblePages(10, getBounds, 212, 218)).to.deep.equal([{ index: 2, height: 0 }]);
    });

    it('should only measure a few pages of a long document', () => {
      const spy = sinon.spy(getBounds);
      getVisiblePages(1000, spy, 55000, 55400);
      expect(spy.callCount).to.be.below(20);
    });
  });

  describe('most visible page', () => {
    it('should return the page with the largest visible height', () => {
      expect(
        getMostVisibleIndex([
          { index: 3, height: 50 },
          { index: 4, height: 300 },
          { index: 5, height: 100 },
        ]),
      ).to.equal(4);
    });

    it('should return the first page on a tie', () => {
      expect(
        getMostVisibleIndex([
          { index: 3, height: 200 },
          { index: 4, height: 200 },
        ]),
      ).to.equal(3);
    });
  });

  describe('anchor', () => {
    it('should return the position of the view on the page relative to the page size', () => {
      const anchor = getAnchor({ scrollTop: 750, center: 200 }, { top: 500, height: 1000, left: 100, width: 400 });
      expect(anchor).to.deep.equal({ x: 0.25, y: 0.25 });
    });

    it('should keep the same point of a resized page at the top of the view', () => {
      expect(getAnchorScrollTop({ y: 0.25 }, { top: 1000, height: 2000 })).to.equal(1500);
    });

    it('should scroll the same point of a wide page to the middle of the view', () => {
      // The point at 25% of the page is at 50 + 0.25 * 800 = 250, the view middle at 200
      expect(getAnchorScrollLeftDelta({ x: 0.25 }, { center: 200, width: 400 }, { left: 50, width: 800 })).to.equal(50);
    });

    it('should work with a page that starts left of the viewport', () => {
      // E.g. in RTL, where the page is scrolled to its right edge
      expect(getAnchorScrollLeftDelta({ x: 0.75 }, { center: 200, width: 400 }, { left: -400, width: 800 })).to.equal(
        0,
      );
    });

    it('should center a page that fits the width of the view', () => {
      expect(getAnchorScrollLeftDelta({ x: 0.25 }, { center: 200, width: 400 }, { left: 0, width: 300 })).to.equal(-50);
    });
  });
});
