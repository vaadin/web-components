import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
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
  let grid, column;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 300px;" size="1000">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    column = grid.firstElementChild;
    column.renderer = sinon.spy((root, _, model) => {
      root.textContent = model.index;
    });
    flushGrid(grid);
    await nextFrame();
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
    expect(grid.shadowRoot.querySelectorAll('tbody tr:not([hidden]):not(#emptystaterow)').length).to.eql(10);
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

  it('should change the visibility of cell content in loading rows', () => {
    const firstRow = grid.shadowRoot.querySelector('#items [part~="row"]');
    const cellContent = getBodyCellContent(grid, 0, 0);

    expect(window.getComputedStyle(cellContent).visibility).to.eql('visible');

    firstRow.setAttribute('loading', '');

    expect(window.getComputedStyle(cellContent).visibility).to.eql('hidden');

    firstRow.removeAttribute('loading', '');

    expect(window.getComputedStyle(cellContent).visibility).to.eql('visible');
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

  it('should restore scroll position when moving within DOM', () => {
    grid.scrollToIndex(99);
    const top = grid.$.table.scrollTop;

    const wrapper = fixtureSync('<div></div>');
    wrapper.appendChild(grid);

    expect(grid.$.table.scrollTop).to.eql(top);
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
    window.top?.focus();
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
    const lastRowSlot = grid.shadowRoot.querySelector('[part~="last-row"] slot');
    expect(lastRowSlot.assignedNodes()[0].textContent).to.equal(String(grid.size - 1));
  });

  it('should have attribute last on the last body row after resize', () => {
    grid.size = 2;
    const lastRowSlot = grid.shadowRoot.querySelector('[part~="last-row"] slot');
    expect(lastRowSlot.assignedNodes()[0].textContent).to.equal(String(grid.size - 1));
  });

  it('should not have attribute last on the previous last body row after resize', () => {
    grid.size = 2;
    grid.size = 3;
    expect(grid.shadowRoot.querySelectorAll('[part~="last-row"]').length).to.equal(1);
  });

  it('should not have attribute last on a row when size incresed beyond viewport ', () => {
    grid.size = 2;
    grid.size = 1000;
    expect(grid.shadowRoot.querySelectorAll('[part~="last-row"]').length).to.equal(0);
  });

  function getFirstCellRenderCount() {
    return column.renderer.getCalls().filter((call) => call.args[2].index === 0).length;
  }

  it('should have rendered the first cell once', () => {
    expect(getFirstCellRenderCount()).to.equal(1);
  });

  it('should re-render the cell when last row enters the viewport on resize', () => {
    column.renderer.resetHistory();
    grid.size = 1;
    expect(getFirstCellRenderCount()).to.equal(1);
  });

  it('should re-render the cell when last row leaves the viewport on resize', () => {
    grid.size = 1;
    column.renderer.resetHistory();
    grid.size = 1000;
    expect(getFirstCellRenderCount()).to.equal(1);
  });

  it('should not re-render the cell when last row change happens outside the viewport', () => {
    column.renderer.resetHistory();
    grid.size = 100;
    grid.size = 200;
    expect(getFirstCellRenderCount()).to.equal(0);
  });

  it('should not re-render the cell when last row change happens on other visible rows', () => {
    column.renderer.resetHistory();
    grid.size = 2;
    grid.size = 3;
    expect(getFirstCellRenderCount()).to.equal(0);
  });

  it('should have rendered the first cell once on resize from 0', () => {
    column.renderer.resetHistory();
    grid.size = 0;
    grid.size = 1;
    expect(getFirstCellRenderCount()).to.equal(1);
  });

  it('should render all items with varying row heights when all rows visible', async () => {
    grid = fixtureSync(`
      <vaadin-grid all-rows-visible>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    const rowHeights = [30, 100, 30, 30, 100, 30];
    grid.items = rowHeights.map((value) => {
      return { height: value };
    });
    column = grid.firstElementChild;
    column.renderer = (root, _, model) => {
      root.innerHTML = `<button style="height:${model.item.height}px">Button</button>`;
    };
    flushGrid(grid);
    await nextFrame();
    expect(getPhysicalItems(grid).length).to.equal(rowHeights.length);
    const sum = rowHeights.reduce((acc, value) => acc + value, 0);
    expect(grid.clientHeight).to.be.at.least(sum);
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

describe('empty state', () => {
  let grid;

  function getEmptyState() {
    return grid.querySelector('[slot="empty-state"]');
  }

  function emptyStateVisible() {
    return getEmptyState()?.offsetHeight > 0;
  }

  function itemsBodyVisible() {
    return grid.$.items.offsetHeight > 0;
  }

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="name"></vaadin-grid-column>
        <div slot="empty-state">
          No items
        </div>
      </vaadin-grid>
    `);

    grid.querySelector('vaadin-grid-column').footerRenderer = (root) => {
      root.textContent = 'Footer';
    };
    await nextFrame();
  });

  it('should show empty state', () => {
    expect(emptyStateVisible()).to.be.true;
    expect(itemsBodyVisible()).to.be.false;
  });

  it('should not show empty state when grid has items', async () => {
    grid.items = [{ name: 'foo' }];
    await nextFrame();
    expect(emptyStateVisible()).to.be.false;
    expect(itemsBodyVisible()).to.be.true;
  });

  it('should not show empty state when empty state content is not defined', async () => {
    grid.removeChild(getEmptyState());
    await nextFrame();
    expect(emptyStateVisible()).to.be.false;
    expect(itemsBodyVisible()).to.be.true;
  });

  it('should not throw on empty state click', () => {
    expect(() => getEmptyState().click()).not.to.throw();
  });

  it('should not dispatch cell-activate on empty state click', () => {
    const spy = sinon.spy();
    grid.addEventListener('cell-activate', spy);
    getEmptyState().click();
    expect(spy.called).to.be.false;
  });

  describe('bounds', () => {
    let gridRect, emptyStateCellRect, headerRect, footerRect;

    beforeEach(() => {
      gridRect = grid.getBoundingClientRect();
      emptyStateCellRect = grid.$.emptystatecell.getBoundingClientRect();
      headerRect = grid.$.header.getBoundingClientRect();
      footerRect = grid.$.footer.getBoundingClientRect();
    });

    it('should cover the viewport', () => {
      expect(emptyStateCellRect.top).to.be.closeTo(headerRect.bottom, 1);
      expect(emptyStateCellRect.bottom).to.be.closeTo(footerRect.top, 1);
      expect(emptyStateCellRect.left).to.be.closeTo(gridRect.left, 1);
      expect(emptyStateCellRect.right).to.be.closeTo(gridRect.right, 1);
    });

    it('should push footer to the bottom of the viewport', () => {
      expect(footerRect.bottom).to.be.closeTo(gridRect.bottom, 1);
    });

    it('should not scroll horizontally with the columns', () => {
      grid.append(
        ...Array.from({ length: 10 }, () => fixtureSync('<vaadin-grid-column path="name"></vaadin-grid-column>')),
      );
      flushGrid(grid);

      grid.$.table.scrollLeft = grid.$.table.scrollWidth;
      emptyStateCellRect = grid.$.emptystatecell.getBoundingClientRect();
      expect(emptyStateCellRect.left).to.be.closeTo(gridRect.left, 1);
      expect(emptyStateCellRect.right).to.be.closeTo(gridRect.right, 1);
    });

    it('should not scroll verticaly with the columns', () => {
      getEmptyState().innerHTML = Array.from({ length: 10 }, () => '<h2>Lorem ipsum dolor sit amet</h2>').join('');
      flushGrid(grid);

      grid.$.emptystatecell.scrollTop = grid.$.emptystatecell.scrollHeight;
      expect(grid.$.emptystatecell.scrollTop).to.be.greaterThan(0);
      emptyStateCellRect = grid.$.emptystatecell.getBoundingClientRect();
      expect(emptyStateCellRect.top).to.be.closeTo(headerRect.bottom, 1);
      expect(emptyStateCellRect.bottom).to.be.closeTo(footerRect.top, 1);
    });

    it('should not overflow on all-rows-visible', () => {
      grid.allRowsVisible = true;
      grid.style.width = '200px';
      getEmptyState().innerHTML = Array.from({ length: 10 }, () => '<h2>Lorem ipsum dolor sit amet</h2>').join('');
      flushGrid(grid);

      const emptyStateRect = getEmptyState().getBoundingClientRect();
      gridRect = grid.getBoundingClientRect();
      headerRect = grid.$.header.getBoundingClientRect();
      footerRect = grid.$.footer.getBoundingClientRect();
      expect(emptyStateRect.top).to.be.greaterThan(headerRect.bottom);
      expect(emptyStateRect.bottom).to.be.lessThan(footerRect.top);
      expect(emptyStateRect.left).to.be.greaterThan(gridRect.left);
      expect(emptyStateRect.right).to.be.lessThan(gridRect.right);
    });
  });
});
