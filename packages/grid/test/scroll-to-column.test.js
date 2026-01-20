import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import '../src/vaadin-grid-column-group.js';
import { flushGrid, infiniteDataProvider } from './helpers.js';

describe('scroll to column', () => {
  let grid;
  let columns;
  let warnSpy;

  function setupGrid() {
    const columnsHtml = Array.from(
      { length: 10 },
      (_, i) => `<vaadin-grid-column header="col${i}"></vaadin-grid-column>`,
    ).join('');

    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 400px;" size="5">
        ${columnsHtml}
      </vaadin-grid>
    `);

    columns = Array.from(grid.querySelectorAll('vaadin-grid-column'));
    columns.forEach((col, idx) => {
      col.renderer = (root) => {
        root.textContent = `cell${idx}`;
      };
    });

    grid.dataProvider = infiniteDataProvider;
  }

  beforeEach(() => {
    setupGrid();
    flushGrid(grid);

    warnSpy = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warnSpy.restore();
  });

  function isColumnInViewport(column) {
    if (column.frozen || column.frozenToEnd) {
      return true;
    }

    const headerCell = column._headerCell;
    if (!headerCell) {
      return false;
    }

    const scrollLeft = grid.$.table.scrollLeft;
    const clientWidth = grid.$.table.clientWidth;

    return (
      headerCell.offsetLeft + headerCell.offsetWidth >= scrollLeft && headerCell.offsetLeft <= scrollLeft + clientWidth
    );
  }

  describe('by index', () => {
    it('should scroll to column by index', () => {
      const initialScrollLeft = grid.$.table.scrollLeft;
      expect(isColumnInViewport(columns[9])).to.be.false;
      grid.scrollToColumn(9);

      expect(grid.$.table.scrollLeft).to.be.above(initialScrollLeft);
      expect(isColumnInViewport(columns[9])).to.be.true;
    });

    it('should scroll to column at beginning', async () => {
      grid.scrollToColumn(9);
      await nextFrame();

      const scrollAfterToEnd = grid.$.table.scrollLeft;
      expect(scrollAfterToEnd).to.be.above(0);
      expect(isColumnInViewport(columns[9])).to.be.true;

      grid.scrollToColumn(0);
      expect(grid.$.table.scrollLeft).to.be.below(scrollAfterToEnd);
      expect(isColumnInViewport(columns[0])).to.be.true;
    });

    it('should log warning for out of bounds index', () => {
      grid.scrollToColumn(100);
      expect(warnSpy.calledOnce).to.be.true;
      expect(warnSpy.firstCall.args[0]).to.include('out of bounds');
    });

    it('should not scroll for out of bounds index', () => {
      const initialScrollLeft = grid.$.table.scrollLeft;
      grid.scrollToColumn(100);
      expect(grid.$.table.scrollLeft).to.equal(initialScrollLeft);
    });

    it('should not scroll if column is already visible', () => {
      expect(isColumnInViewport(columns[0])).to.be.true;
      const initialScrollLeft = grid.$.table.scrollLeft;
      grid.scrollToColumn(0);
      expect(grid.$.table.scrollLeft).to.equal(initialScrollLeft);
    });

    it('should skip hidden columns in index calculation', () => {
      columns[1].hidden = true;
      columns[2].hidden = true;
      flushGrid(grid);

      // Index 5 should now refer to initial columns[7]
      grid.scrollToColumn(5);
      expect(isColumnInViewport(columns[7])).to.be.true;
    });
  });

  describe('by element', () => {
    it('should scroll to column by element reference', () => {
      expect(isColumnInViewport(columns[9])).to.be.false;
      grid.scrollToColumn(columns[9]);
      expect(isColumnInViewport(columns[9])).to.be.true;
    });

    it('should log warning for column not in grid', () => {
      const foreignColumn = document.createElement('vaadin-grid-column');
      grid.scrollToColumn(foreignColumn);
      expect(warnSpy.calledOnce).to.be.true;
      expect(warnSpy.firstCall.args[0]).to.include('not a visible column');
    });

    it('should log warning for hidden column', () => {
      columns[5].hidden = true;
      flushGrid(grid);
      grid.scrollToColumn(columns[5]);
      expect(warnSpy.calledOnce).to.be.true;
      expect(warnSpy.firstCall.args[0]).to.include('not a visible column');
    });

    it('should not scroll for hidden column', () => {
      const initialScrollLeft = grid.$.table.scrollLeft;
      columns[9].hidden = true;
      flushGrid(grid);
      grid.scrollToColumn(columns[9]);
      expect(grid.$.table.scrollLeft).to.equal(initialScrollLeft);
    });

    it('should log warning for null column', () => {
      grid.scrollToColumn(null);
      expect(warnSpy.calledOnce).to.be.true;
      expect(warnSpy.firstCall.args[0]).to.include('not a visible column');
    });
  });

  describe('column groups', () => {
    beforeEach(async () => {
      const firstFiveColumns = columns.slice(0, 5);
      const lastFiveColumns = columns.slice(5);
      const group1 = document.createElement('vaadin-grid-column-group');
      group1.header = 'Group 1';
      group1.append(...firstFiveColumns);
      const group2 = document.createElement('vaadin-grid-column-group');
      group2.header = 'Group 2';
      group2.append(...lastFiveColumns);
      grid.append(group1, group2);

      flushGrid(grid);
      await nextRender();
    });

    it('should scroll when columns are in column group', async () => {
      grid.scrollToColumn(columns[9]);
      await nextFrame();

      expect(isColumnInViewport(columns[9])).to.be.true;

      grid.scrollToColumn(columns[0]);
      await nextFrame();
    });

    it('should log warning for column group', () => {
      grid.scrollToColumn(grid.querySelector('vaadin-grid-column-group'));
      expect(warnSpy.calledOnce).to.be.true;
      expect(warnSpy.firstCall.args[0]).to.include('not a visible column');
    });
  });

  describe('column reordering', () => {
    beforeEach(async () => {
      grid.columnReorderingAllowed = true;
      await nextRender();
    });

    it('should respect visual column order', () => {
      // Swap column 0 and column 4 orders
      const order0 = columns[0]._order;
      const order4 = columns[4]._order;
      columns[0]._order = order4;
      columns[4]._order = order0;
      flushGrid(grid);

      // Now visual index 4 should be columns[0]
      expect(isColumnInViewport(columns[0])).to.be.false;

      grid.scrollToColumn(4);

      expect(isColumnInViewport(columns[0])).to.be.true;
    });
  });

  describe('frozen columns', () => {
    beforeEach(async () => {
      columns[0].frozen = true;
      flushGrid(grid);
      await nextRender();
    });

    it('should not scroll for frozen column (always visible)', () => {
      const initialScrollLeft = grid.$.table.scrollLeft;
      grid.scrollToColumn(columns[0]);
      expect(grid.$.table.scrollLeft).to.equal(initialScrollLeft);
    });

    it('should scroll non-frozen column into view', async () => {
      grid.scrollToColumn(9);
      await nextFrame();
      expect(isColumnInViewport(columns[9])).to.be.true;

      // Scroll back to first non-frozen
      grid.scrollToColumn(1);
      expect(isColumnInViewport(columns[1])).to.be.true;
    });
  });

  describe('frozen to end columns', () => {
    beforeEach(async () => {
      columns[9].frozenToEnd = true;
      flushGrid(grid);
      await nextRender();
    });

    it('should not scroll for frozen-to-end column (always visible)', () => {
      const initialScrollLeft = grid.$.table.scrollLeft;
      grid.scrollToColumn(columns[9]);
      expect(grid.$.table.scrollLeft).to.equal(initialScrollLeft);
    });

    it('should scroll non-frozen column into view', () => {
      // Scroll to first non-frozen
      grid.scrollToColumn(8);
      expect(isColumnInViewport(columns[8])).to.be.true;
    });
  });

  describe('pending scroll', () => {
    it('should defer scroll when grid not ready', async () => {
      const container = fixtureSync('<div></div>');
      grid = document.createElement('vaadin-grid');
      grid.style.width = '200px';
      grid.style.height = '400px';

      for (let i = 0; i < 10; i++) {
        const column = document.createElement('vaadin-grid-column');
        column.header = `col${i}`;
        column.renderer = (root) => {
          root.textContent = `cell${i}`;
        };
        grid.appendChild(column);
      }

      grid.dataProvider = infiniteDataProvider;
      grid.scrollToColumn(9);

      container.appendChild(grid);
      flushGrid(grid);
      await nextFrame();
      await nextFrame();

      columns = Array.from(grid.querySelectorAll('vaadin-grid-column'));
      expect(isColumnInViewport(columns[9])).to.be.true;
    });
  });

  describe('lazy column rendering', () => {
    beforeEach(() => {
      setupGrid();
      grid.columnRendering = 'lazy';
      flushGrid(grid);
    });

    it('should synchronously render cells when scrolling to column', () => {
      expect(grid.textContent).to.not.contain('cell8');

      grid.scrollToColumn(9);

      expect(grid.textContent).to.contain('cell8');
    });
  });

  describe('already visible column', () => {
    it('should not scroll when column is already fully visible', () => {
      const initialScrollLeft = grid.$.table.scrollLeft;
      expect(isColumnInViewport(columns[0])).to.be.true;
      grid.scrollToColumn(0);
      expect(grid.$.table.scrollLeft).to.equal(initialScrollLeft);
    });
  });

  describe('RTL', () => {
    beforeEach(async () => {
      document.documentElement.setAttribute('dir', 'rtl');
      await nextRender();
    });

    afterEach(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('should scroll to column in RTL mode', () => {
      expect(isColumnInViewport(columns[9])).to.be.false;
      grid.scrollToColumn(9);
      expect(isColumnInViewport(columns[9])).to.be.true;
    });

    it('should scroll back to first column in RTL mode', () => {
      grid.scrollToColumn(9);
      expect(isColumnInViewport(columns[0])).to.be.false;
      grid.scrollToColumn(0);
      expect(isColumnInViewport(columns[0])).to.be.true;
    });
  });
});
