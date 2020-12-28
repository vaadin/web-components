import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { flushGrid, getBodyCellContent, infiniteDataProvider, listenOnce, scrollToEnd } from './helpers.js';
import '../vaadin-grid.js';

describe('scrolling mode', () => {
  let grid, fixedContainers;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    fixedContainers = !!navigator.userAgent.match(/Edge/) && grid._scrollbarWidth === 0;
    flushGrid(grid);
  });

  function isFixed(element) {
    return window.getComputedStyle(element).position === 'fixed';
  }

  function wheel(deltaX, deltaY, deltaMode = WheelEvent.DOM_DELTA_PIXEL) {
    const e = new CustomEvent('wheel', { bubbles: true, cancelable: true });
    e.deltaY = deltaY;
    e.deltaX = deltaX;
    e.deltaMode = deltaMode;
    getBodyCellContent(grid, 0, 0).dispatchEvent(e);
    grid._debouncerWheelAnimationFrame.flush();
    return e;
  }

  it('should scroll by pixels when deltaMode is DOM_DELTA_PIXEL (default)', () => {
    wheel(0, 1, WheelEvent.DOM_DELTA_PIXEL);
    expect(grid.$.table.scrollTop).to.equal(1);
  });

  it('should scroll by lines when deltaMode is DOM_DELTA_LINE', () => {
    wheel(0, 1, WheelEvent.DOM_DELTA_LINE);
    expect(grid.$.table.scrollTop).to.equal(16);
  });

  it('should scroll by pages when deltaMode is DOM_DELTA_PAGE', () => {
    wheel(0, 1, WheelEvent.DOM_DELTA_PAGE);
    expect(grid._scrollPageHeight).to.be.above(1);
    expect(grid.$.table.scrollTop).to.equal(grid._scrollPageHeight);
  });

  it('should/should not have fixed container elements depending on scrolling mode', () => {
    expect(isFixed(grid.$.items)).to.equal(fixedContainers);
    expect(isFixed(grid.$.header)).to.equal(fixedContainers);
  });

  (fixedContainers ? it : it.skip)('should not have the table transformed with fixed containers', () => {
    // This is to ensure that a fixed body/header/footer are not positioned
    // in relation to the table element but it's parent
    expect(window.getComputedStyle(grid.$.table).transform).to.equal('none');
  });

  it('should only cancel wheel events when scrolling is possible - vertical', () => {
    grid.style.fontSize = '12px';

    expect(wheel(0, -1).defaultPrevented).to.be.false;
    expect(wheel(0, 1).defaultPrevented).to.be.true;

    grid._previousMomentum = 0;
    scrollToEnd(grid);

    grid._debouncerIgnoreNewWheel.flush();

    expect(wheel(0, 1).defaultPrevented).to.be.false;
    expect(wheel(0, -1).defaultPrevented).to.be.true;
  });

  it('should only cancel wheel events when scrolling is possible - horizontal', () => {
    expect(wheel(-1, 0).defaultPrevented).to.be.false;
    expect(wheel(1, 0).defaultPrevented).to.be.true;

    const table = grid.$.table;
    table.scrollLeft = table.scrollWidth - table.offsetWidth;
    grid._previousMomentum = 0;
    flushGrid(grid);

    expect(wheel(1, 0).defaultPrevented).to.be.false;
    expect(wheel(-1, 0).defaultPrevented).to.be.true;
  });

  it('should not prevent wheel events when scrolled to max', () => {
    scrollToEnd(grid);
    flushGrid(grid);
    expect(wheel(0, 1).defaultPrevented).to.be.false;
    expect(wheel(0, 1).defaultPrevented).to.be.false;
  });

  it('should prevent default during cancel period', () => {
    wheel(1, 0);
    wheel(-1, 0);
    expect(wheel(-100, 0).defaultPrevented).to.be.true;
  });

  it('should skip a wheel event while processing the previous one', () => {
    wheel(0, 1);
    grid._wheelAnimationFrame = true;
    expect(wheel(0, 1).defaultPrevented).to.be.true;
    expect(grid.$.table.scrollTop).to.equal(1);
  });

  it('should accumulate delta Y while wheeling during animation frame', () => {
    wheel(0, 1);
    grid._wheelAnimationFrame = true;
    wheel(0, 1);
    grid._wheelAnimationFrame = false;
    wheel(0, 1);
    expect(grid.$.table.scrollTop).to.equal(3);
  });

  it('should clear accumulated delta', () => {
    wheel(0, 1);
    grid._wheelAnimationFrame = true;
    wheel(0, 1);
    grid._wheelAnimationFrame = false;
    wheel(0, 1);
    wheel(0, 1);
    expect(grid.$.table.scrollTop).to.equal(4);
  });

  it('should not throw on table wheel', () => {
    const tableWheel = () => {
      const e = new CustomEvent('wheel', { bubbles: true, cancelable: true });
      e.deltaY = -1;
      e.deltaX = 0;
      grid.$.items.dispatchEvent(e);
    };
    expect(tableWheel).to.not.throw(Error);
  });

  it('should have proper height', () => {
    expect(grid.scrollHeight - grid.clientHeight).to.equal(0);
  });

  it('should defer adding scrolling state attributes', (done) => {
    const scroller = grid.$.scroller;
    listenOnce(grid.$.table, 'scroll', () => {
      expect(scroller.hasAttribute('scrolling')).to.be.false;
      requestAnimationFrame(() => {
        expect(scroller.hasAttribute('scrolling')).to.be.true;
        done();
      });
    });
    grid.$.table.dispatchEvent(new CustomEvent('scroll'));
  });

  describe('overflow attribute', () => {
    it('bottom right', () => {
      grid._scrollToIndex(0);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom right');
    });

    it('bottom left', () => {
      grid._scrollToIndex(0);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      grid._scrollHandler();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom left');
    });

    it('bottom top', () => {
      grid._scrollToIndex(1);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('top');
      expect(grid.getAttribute('overflow')).to.contain('bottom');
    });

    it('left right', () => {
      grid.$.table.scrollLeft = 1;
      grid._scrollHandler();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('left');
      expect(grid.getAttribute('overflow')).to.contain('right');
    });

    it('top right', () => {
      scrollToEnd(grid);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top right');
    });

    it('top left', () => {
      scrollToEnd(grid);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      grid._scrollHandler();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top left');
    });
  });
});

describe('empty grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    flushGrid(grid);
  });

  it('should not have vertical scroll bars', (done) => {
    afterNextRender(grid, () => {
      expect(grid.clientHeight).not.to.be.below(grid.$.header.clientHeight + grid.$.items.clientHeight);
      done();
    });
  });
});

describe('scroll on attach', () => {
  it('should not scroll document on attach', () => {
    document.body.style.paddingTop = '10000px';
    document.documentElement.scrollTop = 10000;
    const scrollTop = document.documentElement.scrollTop;
    fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    const newScrollTop = document.documentElement.scrollTop;
    // Cleanup
    document.body.style.paddingTop = '';

    expect(scrollTop).to.equal(newScrollTop);
  });
});
