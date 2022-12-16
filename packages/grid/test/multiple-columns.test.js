import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import '../vaadin-grid.js';
import {
  flushGrid,
  getBodyCellContent,
  getCell,
  getContainerCell,
  getHeaderCellContent,
  onceResized,
} from './helpers.js';

const timeouts = {
  UPDATE_CONTENT_VISIBILITY: 100,
};

describe('multiple columns', () => {
  let grid, cellContent, columns;

  function resetRenderers() {
    columns.forEach((column) => {
      column.renderer.resetHistory();
    });
  }

  function getBodyCellSlot(columnIndex) {
    return getCell(grid, columnIndex).firstElementChild;
  }

  function isBodyCellRendered(columnIndex) {
    return columns[columnIndex].renderer.called;
  }

  function isBodyCellContentUpToDate(columnIndex) {
    const slot = getBodyCellSlot(columnIndex);
    return !!slot && slot.assignedNodes()[0].textContent === cellContent;
  }

  function expectBodyCellUpdated(columnIndex) {
    expect(isBodyCellRendered(columnIndex)).to.be.true;
    expect(isBodyCellContentUpToDate(columnIndex)).to.be.true;
  }

  function expectBodyCellNotRendered(columnIndex) {
    expect(isBodyCellRendered(columnIndex)).to.be.false;
    expect(getBodyCellSlot(columnIndex)).to.be.null;
  }

  beforeEach(() => {
    grid = fixtureSync(`<vaadin-grid style="width: 200px;"></vaadin-grid>`);
    cellContent = 'cell';

    columns = [];
    for (let i = 0; i < 10; i++) {
      const column = document.createElement('vaadin-grid-column');
      column.header = `Col ${i}`;

      column.renderer = Sinon.spy((root) => {
        root.textContent = cellContent;
      });

      columns.push(column);
      grid.appendChild(column);
    }

    grid.items = [{ name: `Item 1` }];
  });

  describe('virtual columns enabled', () => {
    beforeEach(async () => {
      grid.lazyColumns = true;
      // Wait for the initial resize observer callback
      await onceResized(grid);
      flushGrid(grid);
    });

    it('should render columns inside the viewport', () => {
      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
    });

    it('should not render columns outside the viewport', () => {
      expectBodyCellNotRendered(2);
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
      expectBodyCellNotRendered(2);
      expectBodyCellNotRendered(columns.length - 1);
    });

    it('should render columns revealed columns on resize', async () => {
      grid.style.width = `${grid.$.table.scrollWidth}px`;
      await onceResized(grid);
      expectBodyCellUpdated(2);
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should always render header cells', () => {
      expect(getHeaderCellContent(grid, 0, columns.length - 1).textContent).to.equal(`Col ${columns.length - 1}`);
    });

    it('should render frozen to end columns', () => {
      columns.at(-1).frozenToEnd = true;
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should switch back to eager columns', () => {
      grid.lazyColumns = false;

      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
      expectBodyCellUpdated(2);
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should switch back to lazy columns', () => {
      grid.lazyColumns = false;
      resetRenderers();
      grid.lazyColumns = true;

      expectBodyCellNotRendered(2);
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
      const firstRect = getContainerCell(grid.$.items, 0, 0).getBoundingClientRect();
      const secondRect = getContainerCell(grid.$.items, 1, 0).getBoundingClientRect();
      expect(secondRect.top).to.equal(firstRect.bottom + detailsHeight);
    });

    describe('scroll horizontally', () => {
      async function scrollHorizontallyTo(scrollLeft) {
        grid.$.table.scrollLeft = scrollLeft;
        await oneEvent(grid.$.table, 'scroll');
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

      it('should render frozen columns', () => {
        columns[0].frozen = true;
        expectBodyCellUpdated(0);
      });

      it('should debounce scrolling', async () => {
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
        expect(getBodyCellContent(grid, 0, columns.length - 1).textContent).to.equal('cell');

        cellContent = 'updated';
        grid.requestContentUpdate();
        expect(getBodyCellContent(grid, 0, columns.length - 1).textContent).to.equal('updated');

        // Scroll back to the beginning
        await scrollHorizontallyTo(0);
        // Wait for the debouncer to flush
        await aTimeout(timeouts.UPDATE_CONTENT_VISIBILITY);

        expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('updated');
      });
    });
  });
});
