import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import '../vaadin-grid.js';
import { flushGrid, getHeaderCellContent, onceResized } from './helpers.js';

const timeouts = {
  UPDATE_CONTENT_VISIBILITY: 100,
};

describe('lazy column rendering', () => {
  let grid, cellContent, columns;

  function resetRenderers() {
    columns.forEach((column) => {
      column.renderer.resetHistory();
    });
  }

  function getBodyCell(rowIndex, columnIndex) {
    const row = grid._getVisibleRows()[rowIndex];
    return [...row.children].find((cell) => cell.firstElementChild.assignedNodes()[0].__columnIndex === columnIndex);
  }

  function getBodyCellSlot(columnIndex) {
    return getBodyCell(0, columnIndex).firstElementChild;
  }

  function isBodyCellRendered(columnIndex) {
    return columns[columnIndex].renderer.called;
  }

  function isBodyCellContentHidden(columnIndex) {
    return !getBodyCell(0, columnIndex);
  }

  function getBodyCellContent(columnIndex) {
    const slot = getBodyCellSlot(columnIndex);
    return slot.assignedNodes()[0];
  }

  function isBodyCellContentUpToDate(columnIndex) {
    return getBodyCellContent(columnIndex).textContent === `${cellContent} ${columnIndex}`;
  }

  function expectBodyCellUpdated(columnIndex) {
    expect(isBodyCellRendered(columnIndex)).to.be.true;
    expect(isBodyCellContentUpToDate(columnIndex)).to.be.true;
  }

  function expectBodyCellNotRendered(columnIndex) {
    expect(isBodyCellRendered(columnIndex)).to.be.false;
    expect(isBodyCellContentHidden(columnIndex)).to.be.true;
  }

  function getLastVisibleColumnIndex() {
    return grid._getColumnsInOrder().findIndex((column, index, columns) => {
      return (
        column._sizerCell.getBoundingClientRect().left < grid.getBoundingClientRect().right &&
        (!columns[index + 1] ||
          columns[index + 1]._sizerCell.getBoundingClientRect().left > grid.getBoundingClientRect().right)
      );
    });
  }

  beforeEach(async () => {
    grid = fixtureSync(`<vaadin-grid style="width: 400px;"></vaadin-grid>`);
    cellContent = 'cell';

    columns = [];
    for (let i = 0; i < 10; i++) {
      const column = document.createElement('vaadin-grid-column');
      column.header = `Col ${i}`;

      // eslint-disable-next-line @typescript-eslint/no-loop-func
      column.renderer = Sinon.spy((root) => {
        root.__columnIndex = i;
        root.textContent = `${cellContent} ${i}`;
      });

      columns.push(column);
      grid.appendChild(column);
    }

    grid.items = [{ name: `Item 1` }];

    grid.columnRendering = 'lazy';
    // Wait for the initial resize observer callback
    await onceResized(grid);
    flushGrid(grid);
  });

  it('should render columns inside the viewport', () => {
    expectBodyCellUpdated(0);
    expectBodyCellUpdated(1);
  });

  it('should not render columns outside the viewport', () => {
    expectBodyCellNotRendered(getLastVisibleColumnIndex() + 1);
    expectBodyCellNotRendered(columns.length - 1);
  });

  it('new rows - should render columns inside the viewport', () => {
    resetRenderers();
    grid.items = [{ name: `Item 1` }, { name: `Item 2` }];
    expectBodyCellUpdated(0);
    expectBodyCellUpdated(1);
  });

  it('new rows - should not render columns outside the viewport', () => {
    resetRenderers();
    grid.items = [{ name: `Item 1` }, { name: `Item 2` }];
    expectBodyCellNotRendered(getLastVisibleColumnIndex() + 1);
    expectBodyCellNotRendered(columns.length - 1);
  });

  it('should render columns revealed columns on resize', async () => {
    grid.style.width = `${grid.$.table.scrollWidth}px`;
    await onceResized(grid);
    expectBodyCellUpdated(getLastVisibleColumnIndex());
    expectBodyCellUpdated(columns.length - 1);
  });

  it('should always render header cells', () => {
    expect(getHeaderCellContent(grid, 0, columns.length - 1).textContent).to.equal(`Col ${columns.length - 1}`);
  });

  it('should render frozen to end columns', async () => {
    columns.at(-1).frozenToEnd = true;
    await nextFrame();
    expectBodyCellUpdated(columns.length - 1);
  });

  it('should position frozen to end columns correctly', async () => {
    const column = columns.at(-1);
    column.frozenToEnd = true;
    await nextFrame();

    const frozenToEndBodyCell = getBodyCell(0, 9);
    const frozenToEndHeaderCell = column._headerCell;

    expect(frozenToEndBodyCell.getBoundingClientRect().left).to.equal(
      frozenToEndHeaderCell.getBoundingClientRect().left,
    );
    expect(frozenToEndBodyCell.getBoundingClientRect().right).to.equal(
      frozenToEndHeaderCell.getBoundingClientRect().right,
    );
  });

  it('should switch back to eager columns', () => {
    grid.columnRendering = 'eager';

    expectBodyCellUpdated(0);
    expectBodyCellUpdated(1);
    expectBodyCellUpdated(2);
    expectBodyCellUpdated(columns.length - 1);
  });

  it('should switch back to lazy columns', () => {
    grid.columnRendering = 'eager';
    resetRenderers();
    grid.columnRendering = 'lazy';

    expectBodyCellNotRendered(getLastVisibleColumnIndex() + 1);
    expectBodyCellNotRendered(columns.length - 1);
  });

  it('should have a larger row height when details opened', () => {
    // Disable cell padding for this test
    fixtureSync(`
        <style>
          vaadin-grid-cell-content {
            padding: 0;
          }
        </style>
      `);

    grid.items = [{ name: `Item 1` }, { name: `Item 2` }];

    // Opend details for the first row
    const detailsHeight = 100;
    grid.rowDetailsRenderer = (root) => {
      root.innerHTML = `<div style="height: ${detailsHeight}px;">Details</div>`;
    };
    grid.detailsOpenedItems = [grid.items[0]];

    flushGrid(grid);
    const firstRect = getBodyCell(0, 0).getBoundingClientRect();
    const secondRect = getBodyCell(1, 0).getBoundingClientRect();
    expect(secondRect.top).to.equal(firstRect.bottom + detailsHeight);
  });

  describe('scroll horizontally', () => {
    async function scrollHorizontallyTo(scrollLeft) {
      grid.$.table.scrollLeft = scrollLeft;
      await oneEvent(grid.$.table, 'scroll');
    }

    /**
     * Expect the cells DOM order to match the column order
     */
    function expectCellsDomOrderToMatchColumnOrder() {
      const firstRow = grid._getVisibleRows()[0];
      const expectedOrder = [...firstRow.children].sort(
        (a, b) => columns.indexOf(a._column) - columns.indexOf(b._column),
      );
      expect(expectedOrder).to.deep.equal([...firstRow.children]);
    }

    /**
     * Expect the cells visual order to match the column order
     */
    function expectCellsVisualOrderToMatchColumnOrder() {
      const firstRow = grid._getVisibleRows()[0];
      [...firstRow.children].forEach((cell) => {
        expect(cell.getBoundingClientRect().left).to.equal(cell._column._headerCell.getBoundingClientRect().left);
        expect(cell.getBoundingClientRect().right).to.equal(cell._column._headerCell.getBoundingClientRect().right);
      });
    }

    beforeEach(async () => {
      resetRenderers();
      await scrollHorizontallyTo(grid.$.table.scrollWidth);
      // Wait for the debouncer to flush
      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY);
    });

    it('should render columns inside the viewport', () => {
      expectBodyCellUpdated(columns.length - 2);
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should not render columns outside the viewport', () => {
      expectBodyCellNotRendered(0);
      expectBodyCellNotRendered(1);
    });

    it('should not render columns outside the viewport on update', () => {
      grid.requestContentUpdate();
      expectBodyCellNotRendered(0);
      expectBodyCellNotRendered(1);
    });

    it('should render columns revealed columns on resize', async () => {
      grid.style.width = `${grid.$.table.scrollWidth}px`;
      await onceResized(grid);
      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
    });

    it('should render frozen columns', async () => {
      columns[0].frozen = true;
      await nextFrame();
      expectBodyCellUpdated(0);
    });

    it.skip('should debounce scrolling', async () => {
      resetRenderers();

      // Scroll back to the beginning
      await scrollHorizontallyTo(0);
      // Half of the debounce timeout so the debouncer is not yet executed
      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY / 2);
      expectBodyCellNotRendered(0);

      // Scroll back to the end
      await scrollHorizontallyTo(grid.$.table.scrollWidth);
      // Half of the debounce timeout so the debouncer is not yet executed
      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY / 2);

      // Scroll back to the beginning
      await scrollHorizontallyTo(0);
      // Half of the debounce timeout so the debouncer is not yet executed
      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY / 2);
      expectBodyCellNotRendered(0);

      // Seconf half of the debounce timeout so the debouncer is executed
      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY / 2);
      expectBodyCellUpdated(0);
    });

    it('should update content of previously rendererd cells on revisit', async () => {
      const index = columns.length - 1;
      expect(getBodyCellContent(index).textContent).to.equal(`cell ${index}`);

      cellContent = 'updated';
      grid.requestContentUpdate();
      expect(getBodyCellContent(index).textContent).to.equal(`updated ${index}`);

      // Scroll back to the beginning
      await scrollHorizontallyTo(0);
      // Wait for the debouncer to flush
      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY);

      expect(getBodyCellContent(0).textContent).to.equal('updated 0');
    });

    it('should maintain the sequential DOM order of the cells', async () => {
      expectCellsDomOrderToMatchColumnOrder();

      // Scroll back a bit
      await scrollHorizontallyTo(grid.$.table.scrollLeft - 100);
      await scrollHorizontallyTo(grid.$.table.scrollLeft - 100);

      await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY);
      expectCellsDomOrderToMatchColumnOrder();
    });

    it('should visually position the rendered cells correctly', async () => {
      expectCellsVisualOrderToMatchColumnOrder();
    });

    it('should visually position the rendered cells correctly after scrolling', async () => {
      // Scroll back a bit
      await scrollHorizontallyTo(grid.$.table.scrollLeft - 100);
      await scrollHorizontallyTo(grid.$.table.scrollLeft - 100);

      expectCellsVisualOrderToMatchColumnOrder();
    });

    it('should visually position the frozen cells correctly', async () => {
      columns[0].frozen = true;
      await nextFrame();

      expectCellsVisualOrderToMatchColumnOrder();
    });

    it('should visually position the frozen to end cells correctly', async () => {
      columns.at(-1).frozenToEnd = true;
      await nextFrame();

      expectCellsVisualOrderToMatchColumnOrder();
    });
  });
});
