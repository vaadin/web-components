import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import {
  buildDataSet,
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getRowBodyCells,
  getRowCells,
  getRows,
  infiniteDataProvider,
  scrollToEnd,
} from './helpers.js';

function simpleDetailsRenderer(root, _, { index }) {
  root.innerHTML = `<span>${index}</span>-details`;
}

function indexRenderer(root, _, { index }) {
  root.textContent = index;
}

describe('row details', () => {
  let grid;
  let bodyRows;

  function openRowDetails(index) {
    grid.openItemDetails(grid._dataProviderController.rootCache.items[index]);
    flushGrid(grid);
  }

  function closeRowDetails(index) {
    grid.closeItemDetails(grid._dataProviderController.rootCache.items[index]);
    flushGrid(grid);
  }

  it('should not increase row init count', () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 50px; height: 400px" size="100">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.rowDetailsRenderer = simpleDetailsRenderer;
    grid.querySelector('vaadin-grid-column').renderer = indexRenderer;

    const spy = sinon.spy(grid, '__initRow');
    grid.size = 1;
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    expect(spy.callCount).to.be.below(5);
  });

  describe('simple', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 50px; height: 400px" size="100">
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.rowDetailsRenderer = simpleDetailsRenderer;
      grid.querySelector('vaadin-grid-column').renderer = indexRenderer;

      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
      bodyRows = getRows(grid.$.items);
      await nextFrame();
    });

    it('should not activate on click', () => {
      openRowDetails(0);
      const detailsCellContent = getBodyCellContent(grid, 0, 1);
      click(detailsCellContent);
      expect(grid.activeItem).not.to.be.ok;
    });

    it('should not deactivate on click', () => {
      openRowDetails(0);
      click(getBodyCellContent(grid, 0, 0));
      const detailsCellContent = getBodyCellContent(grid, 0, 1);
      click(detailsCellContent);
      expect(grid.activeItem).to.be.ok;
    });

    it('should open details row', () => {
      const cells = getRowCells(bodyRows[1]);
      expect(cells[1].hidden).to.be.true;
      openRowDetails(1);
      expect(cells[1].hidden).to.be.false;
    });

    it('should close details row', () => {
      openRowDetails(1);
      closeRowDetails(1);
      expect(getRowCells(bodyRows[1])[1].hidden).to.be.true;
    });

    it('should close details row visually', () => {
      openRowDetails(1);
      closeRowDetails(1);
      expect(bodyRows[1].getBoundingClientRect().bottom).to.be.closeTo(bodyRows[2].getBoundingClientRect().top, 1);
    });

    it('should render the details', () => {
      openRowDetails(1);
      const cells = getRowCells(bodyRows[1]);
      expect(getCellContent(cells[1]).textContent.trim()).to.equal('1-details');
    });

    it('should not render the details eagerly', () => {
      const cells = getRowCells(bodyRows[1]);
      expect(getCellContent(cells[1]).textContent.trim()).to.be.empty;
    });

    const assertDetailsBounds = () => {
      const cells = getRowCells(bodyRows[1]);
      const bounds = cells[1].getBoundingClientRect();
      expect(bounds.top).to.be.closeTo(cells[0].getBoundingClientRect().bottom, 1);
      expect(bounds.left).to.equal(cells[0].getBoundingClientRect().left);
      expect(bounds.right).to.equal(cells[0].getBoundingClientRect().right);
      expect(bounds.bottom).to.be.closeTo(bodyRows[2].getBoundingClientRect().top, 1);
      expect(bounds.height).to.be.above(10);
    };

    it('should have correct bounds', () => {
      openRowDetails(1);
      assertDetailsBounds();
    });

    it('should have correct bounds when modified after opening', async () => {
      openRowDetails(1);
      const cells = getRowCells(bodyRows[1]);
      cells[1].style.padding = '10px';
      // Wait for the resize observer for details cell to invoke and change the row padding
      await nextFrame();
      // Wait for the resize observer for virtualizer rows to invoke
      await nextFrame();
      await aTimeout(0);
      assertDetailsBounds();
    });

    it('should hide the details cell', () => {
      openRowDetails(1);
      const row = bodyRows[1];
      scrollToEnd(grid);
      expect(getRowCells(row)[1].hidden).to.be.true;
    });

    it('should add details to fixed cells cache', () => {
      openRowDetails(1);

      flushGrid(grid);
      bodyRows = getRows(grid.$.items);

      expect(grid._frozenCells).to.contain(getRowCells(bodyRows[1])[1]);
    });

    it('should open details for equaling item', () => {
      const cells = getRowCells(bodyRows[0]);
      grid.itemIdPath = 'value';
      grid.openItemDetails({ value: 'foo0' });
      expect(cells[1].hidden).to.be.false;
    });

    it('should close details for equaling item', () => {
      const cells = getRowCells(bodyRows[0]);
      grid.itemIdPath = 'value';
      grid.openItemDetails(bodyRows[0]._item);
      expect(cells[1].hidden).to.be.false;
      grid.closeItemDetails({ value: 'foo0' });
      expect(cells[1].hidden).to.be.true;
    });

    it('should invoke the body renderer when opening details', () => {
      grid.renderer = sinon.spy();

      openRowDetails(0);

      grid.renderer.args.forEach(([_root, _owner, model], index) => {
        if (index === 0) {
          expect(model.detailsOpened).to.be.true;
        } else {
          expect(model.detailsOpened).to.be.false;
        }
      });
    });

    it('should invoke the body renderer when closing details', () => {
      grid.renderer = sinon.spy();

      openRowDetails(0);

      grid.renderer.resetHistory();

      closeRowDetails(0);

      grid.renderer.args.forEach(([_root, _owner, model]) => {
        expect(model.detailsOpened).to.be.false;
      });
    });
  });

  describe('repeat', () => {
    const items = [];
    for (let i = 0; i < 50; i++) {
      items.push({ details: [1, 2, 3, 4] });
    }

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 400px" size="100">
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);

      grid.rowDetailsRenderer = (root, _grid, { item }) => {
        root.innerHTML = `
          <div>
            ${'<div>foo</div>'.repeat(item.details.length)}
          </div>
        `;
      };

      grid.querySelector('vaadin-grid-column').renderer = indexRenderer;
    });

    it('should have correct height', () => {
      grid.openItemDetails(items[0]);

      grid.dataProvider = (_, callback) => callback(items);
      flushGrid(grid);

      const row = getRows(grid.$.items)[0];
      expect(row.offsetHeight).to.be.above(70);
    });
  });

  describe('details opened attribute', () => {
    let dataset = [];
    const dataProvider = (_, callback) => callback(dataset);

    const countRowsMarkedAsDetailsOpened = (grid) => {
      return grid.$.items.querySelectorAll('tr[details-opened]').length;
    };

    beforeEach(async () => {
      dataset = buildDataSet(10);
      grid = fixtureSync(`
        <vaadin-grid style="width: 50px; height: 400px" size="100">
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.rowDetailsRenderer = simpleDetailsRenderer;
      grid.querySelector('vaadin-grid-column').renderer = indexRenderer;

      grid.dataProvider = dataProvider;
      flushGrid(grid);
      bodyRows = getRows(grid.$.items);
      await nextFrame();
    });

    it('should update when opening/closing imperatively', () => {
      openRowDetails(1);
      expect(bodyRows[1].hasAttribute('details-opened')).to.be.true;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(1);
      closeRowDetails(1);
      expect(bodyRows[1].hasAttribute('details-opened')).to.be.false;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });

    it('should update row part attribute when opening / closing', () => {
      openRowDetails(1);
      expect(bodyRows[1].getAttribute('part')).to.contain('details-opened-row');
      closeRowDetails(1);
      expect(bodyRows[1].getAttribute('part')).to.not.contain('details-opened-row');
    });

    it('should update body cells part attribute when opening / closing', () => {
      const cells = getRowBodyCells(bodyRows[1]);
      openRowDetails(1);
      cells.forEach((cell) => {
        expect(cell.getAttribute('part')).to.contain('details-opened-row-cell');
      });

      closeRowDetails(1);
      cells.forEach((cell) => {
        expect(cell.getAttribute('part')).to.not.contain('details-opened-row-cell');
      });
    });

    it('should be removed when item is removed', () => {
      openRowDetails(0);
      dataset.shift(); // Remove opened item
      grid.clearCache();

      expect(bodyRows[0].hasAttribute('details-opened')).to.be.false;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });

    it('should be removed when items are replaced', () => {
      openRowDetails(0);
      dataset = buildDataSet(10); // Replace data
      grid.clearCache();

      expect(bodyRows[0].hasAttribute('details-opened')).to.be.false;
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });

    it('should be removed on all rows when items are replaced', () => {
      // Open all rows
      dataset.forEach((_, i) => {
        openRowDetails(i);
      });
      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(dataset.length);

      dataset = buildDataSet(10); // Replace data
      grid.clearCache();

      expect(countRowsMarkedAsDetailsOpened(grid)).to.equal(0);
    });
  });

  describe('lazily set details renderer', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.items = [{ name: 'foo' }];
      await nextFrame();
      bodyRows = getRows(grid.$.items);
    });

    it('should have the details cell initially hidden', async () => {
      grid.rowDetailsRenderer = () => {};
      await nextFrame();
      const detailsCell = bodyRows[0].querySelector('[part~="details-cell"]');
      expect(detailsCell.hidden).to.be.true;
    });

    it('should have the details cell initially visible', async () => {
      grid.detailsOpenedItems = [...grid.items];
      grid.rowDetailsRenderer = () => {};
      await nextFrame();
      const detailsCell = bodyRows[0].querySelector('[part~="details-cell"]');
      expect(detailsCell.hidden).to.be.false;
    });

    it('should have the details cell become visible when details opened', async () => {
      grid.rowDetailsRenderer = () => {};
      await nextFrame();
      grid.detailsOpenedItems = [...grid.items];
      await nextFrame();
      const detailsCell = bodyRows[0].querySelector('[part~="details-cell"]');
      expect(detailsCell.hidden).to.be.false;
    });
  });

  describe('details cell height change', () => {
    let bodyRow;
    let updateDetailsCellHeight;

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="name"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.rowDetailsRenderer = (root) => {
        // Render the details cell with a height of 100px
        root.innerHTML = `<div style="height: 100px; background: yellow;">Details</div>`;
        // Increase the details cell height to 200px in a microtask
        queueMicrotask(() => {
          root.firstElementChild.style.height = '150px';
        });

        updateDetailsCellHeight = () => {
          root.firstElementChild.style.height = '200px';
        };
      };
      grid.items = [{ name: 'foo' }];
      await nextFrame();
      bodyRow = getRows(grid.$.items)[0];
    });

    it('should update the row height when opened items are updated', async () => {
      grid.detailsOpenedItems = [...grid.items];
      await nextFrame();
      const detailsRowHeight = bodyRow.offsetHeight;

      grid.detailsOpenedItems = [...grid.items];
      await nextFrame();
      expect(bodyRow.offsetHeight).to.equal(detailsRowHeight);
    });

    it('should clear row padding bottom when opened items are cleared', async () => {
      grid.detailsOpenedItems = [...grid.items];
      grid.detailsOpenedItems = [];
      await nextFrame();
      expect(bodyRow.style.paddingBottom).to.equal('');
    });

    it('should update the row height when details cell height changes', async () => {
      grid.detailsOpenedItems = [...grid.items];
      await nextFrame();
      const detailsRowHeight = bodyRow.offsetHeight;
      updateDetailsCellHeight();
      await nextFrame();
      expect(bodyRow.offsetHeight).to.equal(detailsRowHeight + 50);
    });
  });
});
