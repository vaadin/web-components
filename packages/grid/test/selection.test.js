import { expect } from '@esm-bundle/chai';
import { click, fixtureSync, listenOnce, mousedown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import '../vaadin-grid-selection-column.js';
import '../vaadin-grid-filter-column.js';
import '../vaadin-grid-column-group.js';
import {
  fire,
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getFirstVisibleItem,
  getLastVisibleItem,
  getRowBodyCells,
  getRowCells,
  getRows,
  infiniteDataProvider,
} from './helpers.js';

describe('selection', () => {
  let grid;
  let rows;
  let cachedItems;

  function configureGrid() {
    grid.dataProvider = infiniteDataProvider;
    cachedItems = grid._dataProviderController.rootCache.items;
    grid.selectedItems = [cachedItems[0]];
    flushGrid(grid);
    rows = getRows(grid.$.items);
  }

  describe('with renderer', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 200px;" size="10">
          <vaadin-grid-column></vaadin-grid-column>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);

      const cols = grid.children;
      cols[0].renderer = (root) => {
        root.textContent = 'foo';
      };
      cols[1].renderer = (root) => {
        root.textContent = 'bar';
      };
      configureGrid();
    });

    it('should set selected attribute', () => {
      expect(rows[0].hasAttribute('selected')).to.be.true;
      expect(rows[1].hasAttribute('selected')).to.be.false;
    });

    it('should add selected to row part attribute', () => {
      expect(rows[0].getAttribute('part')).to.contain('selected-row');
      expect(rows[1].getAttribute('part')).to.not.contain('selected-row');
    });

    it('should add selected to cells part attribute', () => {
      const cells = getRowBodyCells(rows[0]);
      cells.forEach((cell) => {
        expect(cell.getAttribute('part')).to.contain('selected-row-cell');
      });
    });

    it('should not update selected attribute for hidden rows', () => {
      grid.size = 0;
      grid.selectedItems = [];
      // Even though all selections were cleared, the first row is hidden / not in use
      // because the grid's size was set to 0. Unused rows should never be updated.
      expect(rows[0].hasAttribute('selected')).to.be.true;
    });

    it('should deselect an equaling item', () => {
      grid.itemIdPath = 'value';
      grid.selectedItems = [rows[0]._item];
      grid.deselectItem({ value: 'foo0' });
      expect(grid.selectedItems).to.be.empty;
    });

    describe('selectedItems', () => {
      it('should reflect changes', () => {
        grid.push('selectedItems', cachedItems[1]);
        expect(rows[1].hasAttribute('selected')).to.be.true;
      });

      it('should notify', (done) => {
        listenOnce(grid, 'selected-items-changed', () => done());
        grid.selectedItems = [cachedItems[1]];
      });
    });

    describe('select functions', () => {
      it('should select item', () => {
        expect(grid._isSelected(cachedItems[1])).to.be.false;
        grid.selectItem(cachedItems[1]);
        expect(grid._isSelected(cachedItems[1])).to.be.true;
      });

      it('should deselect item', () => {
        expect(grid._isSelected(cachedItems[0])).to.be.true;
        grid.deselectItem(cachedItems[0]);
        expect(grid._isSelected(cachedItems[0])).to.be.false;
      });

      it('should select multiple rows', () => {
        grid.selectItem(cachedItems[1]);
        grid.selectItem(cachedItems[2]);
        expect(grid._isSelected(cachedItems[1])).to.be.true;
        expect(grid._isSelected(cachedItems[2])).to.be.true;
      });
    });
  });

  describe('renderer cells', () => {
    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 200px;" size="10">
          <vaadin-grid-column></vaadin-grid-column>
          <vaadin-grid-column></vaadin-grid-column>
        </vaadin-grid>
      `);

      const cols = grid.children;
      cols[0].renderer = (root) => {
        root.textContent = 'foo';
      };
      cols[1].renderer = (root) => {
        root.textContent = 'bar';
      };

      configureGrid();
    });

    it('should bind to cells', () => {
      const cells = getRowCells(rows[0]);
      let cell = cells[0];
      let model = grid.__getRowModel(cell.parentElement);
      expect(model.selected).to.be.true;

      cell = cells[1];
      model = grid.__getRowModel(cell.parentElement);
      expect(model.selected).to.be.true;

      cell = getRowCells(rows[1])[0];
      model = grid.__getRowModel(cell.parentElement);
      expect(model.selected).to.be.false;
    });

    it('should select an equaling item', () => {
      grid.itemIdPath = 'value';
      const cells = getRowCells(rows[0]);
      grid.selectedItems = [{ value: 'foo0' }];
      const cell = cells[0];
      const model = grid.__getRowModel(cell.parentElement);
      expect(model.selected).to.be.true;
    });
  });
});

describe('multi selection column', () => {
  let grid;
  let rows;
  let cachedItems;
  let headerRows;
  let firstHeaderCellContent, firstBodyCellContent;
  let selectionColumn;
  let selectAllCheckbox, firstBodyCheckbox;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 200px;">
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-selection-column header="header"></vaadin-grid-selection-column>

        <vaadin-grid-column-group>
          <vaadin-grid-selection-column></vaadin-grid-selection-column>
        </vaadin-grid-column-group>

        <vaadin-grid-filter-column path="value"></vaadin-grid-filter-column>
      </vaadin-grid>
    `);

    grid.querySelector('[header="header"]').renderer = (root, _, { item }) => {
      root.textContent = item;
    };

    grid.items = ['foo', 'bar', 'baz'];

    flushGrid(grid);

    selectionColumn = grid._columnTree[0][0];
    cachedItems = grid._dataProviderController.rootCache.items;
    rows = getRows(grid.$.items);
    headerRows = getRows(grid.$.header);

    flushGrid(grid);

    firstHeaderCellContent = getCellContent(getRowCells(headerRows[1])[0]);
    firstBodyCellContent = getCellContent(getRowCells(rows[0])[0]);

    selectAllCheckbox = firstHeaderCellContent.children[0];
    firstBodyCheckbox = firstBodyCellContent.children[0];
  });

  it('should clean up listeners on detach', () => {
    grid.removeChild(selectionColumn);
    expect(() => grid.selectItem('foo')).not.to.throw(Error);
  });

  it('should have a checkbox in the body cell', () => {
    expect(firstBodyCheckbox.localName).to.eql('vaadin-checkbox');
  });

  it('should select item when checkbox is checked', () => {
    firstBodyCheckbox.checked = true;
    expect(grid._isSelected(cachedItems[0])).to.be.true;
  });

  it('should dispatch one event on selection', () => {
    const spy = sinon.spy();
    grid.addEventListener('selected-items-changed', spy);
    firstBodyCheckbox.checked = true;
    expect(spy.callCount).to.equal(1);
    expect(spy.getCall(0).args[0].detail.value).to.equal(grid.selectedItems);
  });

  it('should add the item to selectedItems when row is clicked and auto-select is enabled', () => {
    const cell = getRowCells(rows[1])[1];
    cell.click();

    expect(grid.selectedItems).to.eql([getCellContent(cell).textContent]);
  });

  it('should remove the item from selectedItems when row is clicked and auto-select is enabled', () => {
    grid.selectItem(grid.items[1]);
    const cell = getRowCells(rows[1])[1];
    cell.click();
    expect(grid.selectedItems).to.eql([]);
  });

  it('should toggle the item in selectedItems when row is clicked and auto-select is enabled', () => {
    const cell = getRowCells(rows[1])[1];
    cell.click();
    expect(grid.selectedItems).to.eql([getCellContent(cell).textContent]);
    cell.click();
    expect(grid.selectedItems).to.eql([]);
  });

  it('should have bound the body checkbox to selected items', () => {
    const selectCheckbox = firstBodyCheckbox;

    grid.push('selectedItems', cachedItems[0]);

    expect(selectCheckbox.checked).to.be.true;
  });

  it('should have a select all checkbox in the header', () => {
    expect(selectAllCheckbox.localName).to.eql('vaadin-checkbox');
  });

  it('should have class name for the select all checkbox', () => {
    expect(selectAllCheckbox.classList.contains('vaadin-grid-select-all-checkbox')).to.be.true;
  });

  it('should set selectAll when header checkbox is clicked', () => {
    selectAllCheckbox.click();
    expect(selectionColumn.selectAll).to.be.true;
  });

  it('should select all items when select all is set', () => {
    selectionColumn.selectAll = true;

    expect(grid.selectedItems).to.eql(grid.items);
  });

  it('should take filter into account when selecting all items', () => {
    grid.items = [{ value: 'foo' }, { value: 'bar' }];
    grid._filters = [{ path: 'value', value: 'f' }];

    selectionColumn.selectAll = true;

    expect(grid.selectedItems).to.eql([grid.items[0]]);
  });

  it('should deselect all items when select all is unset', () => {
    selectionColumn.selectAll = true;

    selectionColumn.selectAll = false;

    expect(grid.selectedItems).to.be.empty;
  });

  it('should set a copy of items when all items are selected', () => {
    selectionColumn.selectAll = true;

    grid.pop('selectedItems');

    expect(grid.items).not.to.eql(grid.selectedItems);
  });

  it('should not set selection when data provider is used', () => {
    grid.items = undefined;
    grid.dataProvider = infiniteDataProvider;

    selectionColumn.selectAll = true;

    expect(grid.selectedItems).to.be.empty;
  });

  it('should hide select all checkbox when data provider is used', () => {
    grid.items = undefined;
    grid.dataProvider = infiniteDataProvider;

    expect(selectAllCheckbox.hidden).to.be.true;
  });

  it('should show select all checkbox when items is set', () => {
    grid.items = ['foo'];

    expect(selectAllCheckbox.hidden).to.be.false;
  });

  it('should be possible to override the body renderer', () => {
    const secondCell = getCellContent(getRowCells(rows[0])[1]);

    expect(secondCell.innerHTML).to.eql(secondCell.textContent);
  });

  it('should be possible to override the header renderer', () => {
    const secondCell = getCellContent(getRowCells(headerRows[1])[1]);

    expect(secondCell.innerHTML).to.eql('header');
  });

  it('should have grid reference also when column is nested inside a group', () => {
    expect(grid._columnTree[1][2]._grid).to.eql(grid);
  });

  it('should be unchecked when nothing is selected', () => {
    expect(selectAllCheckbox.indeterminate).not.to.be.ok;
    expect(selectAllCheckbox.checked).to.be.false;
  });

  it('should have indeterminate when an item is selected', () => {
    firstBodyCheckbox.checked = true;

    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  // IOS needs both to show the indeterminate status
  it('should have indeterminate and select-all when an item is selected', () => {
    expect(selectAllCheckbox.checked).to.be.false;
    expect(selectAllCheckbox.indeterminate).not.to.be.ok;

    firstBodyCheckbox.checked = true;
    expect(selectAllCheckbox.checked).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  it('should have indeterminate true when an item is deselected', () => {
    selectAllCheckbox.click();
    expect(selectAllCheckbox.indeterminate).to.be.false;

    firstBodyCheckbox.checked = false;
    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  it('should have indeterminate false if selectedItems contains all items, no matter the order', () => {
    grid.set('selectedItems', ['baz', 'foo', 'bar', 'hi']);

    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should have select-all false if selectedItems does not contain all items', () => {
    selectAllCheckbox.click();
    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;

    grid.set('selectedItems', ['baz', 'foo', 'hi']);
    expect(selectionColumn.selectAll).to.be.false;
    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  it('should not have selectAll after selecting a single item', () => {
    firstBodyCheckbox.checked = true;

    expect(selectionColumn.selectAll).to.be.false;
  });

  it('should not have selectAll after deselecting a single item', () => {
    selectAllCheckbox.click();

    firstBodyCheckbox.checked = false;

    expect(selectionColumn.selectAll).to.be.false;
  });

  it('should not clear pre-selected items', () => {
    const grid = fixtureSync(`
      <vaadin-grid selected-items='[{"value": "foo"}]'>
        <vaadin-grid-selection-column></vaadin-grid-selection-column>
        <vaadin-grid-column path="value"></vaadin-grid-column>
      </vaadin-grid>
    `);
    expect(grid.selectedItems).to.have.length(1);
  });

  it('should have selectAll after selecting all manually', () => {
    selectAllCheckbox.click();
    firstBodyCheckbox.checked = true;

    firstBodyCheckbox.checked = true;

    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should select-all when all items are selected', () => {
    rows.forEach((row) => {
      const cellContent = getCellContent(getRowCells(row)[0]);
      const checkbox = cellContent.children[0];
      checkbox.checked = true;
    });

    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should deselect-all when all items are deselected', () => {
    selectAllCheckbox.click();

    rows.forEach((row) => {
      const cellContent = getCellContent(getRowCells(row)[0]);
      const checkbox = cellContent.children[0];
      checkbox.checked = false;
    });

    expect(selectionColumn.selectAll).to.be.false;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should update select all when filters change', () => {
    grid.items = [{ value: 'foo' }, { value: 'bar' }];

    firstBodyCheckbox.checked = true;

    const filter = grid.querySelector('vaadin-grid-filter');
    filter.value = 'foo';
    filter.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));

    filter._debouncerFilterChanged.flush();

    expect(selectionColumn.selectAll).to.be.true;
  });

  it('should not throw with data provider', () => {
    grid.items = undefined;
    grid.dataProvider = infiniteDataProvider;
    grid.size = 1;

    const checkbox = getBodyCellContent(grid, 0, 0).firstElementChild;
    expect(() => checkbox.click()).not.to.throw(Error);
  });

  it('should override the header content with a header text', () => {
    selectionColumn.header = 'foo';

    expect(firstHeaderCellContent.textContent).to.equal('foo');
    expect(firstBodyCellContent.firstElementChild).to.equal(firstBodyCheckbox);
  });

  it('should not override the header content with a path', () => {
    selectionColumn.path = 'length';

    expect(firstHeaderCellContent.firstElementChild).to.equal(selectAllCheckbox);
  });

  it('should not override the body content with a path', () => {
    selectionColumn.path = 'length';

    expect(firstBodyCellContent.firstElementChild).to.equal(firstBodyCheckbox);
  });

  it('should override the header content with a header renderer', () => {
    selectionColumn.headerRenderer = (root) => {
      root.textContent = 'foo';
    };

    expect(firstHeaderCellContent.textContent).to.equal('foo');
    expect(firstBodyCellContent.firstElementChild).to.equal(firstBodyCheckbox);
  });

  it('should override the body content with a renderer', () => {
    selectionColumn.renderer = (root) => {
      root.textContent = 'foo';
    };

    expect(firstBodyCellContent.textContent).to.equal('foo');
    expect(firstHeaderCellContent.firstElementChild).to.equal(selectAllCheckbox);
  });

  it('should select all items when select all is set', () => {
    grid.items = Array.from({ length: 60 }, (_, key) => key + 1);

    selectionColumn.selectAll = true;

    expect(grid.selectedItems).to.eql(grid.items);
  });

  describe('drag selection', () => {
    let clock;

    function fireTrackEvent(targetCell, startCell, eventState) {
      const targetCellRect = targetCell.getBoundingClientRect();
      const startCellRect = startCell.getBoundingClientRect();
      fire(
        'track',
        { state: eventState, y: targetCellRect.y, dy: targetCellRect.y - startCellRect.y },
        { node: targetCell },
      );
    }

    beforeEach(() => {
      grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 450px;">
        <vaadin-grid-selection-column drag-select></vaadin-grid-selection-column>
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
      grid.items = [...new Array(100)].map((_, i) => `${i}`);
      flushGrid(grid);

      selectionColumn = grid._columnTree[0][0];
      rows = getRows(grid.$.items);

      clock = sinon.useFakeTimers({
        shouldClearNativeTimers: true,
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should select items on mouse drag', () => {
      let startCell;

      [...rows].slice(1, 4).forEach((row, index) => {
        let eventState = 'track';
        if (index === 0) {
          eventState = 'start';
          startCell = getCellContent(getRowCells(row)[0]);
        } else if (index === 3) {
          eventState = 'end';
        }

        const currentCell = getCellContent(getRowCells(row)[0]);
        fireTrackEvent(currentCell, startCell, eventState);
        clock.tick(10);
      });

      expect(grid.selectedItems).to.eql(grid.items.slice(1, 4));
    });

    it('should not select any items on mouse drag when dragSelect is disabled', () => {
      selectionColumn.dragSelect = false;

      const sourceCell = getBodyCellContent(grid, 0, 0);
      const targetCell = getBodyCellContent(grid, 1, 0);

      fireTrackEvent(sourceCell, sourceCell, 'start');
      clock.tick(10);
      fireTrackEvent(sourceCell, sourceCell, 'track');
      clock.tick(10);
      fireTrackEvent(targetCell, sourceCell, 'end');

      expect(grid.selectedItems).to.empty;
    });

    it('should select a single row on mouse drag', () => {
      const cell = getBodyCellContent(grid, 1, 0);

      fireTrackEvent(cell, cell, 'start');
      clock.tick(10);
      fireTrackEvent(cell, cell, 'track');
      clock.tick(10);
      fireTrackEvent(cell, cell, 'end');

      expect(grid.selectedItems).to.eql(grid.items.slice(1, 2));
    });

    it('should not toggle checkbox after dragging on a single checkbox', () => {
      const cell = getBodyCellContent(grid, 1, 0);
      const checkBox = cell.querySelector('vaadin-checkbox');
      const input = checkBox.querySelector('input');

      fireTrackEvent(input, input, 'start');
      clock.tick(10);
      fireTrackEvent(input, input, 'track');
      clock.tick(10);
      fireTrackEvent(input, input, 'end');

      // Click on checkbox which would normally toggle selection state, thus
      // reverting the selection made on drag end
      click(input);

      // Verify item is still selected
      expect(grid.selectedItems).to.eql(grid.items.slice(1, 2));
    });

    it('should not toggle active item after dragging on a single cell', () => {
      selectionColumn.autoSelect = true;
      const cell = getBodyCellContent(grid, 1, 0);

      fireTrackEvent(cell, cell, 'start');
      clock.tick(10);
      fireTrackEvent(cell, cell, 'track');
      clock.tick(10);
      fireTrackEvent(cell, cell, 'end');

      // Click on cell which would normally change the active item, thus
      // reverting the selection made on drag end
      click(cell);

      // Verify item is still selected
      expect(grid.selectedItems).to.eql(grid.items.slice(1, 2));
    });

    it('should deselect rows on mouse drag', () => {
      grid.selectedItems = [rows[1]._item, rows[3]._item, rows[4]._item];

      let startCell;

      [...rows].slice(1, 5).forEach((row, index) => {
        let eventState = 'track';
        if (index === 0) {
          eventState = 'start';
          startCell = getCellContent(getRowCells(row)[0]);
        } else if (index === 4) {
          eventState = 'end';
        }

        const currentCell = getCellContent(getRowCells(row)[0]);
        fireTrackEvent(currentCell, startCell, eventState);
        clock.tick(10);
      });

      expect(grid.selectedItems).to.empty;
    });

    it('should prevent text selection on mouse dragging', () => {
      const spy = sinon.spy();
      const sourceCell = getBodyCellContent(grid, 0, 0);
      sourceCell.addEventListener('mousedown', spy);
      mousedown(sourceCell);

      expect(spy.called).to.be.true;
      expect(spy.args[0][0].defaultPrevented).to.be.true;
    });

    it('should not prevent text selection on mouse dragging when dragSelect is disabled', () => {
      selectionColumn.dragSelect = false;
      const spy = sinon.spy();
      const sourceCell = getBodyCellContent(grid, 0, 0);
      sourceCell.addEventListener('mousedown', spy);
      mousedown(sourceCell);

      expect(spy.called).to.be.true;
      expect(spy.args[0][0].defaultPrevented).to.be.false;
    });

    it('should not scroll when dragging grid center region', () => {
      const prevScrollTop = grid.$.table.scrollTop;
      const centerIndex = Math.floor((getLastVisibleItem(grid).index - getFirstVisibleItem(grid).index) / 2);
      const centerCell = getBodyCellContent(grid, centerIndex, 0);
      const nextCenterCell = getBodyCellContent(grid, centerIndex + 1, 0);
      fireTrackEvent(centerCell, centerCell, 'start');
      fireTrackEvent(nextCenterCell, centerCell, 'track');
      clock.tick(10);

      expect(grid.$.table.scrollTop).to.be.eq(prevScrollTop);
    });

    it('should scroll upwards when dragging grid top region', () => {
      grid.scrollToIndex(10);

      const prevScrollTop = grid.$.table.scrollTop;
      const firstVisibleCell = getBodyCellContent(grid, getFirstVisibleItem(grid).index, 0);
      const lastVisibleCell = getBodyCellContent(grid, getLastVisibleItem(grid).index, 0);
      fireTrackEvent(lastVisibleCell, lastVisibleCell, 'start');
      fireTrackEvent(firstVisibleCell, lastVisibleCell, 'track');
      clock.tick(10);

      expect(grid.$.table.scrollTop).to.be.lt(prevScrollTop);
    });

    it('should not scroll upwards when dragging down in grid top region', () => {
      grid.scrollToIndex(10);

      const prevScrollTop = grid.$.table.scrollTop;
      const firstVisibleCell = getBodyCellContent(grid, getFirstVisibleItem(grid).index, 0);
      const secondVisibleCell = getBodyCellContent(grid, getFirstVisibleItem(grid).index + 1, 0);
      fireTrackEvent(firstVisibleCell, firstVisibleCell, 'start');
      fireTrackEvent(secondVisibleCell, firstVisibleCell, 'track');
      clock.tick(10);

      expect(grid.$.table.scrollTop).to.be.eq(prevScrollTop);
    });

    it('should scroll downwards when dragging grid bottom region', () => {
      const prevScrollTop = grid.$.table.scrollTop;
      const firstVisibleCell = getBodyCellContent(grid, getFirstVisibleItem(grid).index, 0);
      const lastVisibleCell = getBodyCellContent(grid, getLastVisibleItem(grid).index, 0);
      fireTrackEvent(firstVisibleCell, firstVisibleCell, 'start');
      fireTrackEvent(lastVisibleCell, firstVisibleCell, 'track');
      clock.tick(10);

      expect(grid.$.table.scrollTop).to.be.gt(prevScrollTop);
    });

    it('should not scroll downwards when dragging up in grid bottom region', () => {
      const prevScrollTop = grid.$.table.scrollTop;
      const lastVisibleCell = getBodyCellContent(grid, getLastVisibleItem(grid).index, 0);
      const previousVisibleCell = getBodyCellContent(grid, getLastVisibleItem(grid).index - 1, 0);
      fireTrackEvent(lastVisibleCell, lastVisibleCell, 'start');
      fireTrackEvent(previousVisibleCell, lastVisibleCell, 'track');
      clock.tick(10);

      expect(grid.$.table.scrollTop).to.be.eq(prevScrollTop);
    });
  });
});
