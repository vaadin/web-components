import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, listenOnce, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, infiniteDataProvider, scrollToEnd } from './helpers.js';

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
    it('bottom end', async () => {
      grid.scrollToIndex(0);
      await nextFrame();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom end');
    });

    it('bottom start', async () => {
      grid.scrollToIndex(0);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      await nextFrame();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom start');
    });

    it('bottom top', async () => {
      grid.scrollToIndex(1);
      await nextFrame();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('top');
      expect(grid.getAttribute('overflow')).to.contain('bottom');
    });

    it('start end', async () => {
      grid.$.table.scrollLeft = 1;
      await nextFrame();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.contain('start');
      expect(grid.getAttribute('overflow')).to.contain('end');
    });

    it('top end', async () => {
      scrollToEnd(grid);
      await nextFrame();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top end');
    });

    it('top start', async () => {
      scrollToEnd(grid);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      await nextFrame();
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top start');
    });

    it('update on resize', async () => {
      grid.style.width = '200px';
      await nextResize(grid);
      await nextFrame();
      expect(grid.getAttribute('overflow')).to.equal('bottom');

      grid.style.width = '50px';
      await nextResize(grid);
      await nextFrame();
      expect(grid.getAttribute('overflow')).to.equal('bottom end');
    });

    describe('RTL', () => {
      beforeEach(() => {
        grid.setAttribute('dir', 'rtl');
      });

      it('end', async () => {
        await nextFrame();
        flushGrid(grid);
        expect(grid.getAttribute('overflow')).to.contain('end');
        expect(grid.getAttribute('overflow')).to.not.contain('start');
      });

      it('start end', async () => {
        grid.$.table.scrollLeft = -1;
        await nextFrame();
        flushGrid(grid);
        expect(grid.getAttribute('overflow')).to.contain('start');
        expect(grid.getAttribute('overflow')).to.contain('end');
      });

      it('start', async () => {
        grid.$.table.scrollLeft = -grid.$.table.scrollWidth;
        await nextFrame();
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
