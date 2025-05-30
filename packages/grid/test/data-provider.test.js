import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import {
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getContainerCell,
  getFirstCell,
  getFirstVisibleItem,
  getLastVisibleItem,
  getPhysicalAverage,
  getRowBodyCells,
  getRowCells,
  getRows,
  getVisibleItems,
  infiniteDataProvider,
  scrollToEnd,
} from './helpers.js';

function simulateScrollToStart(grid) {
  // Make sure not over scroll more than the delta threshold limit of 10k.
  const table = grid.$.table;

  return new Promise((resolve) => {
    const handler = () => {
      if (grid.$.table.scrollTop > 0) {
        table.scrollTop -= 2500;
      } else {
        table.removeEventListener('scroll', handler);
        setTimeout(resolve, 100);
      }
    };

    table.addEventListener('scroll', handler);
    table.scrollTop -= 2500;
  });
}

function simulateScrollToEnd(grid) {
  // Make sure not over scroll more than the delta threshold limit of 10k.
  const table = grid.$.table;

  return new Promise((resolve) => {
    const handler = () => {
      if (table.scrollTop < table.scrollHeight - table.clientHeight - 1) {
        table.scrollTop += 2500;
      } else {
        table.removeEventListener('scroll', handler);
        setTimeout(resolve, 100);
      }
    };

    table.addEventListener('scroll', handler);
    table.scrollTop += 2500;
  });
}

describe('data provider', () => {
  let grid;

  function getItemForIndex(index) {
    const { item } = grid._dataProviderController.getFlatIndexContext(index);
    return item;
  }

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    flushGrid(grid);
  });

  describe('set manually', () => {
    it('should request data only once for empty grid', () => {
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      grid.size = 10;
      grid.dataProvider.resetHistory();

      grid.size = 0;
      grid.clearCache();

      expect(grid.dataProvider.callCount).to.equal(1);
    });

    it('should warn about missing size', () => {
      sinon.stub(console, 'warn');

      grid.dataProvider = infiniteDataProvider;
      grid._debouncerCheckSize.flush();

      expect(console.warn.called).to.be.true;
      console.warn.restore();
    });

    it('should not warn about missing size if size property is set', () => {
      sinon.stub(console, 'warn');

      grid.dataProvider = infiniteDataProvider;
      grid.size = 1;
      grid._debouncerCheckSize.flush();

      expect(console.warn.called).to.be.false;
      console.warn.restore();
    });

    it('should not warn about missing size if size is given in callback', () => {
      sinon.stub(console, 'warn');

      grid.dataProvider = (params, callback) => {
        infiniteDataProvider(params, (items) => callback(items, 1));
      };
      grid._debouncerCheckSize.flush();

      expect(console.warn.called).to.be.false;
      console.warn.restore();
    });

    it('should work with data provider set before size', () => {
      grid.dataProvider = infiniteDataProvider;
      grid.size = 3;
      flushGrid(grid);
      expect(getRows(grid.$.items)).to.have.length(3);
    });

    it('should work with data provider set after a long delay', async () => {
      grid.size = 100;
      await aTimeout(1000);
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      flushGrid(grid);
      expect(grid.dataProvider.called).to.be.true;
      expect(grid.dataProvider.args[0][0].page).to.eql(0);
    });

    it('should not request negative pages', () => {
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      grid.size = 10;

      for (let i = 0; i < grid.dataProvider.callCount; i++) {
        const page = grid.dataProvider.getCall(i).args[0].page;
        expect(page).to.be.above(-1);
      }
    });

    it('should set itemHasChildren path by default', () => {
      expect(grid.itemHasChildrenPath).to.equal('children');
    });

    it('should request items when sorting is applied initially', () => {
      // Initialize a fresh grid
      grid.remove();
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-sort-column path="value" direction="asc"></vaadin-grid-sort-column>
        </vaadin-grid>
      `);

      // Set data provider
      grid.dataProvider = (_params, callback) => callback([{ value: 'foo' }], 1);

      // Expect the grid to have a body row
      flushGrid(grid);
      expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('foo');
    });

    it('should request items only once when multiple sorters are added', async () => {
      // Set data provider
      grid.dataProvider = sinon.spy((_params, callback) => callback([{ value: 'foo' }], 1));
      await nextFrame();
      grid.dataProvider.resetHistory();

      // Add multiple pre-sorted sort columns
      const columns = fixtureSync`
        <div>
          <vaadin-grid-sort-column path="name" direction="asc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="price" direction="asc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="discount" direction="asc"></vaadin-grid-sort-column>
        </div>
      `;
      grid.multiSort = true;
      grid.append(...columns.childNodes);

      // Expect the data provider to be called only once with the correct sort orders
      await nextFrame();
      expect(grid.dataProvider.callCount).to.equal(1);
      expect(grid.dataProvider.lastCall.args[0].sortOrders).to.eql([
        { path: 'discount', direction: 'asc' },
        { path: 'price', direction: 'asc' },
        { path: 'name', direction: 'asc' },
      ]);
    });

    it('should not request again when resolving with an empty array', async () => {
      grid.dataProvider = sinon.spy((_params, callback) => callback([], 10));

      grid.dataProvider.resetHistory();
      await aTimeout(100);

      expect(grid.dataProvider.callCount).to.equal(0);
    });
  });

  describe('tree', () => {
    let generateItemIds;

    function finiteDataProvider(params, callback) {
      // Provides fixed size data set of 10 items
      infiniteDataProvider(params, (items) => {
        callback(
          items.map((item) => {
            item.level = params.parentItem ? (params.parentItem.level || 0) + 1 : 0;
            if (generateItemIds) {
              item.id = `${item.value}-${item.level}`;
            }
            return item;
          }),
          10,
        );
      });
    }

    function deepAsyncFiniteDataProvider(params, callback) {
      // Async, but first level is sync to simplify expanding tests init
      if (params.parentItem) {
        setTimeout(() => finiteDataProvider(params, callback));
      } else {
        finiteDataProvider(params, callback);
      }
    }

    function isIndexExpanded(grid, index) {
      return grid._isExpanded(getItemForIndex(index));
    }

    function expandIndex(grid, index) {
      grid.expandItem(getItemForIndex(index));
    }

    function collapseIndex(grid, index) {
      grid.collapseItem(getItemForIndex(index));
    }

    beforeEach(async () => {
      const treeColumn = document.createElement('vaadin-grid-tree-column');
      await nextFrame();
      treeColumn.path = 'value';
      grid.itemHasChildrenPath = 'value';
      grid.prepend(treeColumn);
      grid.pageSize = 5;
      grid.dataProvider = sinon.spy(finiteDataProvider);
      generateItemIds = false;
    });

    describe('first level', () => {
      it('should have collapsed items by default', () => {
        for (let i = 0; i < grid._flatSize; i++) {
          expect(isIndexExpanded(grid, i)).to.be.false;
        }
      });

      it('should request first level items', () => {
        expect(grid.dataProvider.callCount).to.equal(2);
        expect(grid.dataProvider.getCall(0).args[0].parentItem).to.be.undefined;
      });

      it('should request items when scrolled to an expanded parent', async () => {
        grid.size = 51;
        grid.dataProvider = sinon.spy(infiniteDataProvider);
        grid.itemIdPath = 'value';
        grid.expandedItems = [{ value: 'foo50' }];
        flushGrid(grid);
        await nextFrame();
        grid.$.table.scrollTop = 10000;
        flushGrid(grid);
        expect(grid.dataProvider.lastCall.args[0].parentItem).to.be.ok;
      });

      it('should request pages from 0', () => {
        expect(grid.dataProvider.getCall(0).args[0].page).to.equal(0);
        expect(grid.dataProvider.getCall(1).args[0].page).to.equal(1);
      });

      it('should have full size set to first level size provided by data provider', () => {
        expect(grid._flatSize).to.equal(10);
      });

      it('should have first level items in cache', () => {
        for (let i = 0; i < grid._flatSize; i++) {
          expect(getItemForIndex(i)).to.deep.equal({ level: 0, value: `foo${i}` });
        }
      });
    });

    describe('expanding', () => {
      it('should expand an item', () => {
        expandIndex(grid, 0);
        expect(isIndexExpanded(grid, 0)).to.be.true;
      });

      it('should request second level items', () => {
        expandIndex(grid, 7);
        // First level (2 pages) + second level (2 pages) = 4 data requests
        expect(grid.dataProvider.callCount).to.equal(4);
        expect(grid.dataProvider.getCall(2).args[0].parentItem.value).to.equal('foo7');
      });

      it('should render when new items are received', () => {
        generateItemIds = true;
        // Reset pageSize to 50 so we get 1 data request / cache level
        grid.pageSize = 50;
        // Ensure that the expanded item is expanded once new items are received
        grid.itemIdPath = 'id';
        // Expand one item so in total 2 requests are expected after clear cache
        // (main level cache and expanded item subcache)
        expandIndex(grid, 0);

        grid.dataProvider.resetHistory();
        const renderSpy = sinon.spy(grid, '_flatSizeChanged');
        const updateItemSpy = sinon.spy(grid, '_updateItem');
        grid.clearCache();

        expect(grid.dataProvider.callCount).to.equal(2);

        // Effective size should change in between the data requests
        expect(renderSpy.called).to.be.true;
        expect(updateItemSpy.callCount).to.be.below(180);
      });

      it('should keep item expanded on itemIdPath change', () => {
        grid.dataProvider = finiteDataProvider;
        expect(grid.itemIdPath).to.be.null;
        expect(isIndexExpanded(grid, 0)).to.be.false;
        expandIndex(grid, 0);
        expect(isIndexExpanded(grid, 0)).to.be.true;
        grid.itemIdPath = 'id';
        grid.requestContentUpdate();
        expect(isIndexExpanded(grid, 0)).to.be.true;
      });

      it('should assign expanded property', () => {
        const cell = getContainerCell(grid.$.items, 0, 0);
        expect(grid.__getRowModel(cell.parentElement).expanded).to.be.false;
        expandIndex(grid, 0);
        expect(grid.__getRowModel(cell.parentElement).expanded).to.be.true;
      });

      it('should assign level instance property', () => {
        expandIndex(grid, 0);
        expandIndex(grid, 1);

        let cell = getContainerCell(grid.$.items, 0, 0);
        expect(grid.__getRowModel(cell.parentElement).level).to.equal(0);

        cell = getContainerCell(grid.$.items, 1, 0);
        expect(grid.__getRowModel(cell.parentElement).level).to.equal(1);

        cell = getContainerCell(grid.$.items, 2, 0);
        expect(grid.__getRowModel(cell.parentElement).level).to.equal(2);
      });

      it('should have right subcache length', () => {
        expandIndex(grid, 0);
        flushGrid(grid);

        const cell = getContainerCell(grid.$.items, 10, 0);
        expect(grid.__getRowModel(cell.parentElement).level).to.equal(1);
      });

      it('should restore tree after cache is cleared', () => {
        grid.getItemId = (item) => {
          return item !== undefined ? `${item.level}-${item.value}` : undefined;
        };
        expandIndex(grid, 0);

        let cell = getContainerCell(grid.$.items, 1, 0);
        expect(grid.__getRowModel(cell.parentElement).level).to.equal(1);

        grid.clearCache();
        cell = getContainerCell(grid.$.items, 1, 0);
        expect(grid.__getRowModel(cell.parentElement).level).to.equal(1);
      });

      it('should have correct row hierarchy with small page size', async () => {
        grid.pageSize = 2;
        grid.itemIdPath = 'value';
        grid.expandedItems = [{ value: '0' }, { value: '0-0' }];
        grid.dataProvider = ({ parentItem, page, pageSize }, cb) => {
          const levelSize = parentItem ? 4 : 100;

          const pageItems = Array.from({ length: pageSize }, (_, i) => {
            const indexInLevel = page * pageSize + i;
            return {
              value: `${parentItem ? `${parentItem.value}-` : ''}${indexInLevel}`,
              children: true,
            };
          });

          setTimeout(() => cb(pageItems, levelSize), 0);
        };

        await aTimeout(0); // Wait for 0 level
        await aTimeout(0); // Wait for 0-0 level
        await aTimeout(0); // Wait for 0-0-0 level
        await aTimeout(0); // Wait for the second page requests

        const expectedRowContent = ['0', '0-0', '0-0-0', '0-0-1', '0-0-2', '0-0-3', '0-1', '0-2', '0-3'];

        getVisibleItems(grid).forEach((row) => {
          const cell = getRowCells(row)[0];
          const expectedContent = expectedRowContent[row.index];
          if (expectedContent) {
            expect(getCellContent(cell).textContent).to.equal(expectedContent);
          }
        });
      });

      describe('row state', () => {
        let bodyRows;

        beforeEach(() => {
          bodyRows = getRows(grid.$.items);
        });

        it('should toggle expanded attribute on the row', () => {
          expandIndex(grid, 0);
          expect(bodyRows[0].hasAttribute('expanded')).to.be.true;
          collapseIndex(grid, 0);
          expect(bodyRows[0].hasAttribute('expanded')).to.be.false;
        });

        it('should update row part attribute when expanding / collapsing', () => {
          expandIndex(grid, 0);
          expect(bodyRows[0].getAttribute('part')).to.contain('expanded-row');
          expect(bodyRows[0].getAttribute('part')).to.not.contain('collapsed-row');
          collapseIndex(grid, 0);
          expect(bodyRows[0].getAttribute('part')).to.not.contain('expanded-row');
          expect(bodyRows[0].getAttribute('part')).to.contain('collapsed-row');
        });

        it('should update body cells part attribute when expanding / collapsing', () => {
          const cells = getRowBodyCells(bodyRows[0]);
          expandIndex(grid, 0);
          cells.forEach((cell) => {
            expect(cell.getAttribute('part')).to.contain('expanded-row-cell');
            expect(cell.getAttribute('part')).to.not.contain('collapsed-row-cell');
          });
          collapseIndex(grid, 0);
          cells.forEach((cell) => {
            expect(cell.getAttribute('part')).to.not.contain('expanded-row-cell');
            expect(cell.getAttribute('part')).to.contain('collapsed-row-cell');
          });
        });
      });

      it('should request pages from 0', () => {
        expandIndex(grid, 7); // PageSize is 5, index 7 is on the second page
        expect(grid.dataProvider.getCall(2).args[0].page).to.equal(0);
      });

      describe('before async request completes', () => {
        beforeEach(() => {
          grid.dataProvider = deepAsyncFiniteDataProvider;
        });

        it('should not increase size', () => {
          expandIndex(grid, 7);
          expect(grid._flatSize).to.equal(10);
        });

        it('should have first level items in cache', () => {
          expandIndex(grid, 7);
          for (let i = 0; i < grid._flatSize; i++) {
            expect(getItemForIndex(i)).to.deep.equal({ level: 0, value: `foo${i}` });
          }
        });

        it('should not jam on clear cache', () => {
          grid.dataProvider = (params, callback) => {
            setTimeout(() => finiteDataProvider(params, callback), 0);
          };
          grid.clearCache();
        });

        it('should not render synchronously until all data requests have finished', (done) => {
          generateItemIds = true;
          grid.itemIdPath = 'id';

          grid.dataProvider = (params, callback) => {
            if (!params.parentItem) {
              // Resolve normally for root level items
              finiteDataProvider(params, callback);
            } else if (params.parentItem.value === 'foo0' && params.page === 0) {
              // Resolve asynchronously for the first expanded item only
              setTimeout(() => {
                finiteDataProvider(params, callback);
                // Only the root-level items (10) should be rendered at this point even though the
                // data request for the first expanded item resolved
                expect(getBodyCellContent(grid, 1, 0).textContent).to.equal('foo1');
                done();
              }, 0);
            }
          };

          expandIndex(grid, 0);
          expandIndex(grid, 1);
        });

        it('should render asynchronously even if all data requests have not finished', (done) => {
          generateItemIds = true;
          grid.itemIdPath = 'id';

          grid.dataProvider = (params, callback) => {
            if (!params.parentItem) {
              // Resolve normally for root level items
              finiteDataProvider(params, callback);
            } else if (params.parentItem.value === 'foo0' && params.page === 0) {
              // Resolve asynchronously for the first expanded item only
              setTimeout(() => {
                finiteDataProvider(params, callback);
                flushGrid(grid);
                // The root-level items (10) and the first child item children (10), 20 in total,
                // should be rendered at this point even though the data request for the second expanded
                // item hasn't still been resolved
                expect(grid._flatSize).to.equal(20);
                done();
              }, 0);
            }
          };

          expandIndex(grid, 0);
          expandIndex(grid, 1);
        });
      });

      it('should increase full size', () => {
        expandIndex(grid, 0);
        expect(grid._flatSize).to.equal(20);
      });

      it('should have first and second level items in cache', () => {
        expandIndex(grid, 7);
        expect(getItemForIndex(7)).to.deep.equal({ level: 0, value: 'foo7' });
        expect(getItemForIndex(8)).to.deep.equal({ level: 1, value: 'foo0' });
        expect(getItemForIndex(18)).to.deep.equal({ level: 0, value: 'foo8' });
      });
    });

    describe('collapsing', () => {
      beforeEach(() => {
        expandIndex(grid, 7);
      });

      it('should collapse an expanded item', () => {
        collapseIndex(grid, 7);
        expect(isIndexExpanded(grid, 7)).to.be.false;
      });

      it('should not request', () => {
        grid.dataProvider.resetHistory();
        collapseIndex(grid, 7);
        expect(grid.dataProvider.callCount).to.equal(0);
      });

      it('should decrease full size', () => {
        collapseIndex(grid, 7);
        expect(grid._flatSize).to.equal(10);
      });

      it('should have first level items in cache', () => {
        collapseIndex(grid, 7);
        expect(getItemForIndex(7)).to.deep.equal({ level: 0, value: 'foo7' });
        expect(getItemForIndex(8)).to.deep.equal({ level: 0, value: 'foo8' });
      });
    });

    describe('reexpanding', () => {
      beforeEach(() => {
        expandIndex(grid, 7);
        collapseIndex(grid, 7);
      });

      it('should not request', () => {
        grid.dataProvider.resetHistory();
        expandIndex(grid, 7);
        expect(grid.dataProvider.callCount).to.equal(0);
      });

      it('should increase full size', () => {
        expandIndex(grid, 7);
        expect(grid._flatSize).to.equal(20);
      });

      it('should have first and second level items in cache', () => {
        expandIndex(grid, 7);
        expect(getItemForIndex(7)).to.deep.equal({ level: 0, value: 'foo7' });
        expect(getItemForIndex(8)).to.deep.equal({ level: 1, value: 'foo0' });
        expect(getItemForIndex(18)).to.deep.equal({ level: 0, value: 'foo8' });
      });
    });

    describe('rendering', () => {
      function getFirstRowUpdateCount() {
        const callsForFirstIndex = grid._updateItem.getCalls().filter((call) => {
          const item = call.args[1];
          return item.value === '0';
        });
        return callsForFirstIndex.length;
      }

      beforeEach(async () => {
        grid.itemIdPath = 'value';
        grid.dataProvider = ({ parentItem, page, pageSize }, cb) => {
          const pageItems = [...Array(3)].map((_, i) => {
            const indexInLevel = page * pageSize + i;
            return {
              value: `${parentItem ? `${parentItem.value}-` : ''}${indexInLevel}`,
            };
          });

          cb(pageItems, 3);
        };
        sinon.spy(grid, '_updateItem');
        await nextFrame();
      });

      it('should limit row updates', async () => {
        grid.expandedItems = [{ value: '0' }, { value: '1' }, { value: '1-0' }, { value: '2' }];
        await nextFrame();
        // There are currently two _updateItem calls for a row. The extra one (a direct update request)
        // is coming from _expandedItemsChanged.
        expect(getFirstRowUpdateCount()).to.equal(2);
      });

      it('should limit row updates on a small size', async () => {
        grid.size = 3;
        grid.expandedItems = [{ value: '0' }, { value: '1' }, { value: '1-0' }, { value: '2' }];
        await nextFrame();
        expect(getFirstRowUpdateCount()).to.equal(2);
      });

      it('should limit row updates on a small page size', async () => {
        grid.pageSize = 1;
        grid.expandedItems = [{ value: '0' }, { value: '1' }, { value: '1-0' }, { value: '2' }];
        await nextFrame();
        // Changing page size causes yet an additional update request
        expect(getFirstRowUpdateCount()).to.equal(3);
      });

      it('should limit row updates on a small page size, reverse property update order', async () => {
        grid.expandedItems = [{ value: '0' }, { value: '1' }, { value: '1-0' }, { value: '2' }];
        grid.pageSize = 1;
        await nextFrame();
        expect(getFirstRowUpdateCount()).to.equal(3);
      });
    });
  });
});

describe('attached', () => {
  it('should have rows when attached and shown after cache is cleared on hidden grid', async () => {
    const grid = document.createElement('vaadin-grid');
    const col = document.createElement('vaadin-grid-column');
    col.setAttribute('path', 'item');
    grid.appendChild(col);

    grid.size = 1;
    grid.dataProvider = function (_params, callback) {
      callback([{ item: 'A' }]);
    };

    grid.style.display = 'none';
    document.body.appendChild(grid);

    await aTimeout(0);

    grid.clearCache();
    grid.removeAttribute('style');
    expect(getCellContent(getFirstVisibleItem(grid)).textContent).to.equal('A');

    // Grid should be removed after test as was attached to body.
    document.body.removeChild(grid);
  });
});

describe('unattached', () => {
  it('should not throw on clearCache', () => {
    const grid = document.createElement('vaadin-grid');
    expect(() => grid.clearCache()).to.not.throw(Error);
  });
});

describe('page size grid', () => {
  it('should render grid rows when setting page-size before size', () => {
    const grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column header="#" path="value"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.pageSize = 10;
    grid.size = 200;
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('foo0');
  });
});

describe('wrapped grid', () => {
  let grid;

  describe('initial render', () => {
    it('should not render rows before columns are defined', () => {
      grid = fixtureSync(`
        <vaadin-grid size="100">
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      expect(grid.$.items.childElementCount).to.equal(0);
    });
  });

  describe('data-provider', () => {
    const loadDebounceTime = 100;

    function getItemForIndex(index) {
      const { item } = grid._dataProviderController.getFlatIndexContext(index);
      return item;
    }

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid size="100" style="height: 300px">
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      const column = grid.querySelector('vaadin-grid-column');
      column.headerRenderer = (root) => {
        root.textContent = 'Header';
      };
      column.renderer = (root, _col, model) => {
        root.textContent = model.item.value;
      };
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      flushGrid(grid);
    });

    it('should call dataProvider for first page', async () => {
      grid.dataProvider.resetHistory();
      grid.pageSize = 100;
      await aTimeout(loadDebounceTime);
      expect(grid.dataProvider.callCount).to.eql(1);
      expect(grid.dataProvider.firstCall.args[0].page).to.eql(0);
    });

    it('should call dataProvider multiple times to load all items', async () => {
      grid.dataProvider.resetHistory();
      grid.style.fontSize = '12px';
      grid.pageSize = 5;
      flushGrid(grid);
      await aTimeout(loadDebounceTime);
      // Assuming grid has about 18 items
      expect(grid.dataProvider.callCount).to.be.above(2);
      for (let i = 0; i < grid.dataProvider.callCount; i++) {
        expect(grid.dataProvider.getCall(i).args[0].page).to.eql(i);
      }
    });

    it('should always load visible items', async () => {
      grid.pageSize = 10;
      await aTimeout(loadDebounceTime);
      grid.dataProvider.resetHistory();
      await simulateScrollToEnd(grid);
      await aTimeout(loadDebounceTime);
      // 9 is last page out of 100 items / 10 per page.
      const pages = grid.dataProvider.getCalls().map((call) => call.args[0].page);
      expect(pages).to.contain.members([7, 8, 9]);
    });

    it('should cache fetched pages', async () => {
      grid.pageSize = 10;
      // Wait first to initially load first pages.
      await aTimeout(loadDebounceTime);
      await simulateScrollToEnd(grid);
      grid.dataProvider.resetHistory();
      await simulateScrollToStart(grid);
      await aTimeout(loadDebounceTime);
      const pages = grid.dataProvider.getCalls().map((call) => call.args[0].page);
      expect(pages).not.to.contain(0);
    });

    it('should render cell content elements', () => {
      grid.dataProvider = infiniteDataProvider;
      expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('foo0');
    });

    it('should clear item cache', async () => {
      grid.dataProvider = sinon.spy(infiniteDataProvider);
      await aTimeout(loadDebounceTime * 2);
      expect(grid.dataProvider.called).to.be.true;
      const oldFirstItem = getItemForIndex(0);
      expect(oldFirstItem).to.be.ok;
      grid.dataProvider.resetHistory();
      grid.clearCache();
      await aTimeout(loadDebounceTime * 2);
      expect(grid.dataProvider.called).to.be.true;
      expect(getItemForIndex(0)).to.be.ok;
      expect(getItemForIndex(0)).not.to.equal(oldFirstItem);
    });

    it('should update sub properties on clearCache', () => {
      const data = [{ value: 'foo' }];
      grid.size = 1;
      grid.dataProvider = (_, cb) => cb(data);
      expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('foo');
      data[0].value = 'bar';
      grid.clearCache();
      expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('bar');
    });

    it('should apply `loading` attribute to scroller and grid', async () => {
      grid._setLoading(true);
      await nextFrame();
      expect(grid.$.scroller.hasAttribute('loading')).to.be.true;
      expect(grid.hasAttribute('loading')).to.be.true;
      grid._setLoading(false);
      await nextFrame();
      expect(grid.$.scroller.hasAttribute('loading')).to.be.false;
      expect(grid.hasAttribute('loading')).to.be.false;
    });

    it('should be in loading state when dataProvider changes', () => {
      grid.dataProvider = () => {};
      expect(grid.loading).to.be.true;
    });

    it('should be in loading state when fetching new data', (done) => {
      let raf;

      grid.dataProvider = (params, callback) => {
        expect(grid.loading).to.be.true;
        callback(Array(params.pageSize));
        expect(grid.loading).not.to.be.true;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          // Cleanup
          grid.dataProvider = null;
          if (!done._called) {
            done._called = true;
            done();
          }
        });
      };
      scrollToEnd(grid);
    });

    it('should be in loading state when cache is cleared', () => {
      let cb;
      grid.dataProvider = (_, callback) => {
        cb = callback;
      };
      cb(Array(25));
      expect(grid.loading).not.to.be.true;
      grid.clearCache();
      expect(grid.loading).to.be.true;
    });

    it('should set loading attribute to rows', () => {
      grid.dataProvider = () => {};
      expect(getRows(grid.$.items)[0].hasAttribute('loading')).to.be.true;
    });

    it('should add loading to cells part attribute', () => {
      grid.dataProvider = () => {};
      const row = getRows(grid.$.items)[0];
      getRowCells(row).forEach((cell) => {
        expect(cell.getAttribute('part')).to.contain('loading-row-cell');
      });
    });

    it('should clear loading attribute from rows when data received', () => {
      grid.dataProvider = (_, callback) => {
        callback([{}]);
      };
      expect(getRows(grid.$.items)[0].hasAttribute('loading')).to.be.false;
    });

    it('should remove loading from cells part attribute when data received', () => {
      grid.dataProvider = (_, callback) => {
        callback([{}]);
      };
      const row = getRows(grid.$.items)[0];
      getRowCells(row).forEach((cell) => {
        expect(cell.getAttribute('part')).to.not.contain('loading-row-cell');
      });
    });

    it('should clear loading attribute from rows when scrolled to previously loaded rows', () => {
      grid.pageSize = 1;
      grid.dataProvider = (params, callback) => {
        if (params.page === 0) {
          callback([{ value: 'loaded' }]);
        }
      };
      const row = getRows(grid.$.items)[0];
      scrollToEnd(grid);
      expect(row.hasAttribute('loading')).to.be.true;
      grid.scrollToIndex(0);
      expect(row.hasAttribute('loading')).to.be.false;
    });

    it('should not set virtual scroll position to 0 on size change', () => {
      scrollToEnd(grid);
      grid.size = 500;
      expect(grid.$.scroller._physicalTop).not.to.equal(0);
      expect(grid.$.scroller._virtualStart).not.to.equal(0);
    });

    it('should scroll to last index if size decreased beyond current viewport', () => {
      grid.size = 5000;
      flushGrid(grid);
      scrollToEnd(grid);
      expect(getLastVisibleItem(grid).index).to.equal(grid.size - 1);

      grid.size = 50;
      flushGrid(grid);
      expect(getLastVisibleItem(grid).index).to.equal(grid.size - 1);

      // Test actual last visible item
      const rect = grid.getBoundingClientRect();
      const lastRowCenterX = rect.left + grid.offsetWidth / 2;
      const lastRowCenterY = rect.bottom - getPhysicalAverage(grid) / 2;
      const lastVisibleItem = grid.getRootNode().elementFromPoint(lastRowCenterX, lastRowCenterY);
      expect(lastVisibleItem.innerText.trim()).to.equal(`foo${grid.size - 1}`);
    });
  });
});
