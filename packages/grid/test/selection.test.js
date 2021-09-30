import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, listenOnce } from '@vaadin/testing-helpers';
import {
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getRows,
  getRowCells,
  infiniteDataProvider
} from './helpers.js';
import '@vaadin/vaadin-template-renderer';
import '../vaadin-grid.js';
import '../vaadin-grid-selection-column.js';
import '../vaadin-grid-filter.js';
import '../vaadin-grid-column-group.js';

const fixtures = {
  renderer: `
    <vaadin-grid style="width: 200px; height: 200px;" size="10">
      <vaadin-grid-column></vaadin-grid-column>
      <vaadin-grid-column></vaadin-grid-column>
    </vaadin-grid>
  `,
  template: `
    <vaadin-grid style="width: 200px; height: 200px;" size="10">
      <vaadin-grid-column>
        <template>foo</template>
      </vaadin-grid-column>
      <vaadin-grid-column>
        <template>bar</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `
};

describe('selection', () => {
  let grid;
  let rows;
  let cachedItems;

  function configureGrid() {
    grid.dataProvider = infiniteDataProvider;
    cachedItems = grid._cache.items;
    grid.selectedItems = [cachedItems[0]];
    flushGrid(grid);
    rows = getRows(grid.$.items);
  }

  describe('with renderer', () => {
    beforeEach(() => {
      grid = fixtureSync(fixtures.renderer);
      const cols = grid.children;
      cols[0].renderer = (root) => (root.textContent = 'foo');
      cols[1].renderer = (root) => (root.textContent = 'bar');
      configureGrid();
    });

    it('should set selected attribute', () => {
      expect(rows[0].hasAttribute('selected')).to.be.true;
      expect(rows[1].hasAttribute('selected')).to.be.false;
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

  ['renderer', 'template'].forEach((type) => {
    describe(`${type} cells`, () => {
      beforeEach(() => {
        grid = fixtureSync(fixtures[type]);
        if (type == 'renderer') {
          const cols = grid.children;
          cols[0].renderer = (root) => (root.textContent = 'foo');
          cols[1].renderer = (root) => (root.textContent = 'bar');
        }
        configureGrid();
      });

      (type == 'template' ? it : it.skip)('should reflect cell instance value', () => {
        if (type == 'template') {
          const cells = getRowCells(rows[0]);
          cells[0]._content.__templateInstance.selected = false;
          expect(cells[0]._content.__templateInstance.selected).to.be.false;
          expect(grid.selectedItems).to.be.empty;
        }
      });

      it('should bind to cells', () => {
        const cells = getRowCells(rows[0]);
        let cell = cells[0];
        let model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
        expect(model.selected).to.be.true;

        cell = cells[1];
        model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
        expect(model.selected).to.be.true;

        cell = getRowCells(rows[1])[0];
        model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
        expect(model.selected).to.be.false;
      });

      it('should select an equaling item', () => {
        grid.itemIdPath = 'value';
        const cells = getRowCells(rows[0]);
        grid.selectedItems = [{ value: 'foo0' }];
        const cell = cells[0];
        const model = cell._content.__templateInstance ?? grid.__getRowModel(cell.parentElement);
        expect(model.selected).to.be.true;
      });
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
        <vaadin-grid-selection-column>
          <template class="header">header</template>
          <template>[[item]]</template>
        </vaadin-grid-selection-column>
        <vaadin-grid-column-group>
          <vaadin-grid-selection-column></vaadin-grid-selection-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-filter path="value" value="[[filter]]">
              <input id="filter" slot="filter" value="{{filter::input}}">
            </vaadin-grid-filter>
          </template>
          <template></template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);

    grid.items = ['foo', 'bar', 'baz'];

    flushGrid(grid);

    selectionColumn = grid._columnTree[0][0];
    cachedItems = grid._cache.items;
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

  it('should be possible to override the body template', () => {
    const secondCell = getCellContent(getRowCells(rows[0])[1]);

    expect(secondCell.innerHTML).to.eql(secondCell.textContent);
  });

  it('should be possible to override the header template', () => {
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

  // iOS needs both to show the indeterminate status
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

    const filter = grid.querySelector('#filter');
    filter.value = 'foo';
    filter.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));

    filter.parentElement._debouncerFilterChanged.flush();
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
});
