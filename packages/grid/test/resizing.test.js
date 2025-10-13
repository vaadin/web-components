import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import {
  flushGrid,
  getContainerCellContent,
  getHeaderCellContent,
  getLastVisibleItem,
  getPhysicalItems,
  getRowCells,
  getRows,
  infiniteDataProvider,
  scrollToEnd,
} from './helpers.js';

describe('resizing', () => {
  let component, grid, column;

  beforeEach(async () => {
    component = fixtureSync(`
      <div>
        <vaadin-grid id="grid" style="width: 200px; height: 400px;" size="10" hidden>
          <vaadin-grid-column id="column" header="header"></vaadin-grid-column>
        </vaadin-grid>
      </div>
    `);
    grid = component.firstElementChild;
    grid.rowDetailsRenderer = (root, _, model) => {
      root.textContent = model.index;
    };
    column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, model) => {
      root.textContent = model.index;
    };
    column.footerRenderer = (root) => {
      root.textContent = 'footer';
    };
    grid.dataProvider = infiniteDataProvider;
    await nextResize(grid);
    grid.hidden = false;
    await nextResize(grid);
    flushGrid(grid);
  });

  it('should align rows correctly', () => {
    const rows = getRows(grid.$.items);
    expect(rows[0].getBoundingClientRect().bottom).to.be.closeTo(rows[1].getBoundingClientRect().top, 1);
  });

  it('should update header height', async () => {
    const bottom = grid.$.header.getBoundingClientRect().bottom;

    getHeaderCellContent(grid, 0, 0).style.fontSize = '100px';

    const newBottom = grid.$.header.getBoundingClientRect().bottom;
    expect(newBottom).to.be.above(bottom);
    await nextFrame();

    const firstBodyRowRect = getRows(grid.$.items)[0].getBoundingClientRect();
    expect(firstBodyRowRect.top).to.be.closeTo(newBottom, 1);
  });

  it('should update footer height', async () => {
    getContainerCellContent(grid.$.footer, 0, 0).style.fontSize = '100px';
    await nextResize(grid.$.footer);

    scrollToEnd(grid);

    const bodyRows = getRows(grid.$.items);
    expect(bodyRows[bodyRows.length - 1].getBoundingClientRect().bottom).to.be.closeTo(
      grid.$.footer.getBoundingClientRect().top,
      1,
    );
  });

  it('should update details row height', () => {
    grid.openItemDetails(grid._dataProviderController.rootCache.items[0]);
    const bodyRows = getRows(grid.$.items);
    const cells = getRowCells(bodyRows[0]);
    const detailsCell = cells.pop();
    const height = detailsCell.getBoundingClientRect().height;

    grid.style.fontSize = '100px';
    flushGrid(grid);

    expect(detailsCell.getBoundingClientRect().height).to.be.above(height);
    expect(detailsCell.getBoundingClientRect().bottom).to.be.closeTo(bodyRows[1].getBoundingClientRect().top, 2);
  });

  it('should align height with number of rows', async () => {
    grid.style.height = '';
    grid.allRowsVisible = true;
    await nextFrame();
    const headerHeight = grid.$.header.clientHeight;
    const bodyHeight = grid.$.items.clientHeight;
    const footerHeight = grid.$.footer.clientHeight;
    expect(grid.clientHeight).to.equal(headerHeight + bodyHeight + footerHeight);
  });

  // NOTE: This issue only manifests with scrollbars that affect the layout
  // (On mac: Show scroll bars: Always) and Chrome / Safari browser
  it('should have correct layout after column width change', async () => {
    grid.style.height = '';
    grid.allRowsVisible = true;
    column.width = '300px';
    // Before next render
    await nextFrame();
    // After next render
    await aTimeout(0);
    expect(grid.$.scroller.getBoundingClientRect().bottom).to.equal(grid.$.table.getBoundingClientRect().bottom);
  });

  it('should create rows when resized while scrolled to bottom', async () => {
    // Have a full width grid inside a fixed width container
    component = fixtureSync(`
    <div style="height: 200px;">
      <vaadin-grid style="height: 100%;">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    </div>
    `);
    grid = component.querySelector('vaadin-grid');
    grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
      root.textContent = model.item.name;
    };
    const itemCount = 1000;
    grid.items = Array.from({ length: itemCount }, (_, i) => ({
      name: `Item ${i}`,
    }));
    // Scroll to end
    grid.scrollToIndex(itemCount - 1);
    await aTimeout(200);
    // Resize container
    for (let i = 0; i < 10; i++) {
      component.style.height = `${component.offsetHeight + 200}px`;
      flushGrid(grid);
      await aTimeout(50);
    }
    const gridRect = grid.getBoundingClientRect();
    // Get an element from the area where new rows should be created
    const elementInResizedArea = document.elementFromPoint(gridRect.left + 1, gridRect.top + 50);
    const isCell = elementInResizedArea && elementInResizedArea.tagName === 'VAADIN-GRID-CELL-CONTENT';
    expect(isCell).to.be.true;
  });

  describe('flexbox parent', () => {
    beforeEach(() => {
      grid.style.height = grid.style.width = '';
      grid.size = 1;
      component.style.display = 'flex';
      component.style.flexDirection = 'column';
      grid.allRowsVisible = true;
    });

    it('should have the default height inside a column flexbox', () => {
      grid.allRowsVisible = false;
      expect(grid.getBoundingClientRect().height).to.equal(400);
    });

    it('should not auto-grow inside a fixed height column flexbox', async () => {
      component.style.height = '500px';
      await nextResize(grid);
      expect(grid.getBoundingClientRect().height).to.equal(130);
    });

    it('should not auto-grow inside a fixed height row flexbox', async () => {
      component.style.flexDirection = 'row';
      component.style.height = '500px';
      await nextResize(grid);
      expect(grid.getBoundingClientRect().height).to.equal(130);
    });

    it('should not shrink horizontally inside a row flexbox', () => {
      component.style.flexDirection = 'row';
      expect(grid.getBoundingClientRect().width).to.equal(component.offsetWidth);
    });

    it('should not shrink vertically inside a column flexbox with another child', () => {
      grid.size = 5;

      component.style.height = '500px';
      grid.after(fixtureSync('<div style="height: 100%"></div>'));

      expect(grid._firstVisibleIndex).to.equal(0);
      expect(grid._lastVisibleIndex).to.equal(grid.size - 1);
    });

    it('should shrink horizontally inside a row flexbox with another child', () => {
      component.style.flexDirection = 'row';
      grid.after(fixtureSync('<div style="height: 100%; width: 100px;"></div>'));

      expect(grid.getBoundingClientRect().width).to.be.equal(component.offsetWidth - 100);
    });
  });
});

describe('all rows visible', () => {
  let grid;

  describe('renderer', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.querySelector('vaadin-grid-column').renderer = (root, _, model) => {
        root.textContent = model.index;
      };
    });

    it('should align height with number of rows after first render', () => {
      grid.items = new Array(100).fill().map((_, idx) => ({ value: idx }));
      flushGrid(grid);

      grid.allRowsVisible = true;
      flushGrid(grid);

      expect(grid.$.items.children.length).to.equal(100);
    });
  });

  describe('path', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="value"></vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.firstElementChild.header = null;
      grid.allRowsVisible = true;
      grid.items = [{ value: 1 }];
      flushGrid(grid);
    });

    it('should have body rows if header is not visible', () => {
      expect(getPhysicalItems(grid).length).to.be.above(0);
    });

    it('should have body rows after items reset and repopulated', () => {
      grid.items = [];
      flushGrid(grid);
      grid.items = [{ value: 1 }];
      flushGrid(grid);
      expect(getPhysicalItems(grid).length).to.be.above(0);
    });
  });

  describe('max-height', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-grid>
            <vaadin-grid-column path="value"></vaadin-grid-column>
          </vaadin-grid>
        </div>
      `);
      grid = wrapper.firstElementChild;
      grid.allRowsVisible = true;
      grid.style.maxHeight = '300px';
      const items = [...Array(100)].map((_, idx) => ({ value: idx }));
      grid.dataProvider = sinon.spy((params, callback) => {
        callback(
          items.slice(params.page * params.pageSize, params.page * params.pageSize + params.pageSize),
          items.length,
        );
      });

      flushGrid(grid);
    });

    it('should include rows', () => {
      const lastRowRect = getLastVisibleItem(grid).getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      expect(lastRowRect.top).to.be.below(gridRect.bottom);
      expect(lastRowRect.bottom).to.be.above(gridRect.bottom);
    });

    it('should not overflow rows', () => {
      const gridRect = grid.getBoundingClientRect();
      const belowGrid = document.elementFromPoint(gridRect.left + 1, gridRect.bottom + 1);
      expect(grid.contains(belowGrid)).to.be.false;
    });

    it('should not grow beyond max-height', () => {
      expect(grid.getBoundingClientRect().height).to.equal(300);
    });

    it('should shrink below max-height', () => {
      grid.items = [{ value: 0 }];
      flushGrid(grid);
      expect(grid.getBoundingClientRect().height).to.be.below(100);
    });

    it('should have requested first page initially', () => {
      const calls = grid.dataProvider.getCalls();
      expect(calls.some((call) => call.firstArg.page === 0)).to.be.true;
    });

    it('should not have requested second page initially', () => {
      const calls = grid.dataProvider.getCalls();
      expect(calls.some((call) => call.firstArg.page === 1)).to.be.false;
    });

    it('should request second page when max-height is reset', () => {
      grid.style.maxHeight = '';
      flushGrid(grid);
      const calls = grid.dataProvider.getCalls();
      expect(calls.some((call) => call.firstArg.page === 1)).to.be.true;
    });

    it('should not overflow rows when using relative max-height', () => {
      wrapper.style.height = '600px';
      grid.style.maxHeight = '50%';

      const gridRect = grid.getBoundingClientRect();
      const belowGrid = document.elementFromPoint(gridRect.left + 1, gridRect.bottom + 1);
      expect(grid.contains(belowGrid)).to.be.false;
    });
  });

  describe('tree grid', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-tree-column path="value"></vaadin-grid-tree-column>
        </vaadin-grid>
      `);
      grid.allRowsVisible = true;
      grid.itemIdPath = 'value';
      grid.dataProvider = ({ parentItem }, cb) => {
        const item = {
          value: `${parentItem ? `${parentItem.value}-` : ''}0`,
          children: true,
        };
        cb([item], 1);
      };
    });

    it('should have all rows visible on deep expand', () => {
      grid.expandedItems = [
        { value: '0' },
        { value: '0-0' },
        { value: '0-0-0' },
        { value: '0-0-0-0' },
        { value: '0-0-0-0-0' },
        { value: '0-0-0-0-0-0' },
        { value: '0-0-0-0-0-0-0' },
        { value: '0-0-0-0-0-0-0-0' },
      ];

      flushGrid(grid);
      expect(grid._firstVisibleIndex).to.equal(0);
      expect(grid._lastVisibleIndex).to.equal(8);
    });

    it('should have all rows visible on deep expand with no header', () => {
      grid.expandedItems = [
        { value: '0' },
        { value: '0-0' },
        { value: '0-0-0' },
        { value: '0-0-0-0' },
        { value: '0-0-0-0-0' },
        { value: '0-0-0-0-0-0' },
        { value: '0-0-0-0-0-0-0' },
        { value: '0-0-0-0-0-0-0-0' },
      ];

      const column = grid.querySelector('vaadin-grid-tree-column');
      column.header = null;

      flushGrid(grid);
      expect(grid._firstVisibleIndex).to.equal(0);
      expect(grid._lastVisibleIndex).to.equal(8);
    });
  });
});
