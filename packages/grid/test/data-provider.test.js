import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  flushGrid,
  getCellContent,
  getContainerCell,
  getFirstCell,
  getFirstVisibleItem,
  getLastVisibleItem,
  getPhysicalAverage,
  getRows,
  infiniteDataProvider,
  scrollToEnd
} from './helpers.js';

registerStyles(
  'vaadin-grid',
  css`
    [part~='cell'] {
      height: 20px;
    }
  `
);

import('../vaadin-grid.js');

class WrappedGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        .item {
          height: 30px;
        }
      </style>
      <vaadin-grid size="100" id="grid" style="height: 300px;" data-provider="[[dataProvider]]">
        <vaadin-grid-column id="col"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  ready() {
    super.ready();
    this.$.col.headerRenderer = (root) => (root.textContent = 'Header');
    this.$.col.renderer = (root, col, model) => (root.textContent = model.item.value);
  }
}

customElements.define('wrapped-grid', WrappedGrid);

class PageSizeGrid extends PolymerElement {
  static get template() {
    return html`
      <vaadin-grid data-provider="[[dataProvider]]" size="[[size]]" id="grid">
        <vaadin-grid-column>
          <template class="header">#</template>
          <template>[[item.value]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  static get properties() {
    return {
      dataProvider: Object,
      size: Number
    };
  }

  ready() {
    super.ready();
    this.$.grid.pageSize = 10;
    this.size = 200;
    this.dataProvider = infiniteDataProvider;
  }
}

customElements.define('page-size-grid', PageSizeGrid);

function simulateScrollToStart(grid) {
  // make sure not over scroll more than the delta threshold limit of 10k.
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
  // make sure not over scroll more than the delta threshold limit of 10k.
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

  before(() => customElements.whenDefined('vaadin-grid'));

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
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

    it('should warn about missing size', async () => {
      await nextFrame();
      sinon.stub(console, 'warn');
      grid.dataProvider = infiniteDataProvider;
      await nextFrame();
      grid._debouncerCheckSize.flush();
      await nextFrame();

      expect(console.warn.called).to.be.true;
      console.warn.restore();
    });

    it('should not warn about missing size if size property is set', async () => {
      sinon.stub(console, 'warn');

      grid.dataProvider = infiniteDataProvider;
      await nextFrame();
      grid.size = 1;
      grid._debouncerCheckSize.flush();

      expect(console.warn.called).to.be.false;
      console.warn.restore();
    });

    it('should not warn about missing size if size is given in callback', async () => {
      sinon.stub(console, 'warn');

      grid.dataProvider = (params, callback) => {
        infiniteDataProvider(params, (items) => callback(items, 1));
      };
      await nextFrame();
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
          10
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
      grid.performUpdate();
      return grid._isExpanded(grid._cache.getItemForIndex(index));
    }

    function expandIndex(grid, index) {
      grid.performUpdate();
      grid.expandItem(grid._cache.getItemForIndex(index));
    }

    function collapseIndex(grid, index) {
      grid.performUpdate();
      grid.collapseItem(grid._cache.getItemForIndex(index));
    }

    beforeEach(async () => {
      grid.pageSize = 5;
      await nextFrame();
      grid.dataProvider = sinon.spy(finiteDataProvider);
      generateItemIds = false;
      await nextFrame();
    });

    describe('first level', () => {
      it('should set itemHasChildren path by default', () => {
        expect(grid.itemHasChildrenPath).to.equal('children');
      });

      it('should have collapsed items by default', () => {
        for (let i = 0; i < grid._effectiveSize; i++) {
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
        expect(grid._effectiveSize).to.equal(10);
      });

      it('should have first level items in cache', () => {
        for (let i = 0; i < grid._effectiveSize; i++) {
          expect(grid._cache.getItemForIndex(i)).to.deep.equal({ level: 0, value: `foo${i}` });
        }
      });
    });

    describe('expanding', () => {
      it('should expand an item', () => {
        expandIndex(grid, 0);
        expect(isIndexExpanded(grid, 0)).to.be.true;
      });

      it('should request second level items', async () => {
        grid.dataProvider.resetHistory();
        expandIndex(grid, 7);
        await nextFrame();
        // second level (2 pages) = 2 data requests
        expect(grid.dataProvider.callCount).to.equal(2);
        expect(grid.dataProvider.getCall(0).args[0].parentItem.value).to.equal('foo7');
      });

      it('should render when new items are received', async () => {
        generateItemIds = true;
        // Reset pageSize to 50 so we get 1 data request / cache level
        grid.pageSize = 50;
        // Ensure that the expanded item is expanded once new items are received
        grid.itemIdPath = 'id';
        // Expand one item so in total 2 requests are expected after clear cache
        // (main level cache and expanded item subcache)
        expandIndex(grid, 0);

        grid.dataProvider.resetHistory();
        const renderSpy = sinon.spy(grid, '_effectiveSizeChanged');
        const updateItemSpy = sinon.spy(grid, '_updateItem');
        grid.clearCache();
        await nextFrame();

        expect(grid.dataProvider.callCount).to.equal(2);

        // Effective size should change in between the data requests
        expect(renderSpy.called).to.be.true;
        expect(updateItemSpy.callCount).to.be.below(180);
      });

      it('should keep item expanded on itemIdPath change', async () => {
        grid.dataProvider = finiteDataProvider;
        await nextFrame();
        expect(grid.itemIdPath).to.be.null;
        expect(isIndexExpanded(grid, 0)).to.be.false;
        expandIndex(grid, 0);
        await nextFrame();
        expect(isIndexExpanded(grid, 0)).to.be.true;
        grid.itemIdPath = 'id';
        grid.requestContentUpdate();
        await nextFrame();
        expect(isIndexExpanded(grid, 0)).to.be.true;
      });

      ['renderer', 'template'].forEach((type) => {
        describe(`${type}`, () => {
          beforeEach(async () => {
            if (type == 'renderer') {
              grid = fixtureSync(`
                <vaadin-grid>
                  <vaadin-grid-column></vaadin-grid-column>
                </vaadin-grid>
              `);
              grid.firstElementChild.renderer = (root, col, model) => (root.textContent = model.index);
              grid.pageSize = 5;
              grid.dataProvider = sinon.spy(finiteDataProvider);
              flushGrid(grid);
              await nextFrame();
            }
          });

          it('should assign expanded property', async () => {
            const cell = getContainerCell(grid.$.items, 0, 0);
            let model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.expanded).to.be.false;
            expandIndex(grid, 0);
            await nextFrame();
            model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.expanded).to.be.true;
          });

          it('should assign level instance property', async () => {
            expandIndex(grid, 0);
            expandIndex(grid, 1);
            await nextFrame();

            let cell = getContainerCell(grid.$.items, 0, 0);
            let model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.level).to.equal(0);

            cell = getContainerCell(grid.$.items, 1, 0);
            model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.level).to.equal(1);

            cell = getContainerCell(grid.$.items, 2, 0);
            model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.level).to.equal(2);
          });

          it('should have right subcache length', () => {
            expandIndex(grid, 0);
            flushGrid(grid);

            const cell = getContainerCell(grid.$.items, 10, 0);
            const model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.level).to.equal(1);
          });

          it('should restore tree after cache is cleared', async () => {
            grid.getItemId = (item) => {
              return item !== undefined ? item.level + '-' + item.value : undefined;
            };
            expandIndex(grid, 0);
            await nextFrame();

            let cell = getContainerCell(grid.$.items, 1, 0);
            let model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.level).to.equal(1);

            grid.clearCache();
            cell = getContainerCell(grid.$.items, 1, 0);
            model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
            expect(model.level).to.equal(1);
          });
        });
      });

      it('should toggle expanded attribute on the row', async () => {
        expandIndex(grid, 0);
        await nextFrame();
        expect(getRows(grid.$.items)[0].hasAttribute('expanded')).to.be.true;
        collapseIndex(grid, 0);
        await nextFrame();
        expect(getRows(grid.$.items)[0].hasAttribute('expanded')).to.be.false;
      });

      it('should request pages from 0', async () => {
        expandIndex(grid, 7); // pageSize is 5, index 7 is on the second page
        await nextFrame();
        expect(grid.dataProvider.getCall(0).args[0].page).to.equal(0);
      });

      describe('before async request completes', () => {
        beforeEach(async () => {
          grid.dataProvider = deepAsyncFiniteDataProvider;
          await nextFrame();
        });

        it('should not increase size', async () => {
          expandIndex(grid, 7);
          expect(grid._effectiveSize).to.equal(10);
        });

        it('should have first level items in cache', () => {
          expandIndex(grid, 7);
          for (let i = 0; i < grid._effectiveSize; i++) {
            expect(grid._cache.getItemForIndex(i)).to.deep.equal({ level: 0, value: `foo${i}` });
          }
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
                expect(grid._effectiveSize).to.equal(10);
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
                expect(grid._effectiveSize).to.equal(20);
                done();
              }, 0);
            }
          };

          expandIndex(grid, 0);
          expandIndex(grid, 1);
        });
      });

      it('should increase full size', async () => {
        expandIndex(grid, 0);
        await nextFrame();
        expect(grid._effectiveSize).to.equal(20);
      });

      it('should have first and second level items in cache', async () => {
        expandIndex(grid, 7);
        await nextFrame();
        expect(grid._cache.getItemForIndex(7)).to.deep.equal({ level: 0, value: 'foo7' });
        expect(grid._cache.getItemForIndex(8)).to.deep.equal({ level: 1, value: 'foo0' });
        expect(grid._cache.getItemForIndex(18)).to.deep.equal({ level: 0, value: 'foo8' });
      });
    });

    describe('collapsing', () => {
      beforeEach(async () => {
        expandIndex(grid, 7);
        await nextFrame();
      });

      it('should collapse an expanded item', async () => {
        collapseIndex(grid, 7);
        await nextFrame();
        expect(isIndexExpanded(grid, 7)).to.be.false;
      });

      it('should not request', async () => {
        grid.dataProvider.resetHistory();
        collapseIndex(grid, 7);
        await nextFrame();
        expect(grid.dataProvider.callCount).to.equal(0);
      });

      it('should decrease full size', async () => {
        collapseIndex(grid, 7);
        await nextFrame();
        expect(grid._effectiveSize).to.equal(10);
      });

      it('should have first level items in cache', async () => {
        collapseIndex(grid, 7);
        await nextFrame();
        expect(grid._cache.getItemForIndex(7)).to.deep.equal({ level: 0, value: 'foo7' });
        expect(grid._cache.getItemForIndex(8)).to.deep.equal({ level: 0, value: 'foo8' });
      });
    });

    describe('reexpanding', () => {
      beforeEach(async () => {
        expandIndex(grid, 7);
        await nextFrame();
        collapseIndex(grid, 7);
        await nextFrame();
      });

      it('should not request', async () => {
        grid.dataProvider.resetHistory();
        expandIndex(grid, 7);
        await nextFrame();
        expect(grid.dataProvider.callCount).to.equal(0);
      });

      it('should increase full size', async () => {
        expandIndex(grid, 7);
        await nextFrame();
        expect(grid._effectiveSize).to.equal(20);
      });

      it('should have first and second level items in cache', async () => {
        expandIndex(grid, 7);
        await nextFrame();
        expect(grid._cache.getItemForIndex(7)).to.deep.equal({ level: 0, value: 'foo7' });
        expect(grid._cache.getItemForIndex(8)).to.deep.equal({ level: 1, value: 'foo0' });
        expect(grid._cache.getItemForIndex(18)).to.deep.equal({ level: 0, value: 'foo8' });
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
    grid.dataProvider = function (params, callback) {
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

describe('page size grid', () => {
  it('should render grid rows when setting page-size before size', () => {
    const container = fixtureSync('<page-size-grid></page-size-grid>');
    const grid = container.$.grid;
    flushGrid(grid);
    expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('foo0');
  });
});

describe('wrapped grid', () => {
  let container, grid;

  describe('data-provider', () => {
    const loadDebounceTime = 100;

    beforeEach(async () => {
      container = fixtureSync('<wrapped-grid></wrapped-grid>');
      grid = container.$.grid;
      container.dataProvider = sinon.spy(infiniteDataProvider);
      await nextFrame();
      flushGrid(grid);
    });

    it('should call dataProvider for first page', async () => {
      container.dataProvider.resetHistory();
      grid.pageSize = 100;
      await aTimeout(loadDebounceTime);
      expect(container.dataProvider.callCount).to.eql(1);
      expect(container.dataProvider.firstCall.args[0].page).to.eql(0);
    });

    it('should call dataProvider multiple times to load all items', async () => {
      container.dataProvider.resetHistory();
      grid.style.fontSize = '12px';
      grid.pageSize = 5;
      flushGrid(grid);
      await aTimeout(loadDebounceTime);
      // assuming grid has about 18 items
      expect(container.dataProvider.callCount).to.be.above(2);
      for (let i = 0; i < container.dataProvider.callCount; i++) {
        expect(container.dataProvider.getCall(i).args[0].page).to.eql(i);
      }
    });

    it('should always load visible items', async () => {
      grid.pageSize = 10;
      await aTimeout(loadDebounceTime);
      container.dataProvider.resetHistory();
      await simulateScrollToEnd(grid);
      await aTimeout(loadDebounceTime);
      // 9 is last page out of 100 items / 10 per page.
      const pages = container.dataProvider.getCalls().map((call) => call.args[0].page);
      expect(pages).to.contain.members([7, 8, 9]);
    });

    it('should cache fetched pages', async () => {
      grid.pageSize = 10;
      // wait first to initially load first pages.
      await aTimeout(loadDebounceTime);
      await simulateScrollToEnd(grid);
      container.dataProvider.resetHistory();
      await simulateScrollToStart(grid);
      await aTimeout(loadDebounceTime);
      const pages = container.dataProvider.getCalls().map((call) => call.args[0].page);
      expect(pages).not.to.contain(0);
    });

    it('should bind item to templates', () => {
      container.dataProvider = infiniteDataProvider;
      expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('foo0');
    });

    it('should clear item cache', async () => {
      container.dataProvider = sinon.spy(infiniteDataProvider);
      await aTimeout(loadDebounceTime * 2);
      expect(container.dataProvider.called).to.be.true;
      const oldFirstItem = grid._cache.getItemForIndex(0);
      expect(oldFirstItem).to.be.ok;
      container.dataProvider.resetHistory();
      grid.clearCache();
      await aTimeout(loadDebounceTime * 2);
      expect(container.dataProvider.called).to.be.true;
      expect(grid._cache.getItemForIndex(0)).to.be.ok;
      expect(grid._cache.getItemForIndex(0)).not.to.equal(oldFirstItem);
    });

    it('should update sub properties on clearCache', async () => {
      const data = [{ value: 'foo' }];
      grid.size = 1;
      container.dataProvider = (params, cb) => cb(data);
      await nextFrame();
      expect(getCellContent(getFirstCell(grid)).textContent.trim()).to.equal('foo');
      data[0].value = 'bar';
      grid.clearCache();
      await nextFrame();
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

    it('should be in loading state when dataProvider changes', async () => {
      container.dataProvider = () => {};
      await nextFrame();
      expect(grid.loading).to.be.true;
    });

    it('should be in loading state when fetching new data', (done) => {
      let raf;

      container.dataProvider = (params, callback) => {
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

    it('should be in loading state when cache is cleared', async () => {
      let cb;
      container.dataProvider = (params, callback) => {
        cb = callback;
      };
      await nextFrame();
      cb(Array(25));
      expect(grid.loading).not.to.be.true;
      grid.clearCache();
      expect(grid.loading).to.be.true;
    });

    it('should set loading attribute to rows', async () => {
      container.dataProvider = () => {};
      await nextFrame();
      expect(getRows(grid.$.items)[0].hasAttribute('loading')).to.be.true;
    });

    it('should clear loading attribute from rows when data received', async () => {
      container.dataProvider = (params, callback) => {
        callback([{}]);
      };
      await nextFrame();
      expect(getRows(grid.$.items)[0].hasAttribute('loading')).to.be.false;
    });

    it('should clear loading attribute from rows when scrolled to previously loaded rows', () => {
      grid.pageSize = 1;
      container.dataProvider = (params, callback) => {
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

    it('should scroll to last index if size decreased beyond current viewport', async () => {
      grid.size = 5000;
      scrollToEnd(grid);
      await nextFrame();
      expect(getLastVisibleItem(grid).index).to.equal(grid.size - 1);

      grid.size = 50;
      await nextFrame();
      expect(getLastVisibleItem(grid).index).to.equal(grid.size - 1);

      // Test actual last visible item
      const rect = grid.getBoundingClientRect();
      const lastRowCenterX = rect.left + grid.offsetWidth / 2;
      const lastRowCenterY = rect.bottom - getPhysicalAverage(grid) / 2;
      const lastVisibleItem = grid.getRootNode().elementFromPoint(lastRowCenterX, lastRowCenterY);
      expect(lastVisibleItem.innerText.trim()).to.equal('foo' + (grid.size - 1));
    });
  });
});
