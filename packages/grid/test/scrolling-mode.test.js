import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce } from '@vaadin/testing-helpers';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '@vaadin/vaadin-template-renderer';
import { flushGrid, infiniteDataProvider, scrollToEnd } from './helpers.js';
import '../vaadin-grid.js';

describe('scrolling mode', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
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
    it('bottom right', () => {
      grid.scrollToIndex(0);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom right');
    });

    it('bottom left', () => {
      grid.scrollToIndex(0);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('bottom left');
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

    it('top right', () => {
      scrollToEnd(grid);
      flushGrid(grid);
      expect(grid.getAttribute('overflow')).to.equal('top right');
    });

    it('top left', () => {
      scrollToEnd(grid);
      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
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
