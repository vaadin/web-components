import { expect } from '@esm-bundle/chai';
import { fixtureSync, isDesktopSafari, isFirefox, listenOnce, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-grid.js';
import { flushGrid, infiniteDataProvider, onceResized, scrollToEnd } from './helpers.js';

describe('scrolling mode', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
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
    it('bottom end right', () => {
      grid.scrollToIndex(0);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom end right');
    });

    it('bottom start left', () => {
      grid.scrollToIndex(0);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom start left');
    });

    it('bottom top', () => {
      grid.scrollToIndex(1);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('top');
      expect(grid.getAttribute('overflow')).to.contain('bottom');
    });

    it('left right', () => {
      grid.$.table.scrollLeft = 1;
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('left');
      expect(grid.getAttribute('overflow')).to.contain('right');
    });

    it('start end', () => {
      grid.$.table.scrollLeft = 1;
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('start');
      expect(grid.getAttribute('overflow')).to.contain('end');
    });

    it('top end right', () => {
      scrollToEnd(grid);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top end right');
    });

    it('top start left', () => {
      scrollToEnd(grid);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top start left');
    });

    // This test constantly fails in WebKit when the test is running on CI.
    // It perhaps has something to do with the specific version of WebKit
    // Playwright uses on CI. It sometimes fails also in Firefox on CI,
    // but not as often as in WebKit.
    (isDesktopSafari || isFirefox ? it.skip : it)('update on resize', async () => {
      grid.style.width = '200px';
      await onceResized(grid);
      await nextFrame();
      expect(grid.getAttribute('overflow')).to.equal('bottom');

      grid.style.width = '50px';
      await onceResized(grid);
      await nextFrame();
      expect(grid.getAttribute('overflow')).to.equal('bottom end right');
    });

    describe('RTL', () => {
      beforeEach(() => {
        grid.setAttribute('dir', 'rtl');
      });

      it('end', () => {
        expect(grid.getAttribute('overflow')).to.contain('end');
        expect(grid.getAttribute('overflow')).to.not.contain('start');
      });

      it('start end', () => {
        grid.$.table.scrollLeft = -1;
        flushGrid(grid);
        expect(grid.getAttribute('overflow')).to.contain('start');
        expect(grid.getAttribute('overflow')).to.contain('end');
      });

      it('start', () => {
        grid.$.table.scrollLeft = -grid.$.table.scrollWidth;
        flushGrid(grid);
        expect(grid.getAttribute('overflow')).to.contain('start');
        expect(grid.getAttribute('overflow')).to.not.contain('end');
      });
    });
  });
});

describe('empty grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    flushGrid(grid);
  });

  it('should not have vertical scroll bars', async () => {
    await nextRender();
    expect(grid.clientHeight).not.to.be.below(grid.$.header.clientHeight + grid.$.items.clientHeight);
  });
});

describe('scroll on attach', () => {
  it('should not scroll document on attach', () => {
    document.body.style.paddingTop = '10000px';
    document.documentElement.scrollTop = 10000;
    const scrollTop = document.documentElement.scrollTop;
    const grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    const newScrollTop = document.documentElement.scrollTop;
    // Cleanup
    document.body.style.paddingTop = '';

    expect(scrollTop).to.equal(newScrollTop);
  });
});
