import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import '../vaadin-grid.js';
import { flushGrid, getCell } from './helpers.js';

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

  describe('static row height', () => {
    beforeEach(async () => {
      grid.rowHeight = 80;
      flushGrid(grid);
      await nextFrame();
    });

    it('should render columns inside the viewport', () => {
      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
    });

    it('should not render columns outside the viewport', () => {
      expectBodyCellNotRendered(2);
      expectBodyCellNotRendered(columns.length - 1);
    });

    describe('scroll to last column', () => {
      beforeEach(async () => {
        resetRenderers();
        grid.$.table.scrollLeft = grid.$.table.scrollWidth;
        await oneEvent(grid.$.table, 'scroll');
      });

      it('should render columns inside the viewport', () => {
        expectBodyCellUpdated(columns.length - 2);
        expectBodyCellUpdated(columns.length - 1);
      });

      it('should not render columns outside the viewport', () => {
        expectBodyCellNotRendered(0);
        expectBodyCellNotRendered(1);
      });
    });
  });
});
