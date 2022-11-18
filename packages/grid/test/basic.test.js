import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import {
  flushGrid,
  getBodyCellContent,
  getCell,
  getCellContent,
  getFirstVisibleItem,
  getLastVisibleItem,
  getPhysicalAverage,
  getPhysicalItems,
  infiniteDataProvider,
  scrollGrid,
  scrollToEnd,
} from './helpers.js';

describe('basic features', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 300px;" size="1000">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    flushGrid(grid);
  });

  it('should notify `size` property', () => {
    const spy = sinon.spy();
    grid.addEventListener('size-changed', spy);
    grid.size = 10;
    expect(spy.calledOnce).to.be.true;
  });

  it('check physical item heights', () => {
    const physicalItems = getPhysicalItems(grid);
    const rowHeight = physicalItems[0].offsetHeight;
    expect(rowHeight).to.be.above(0);
    physicalItems.forEach((item) => expect(item.offsetHeight).to.be.closeTo(rowHeight, 1));
  });

  it('check visible item count', () => {
    grid.size = 10;
    flushGrid(grid);
    expect(grid.shadowRoot.querySelectorAll('tbody tr:not([hidden])').length).to.eql(10);
  });

  it('first visible item', () => {
    expect(getFirstVisibleItem(grid).index).to.equal(0);
    scrollGrid(grid, 0, getPhysicalAverage(grid) * 50);
    flushGrid(grid);
    expect(getFirstVisibleItem(grid).index).to.equal(50);
  });

  it('last visible index', () => {
    const physicalAverage = getPhysicalAverage(grid);
    const lastIndex = Math.floor(grid.offsetHeight / physicalAverage);
    expect(getLastVisibleItem(grid).index).to.equal(lastIndex);
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

    grid.scrollToIndex(30);
    expect(getFirstVisibleItem(grid).index).to.equal(30);

    grid.scrollToIndex(0);
    expect(getFirstVisibleItem(grid).index).to.equal(0);

    grid.scrollToIndex(99);

    const rowHeight = getFirstVisibleItem(grid).offsetHeight;
    const viewportHeight = grid.offsetHeight;
    const itemsPerViewport = viewportHeight / rowHeight;

    expect(getFirstVisibleItem(grid).index, Math.floor(grid.size - itemsPerViewport));
    grid.scrollToIndex(0);
    // Make the height of the viewport same as the height of the row
    // and scroll to the last item
    grid.style.height = `${getPhysicalItems(grid)[0].offsetHeight - 2}px`;

    flushGrid(grid);

    grid.scrollToIndex(99);
    expect(getFirstVisibleItem(grid).index).to.equal(99);
  });

  it('scroll to top', () => {
    grid.scrollToIndex(99);
    scrollGrid(grid, 0, 0);
    expect(grid.$.table.scrollTop).to.equal(0);
  });

  it('scroll to a given scrollTop', () => {
    grid.scrollToIndex(99);
    scrollGrid(grid, 0, 500);
    expect(grid.$.table.scrollTop).to.equal(500);
  });

  it('should not scroll when size changes', () => {
    grid.scrollToIndex(99);
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
      grid.$.table.scrollTop = 5000 + getPhysicalAverage(grid) * steps;
      flushGrid(grid);

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
      grid.$.table.scrollTop = 5000 + getPhysicalAverage(grid) * steps;
      flushGrid(grid);

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

      grid.$.table.scrollTop = 5000 + getPhysicalAverage(grid) * steps;
      flushGrid(grid);

      expect(document.activeElement).to.equal(grid);
      expect(grid.shadowRoot.activeElement).to.equal(activeElement);
    });
  });

  it('should have flex: 1 1 auto style', () => {
    expect(parseInt(window.getComputedStyle(grid).getPropertyValue('flex-shrink'))).to.equal(1);
    expect(parseInt(window.getComputedStyle(grid).getPropertyValue('flex-grow'))).to.equal(1);
    expect(window.getComputedStyle(grid).getPropertyValue('flex-basis')).to.equal('auto');
  });

  it('should have attribute last on the last body row', () => {
    grid.scrollToIndex(grid.size - 1);
    const lastRowSlot = grid.shadowRoot.querySelector('[part~="row"][last] slot');
    expect(lastRowSlot.assignedNodes()[0].textContent).to.equal(String(grid.size - 1));
  });

  it('should have attribute last on the last body row after resize', () => {
    grid.size = 2;
    const lastRowSlot = grid.shadowRoot.querySelector('[part~="row"][last] slot');
    expect(lastRowSlot.assignedNodes()[0].textContent).to.equal(String(grid.size - 1));
  });
});

describe('flex child', () => {
  let layout, grid, column;

  beforeEach(() => {
    layout = fixtureSync(`
      <div style="display: flex; width: 300px; height: 300px;">
        <div style="width: 100px; height: 100px; flex-shrink: 0;">Layout sibling</div>
        <vaadin-grid size="1000">
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      </div>
    `);
    grid = layout.querySelector('vaadin-grid');
    column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, model) => {
      root.textContent = model.index;
    };
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
      column.header = 'header';
      grid.scrollToIndex(300);
      await aTimeout(0);
      flushGrid(grid);
      const { left, top } = grid.getBoundingClientRect();

      oneEvent(grid.$.table, 'scroll');
      flushGrid(grid);

      const cell = grid._cellFromPoint(left + 1, top + 1);
      expect(grid.$.header.contains(cell)).to.be.true;
    });

    it('should stretch height', () => {
      expect(grid.getBoundingClientRect().height).to.be.closeTo(200, 1);
      expect(grid.$.scroller.getBoundingClientRect().height).to.be.closeTo(200 - 2, 1);
    });
  });
});
