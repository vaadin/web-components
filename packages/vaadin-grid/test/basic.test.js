import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { aTimeout, fixtureSync } from '@open-wc/testing-helpers';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import {
  flushGrid,
  getBodyCellContent,
  getCell,
  getCellContent,
  getFirstVisibleItem,
  infiniteDataProvider,
  listenOnce,
  scrollToEnd
} from './helpers.js';
import '@polymer/iron-list/iron-list.js';
import '../vaadin-grid.js';

describe('basic features', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 300px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  describe('toggle attribute', () => {
    let node;

    beforeEach(() => {
      node = {};
      node.setAttribute = sinon.spy();
      node.removeAttribute = sinon.spy();
    });

    it('should set attribute', () => {
      node.hasAttribute = () => false;
      grid._toggleAttribute('foo', true, node);
      expect(node.setAttribute.called).to.be.true;
    });

    it('should not re-set attribute', () => {
      node.hasAttribute = () => true;
      grid._toggleAttribute('foo', true, node);
      expect(node.setAttribute.called).to.be.false;
    });

    it('should remove attribute', () => {
      node.hasAttribute = () => true;
      grid._toggleAttribute('foo', false, node);
      grid._toggleAttribute('foo', '', node);
      grid._toggleAttribute('foo', undefined, node);
      expect(node.removeAttribute.callCount).to.equal(3);
    });

    it('should not re-remove attribute', () => {
      node.hasAttribute = () => false;
      grid._toggleAttribute('foo', false, node);
      grid._toggleAttribute('foo', '', node);
      grid._toggleAttribute('foo', undefined, node);
      expect(node.removeAttribute.called).to.be.false;
    });
  });

  it('should notify `size` property', (done) => {
    expect(grid.size).not.equal(10);

    listenOnce(grid, 'size-changed', () => {
      expect(grid.size).equal(10);
      done();
    });
    grid.size = 10;
  });

  it('should not warn on init', (done) => {
    const warn = sinon.stub(console, 'warn');
    const func = grid._warnPrivateAPIAccess;
    sinon.stub(grid, '_warnPrivateAPIAccess').callsFake((a) => {
      func.bind(grid)(a);
      afterNextRender(grid, () => {
        if (!done._called) {
          done._called = true;
          warn.restore();
          expect(warn.called).to.be.false;
          done();
        }
      });
    });
  });

  it('check physical item heights', () => {
    const rowHeight = grid._physicalItems[0].offsetHeight;

    grid._physicalItems.forEach((item) => expect(item.offsetHeight).to.be.closeTo(rowHeight, 1));
  });

  it('check visible item count', () => {
    grid.size = 10;
    flushGrid(grid);
    expect(grid.shadowRoot.querySelectorAll('tbody tr:not([hidden])').length).to.eql(10);
  });

  it('first visible index', () => {
    expect(grid.firstVisibleIndex).to.equal(0);
    grid.scroll(0, grid._physicalAverage * 50);
    grid._scrollHandler();
    expect(grid.firstVisibleIndex).to.equal(50);
  });

  it('last visible index', () => {
    const actualHeight = grid._physicalAverage;
    grid._scrollToIndex(2);
    expect(grid.lastVisibleIndex, Math.ceil((grid._scrollTop + grid.offsetHeight) / actualHeight - 1));
  });

  it('should change the opacity of cell content in loading rows from 1 to 0 and back', () => {
    const firstRow = grid.shadowRoot.querySelector('#items [part~="row"]');
    const cellContent = getBodyCellContent(grid, 0, 0);

    expect(window.getComputedStyle(cellContent).opacity).to.eql('1');

    firstRow.setAttribute('loading', '');

    expect(window.getComputedStyle(cellContent).opacity).to.eql('0');

    firstRow.removeAttribute('loading', '');

    expect(window.getComputedStyle(cellContent).opacity).to.eql('1');
  });

  it('scroll to index', () => {
    grid.size = 100;

    grid._scrollToIndex(30);
    expect(grid.firstVisibleIndex).to.equal(30);

    grid._scrollToIndex(0);
    expect(grid.firstVisibleIndex).to.equal(0);

    grid._scrollToIndex(99);

    const rowHeight = getFirstVisibleItem(grid).offsetHeight;
    const viewportHeight = grid.offsetHeight;
    const itemsPerViewport = viewportHeight / rowHeight;

    expect(grid.firstVisibleIndex, Math.floor(grid.size - itemsPerViewport));
    grid._scrollToIndex(0);
    // make the height of the viewport same as the height of the row
    // and scroll to the last item
    grid.style.height = grid._physicalItems[0].offsetHeight - 2 + 'px';
    grid.notifyResize();
    grid._scrollToIndex(99);
    expect(grid.firstVisibleIndex).to.equal(99);
  });

  it('scroll to top', () => {
    grid._scrollToIndex(99);
    grid.scroll(0, 0);
    expect(grid._scrollTop).to.equal(0);
  });

  it('scroll to a given scrollTop', () => {
    grid._scrollToIndex(99);
    grid.scroll(0, 500);
    expect(grid.$.table.scrollTop).to.equal(500);
  });

  it('should not scroll when size changes', () => {
    grid._scrollToIndex(99);
    const top = grid.$.table.scrollTop;

    grid.size += 1;

    expect(grid.$.table.scrollTop).to.eql(top);
    expect(top).to.be.greaterThan(0);
  });

  it('reset items', () => {
    grid.size = 100;

    expect(getCellContent(getFirstVisibleItem(grid)).textContent).to.equal('0');

    grid.size = 0;
    expect(getFirstVisibleItem(grid), null);

    grid.size = 100;
    expect(getCellContent(getFirstVisibleItem(grid)).textContent).to.equal('0');
  });

  it('reorder rows', () => {
    grid.size = 1000;
    [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].forEach((steps) => {
      grid.$.table.scrollTop = 5000 + grid._physicalAverage * steps;
      grid._scrollHandler();
      grid._debounceScrolling.flush();
      // Expect the physical rows to be in order after scrolling
      const rows = grid.$.items.querySelectorAll('tr');

      rows.forEach((row, index) => {
        if (index > 0) {
          expect(row.index).to.equal(rows[index - 1].index + 1);
        }
      });
    });
  });

  it('reorder should not affect light dom', () => {
    grid.size = 1000;
    const wrappers = grid.querySelectorAll('vaadin-grid-cell-content');

    [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].forEach((steps) => {
      grid.$.table.scrollTop = 5000 + grid._physicalAverage * steps;
      grid._scrollHandler();
      grid._debounceScrolling.flush();

      const newWrappers = grid.querySelectorAll('vaadin-grid-cell-content');
      // Expect the light dom order unchanged
      expect(newWrappers).to.eql(wrappers);
    });
  });

  it('should not throw after setting size to 0', () => {
    grid.size = 1000;
    scrollToEnd(grid);
    expect(() => {
      grid.size = 0;
      flushGrid(grid);
    }).not.to.throw();
  });

  // The following could not be tested if window is not focused.
  if (!window.document.hasFocus()) {
    // Try to get window focus.
    window.top && window.top.focus();
    window.focus();
  }
  (window.document.hasFocus() ? it : it.skip)('reorder should keep focused row', () => {
    grid.size = 1000;
    getCell(grid, 10).focus();
    [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].forEach((steps) => {
      const activeElement = grid.shadowRoot.activeElement;
      grid.$.table.scrollTop = 5000 + grid._physicalAverage * steps;
      grid._scrollHandler();
      grid._debounceScrolling.flush();

      // Expect the physical rows to be in order after scrolling
      const rows = grid.$.items.querySelectorAll('tr');

      rows.forEach((row, index) => {
        if (index > 0) {
          expect(row.index).to.equal(rows[index - 1].index + 1);
        }
      });

      expect(document.activeElement).to.equal(grid);
      expect(grid.shadowRoot.activeElement).to.equal(activeElement);
    });
  });

  it('should have flex: 1 1 auto style', () => {
    expect(parseInt(window.getComputedStyle(grid).getPropertyValue('flex-shrink'))).to.equal(1);
    expect(parseInt(window.getComputedStyle(grid).getPropertyValue('flex-grow'))).to.equal(1);
    expect(window.getComputedStyle(grid).getPropertyValue('flex-basis')).to.equal('auto');
  });
});

describe('flex child', () => {
  let layout;
  let grid;

  beforeEach(() => {
    layout = fixtureSync(`
      <div style="display: flex; width: 300px; height: 300px;">
        <div style="width: 100px; height: 100px; flex-shrink: 0;">Layout sibling</div>
        <vaadin-grid size="1000">
          <vaadin-grid-column>
            <template>[[index]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      </div>
    `);
    grid = layout.querySelector('vaadin-grid');
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should have 400px height by default', () => {
    expect(grid.getBoundingClientRect().height).to.be.closeTo(400, 1);
  });

  describe('in horizontal layout', () => {
    it('should stretch width', () => {
      expect(grid.getBoundingClientRect().width).to.be.closeTo(200, 1);
      expect(grid.$.scroller.getBoundingClientRect().width).to.be.closeTo(200 - 2, 1);
    });

    it('should not stretch height', () => {
      expect(grid.getBoundingClientRect().height).to.be.closeTo(400, 1);
      expect(grid.$.scroller.getBoundingClientRect().height).to.be.closeTo(400 - 2, 1);
    });
  });

  describe('in vertical layout', () => {
    beforeEach(() => {
      layout.style.flexDirection = 'column';
    });

    it('should stretch width', () => {
      expect(grid.getBoundingClientRect().width).to.be.closeTo(300, 1);
      expect(grid.$.scroller.getBoundingClientRect().width).to.be.closeTo(300 - 2, 1);
    });

    it('should have a visible header after row reorder', async () => {
      grid.querySelector('vaadin-grid-column').header = 'header';
      grid.scrollToIndex(300);
      await aTimeout(0);
      flushGrid(grid);
      const { left, top } = grid.getBoundingClientRect();
      const cell = grid._cellFromPoint(left + 1, top + 1);
      expect(grid.$.header.contains(cell)).to.be.true;
    });

    it('should stretch height', () => {
      expect(grid.getBoundingClientRect().height).to.be.closeTo(200, 1);
      expect(grid.$.scroller.getBoundingClientRect().height).to.be.closeTo(200 - 2, 1);
    });
  });
});
