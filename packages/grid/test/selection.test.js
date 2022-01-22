import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-selection-column.js';
import '../vaadin-grid-filter.js';
import '../vaadin-grid-column-group.js';
import {
  flushGrid,
  getBodyCellContent,
  getCellContent,
  getRowCells,
  getRows,
  infiniteDataProvider
} from './helpers.js';

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
    grid.performUpdate();
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
      it('should reflect changes', async () => {
        grid.selectedItems = [...grid.selectedItems, cachedItems[1]];
        await nextFrame();
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
      beforeEach(async () => {
        grid = fixtureSync(fixtures[type]);
        if (type == 'renderer') {
          const cols = grid.children;
          cols[0].renderer = (root) => (root.textContent = 'foo');
          cols[1].renderer = (root) => (root.textContent = 'bar');
        }
        configureGrid();
        await nextFrame();
      });

      (type == 'template' ? it : it.skip)('should reflect cell instance value', async () => {
        if (type == 'template') {
          await nextFrame();
          const cells = getRowCells(rows[0]);
          cells[0]._content.__templateInstance.selected = false;
          await nextFrame();
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

      it('should select an equaling item', async () => {
        grid.itemIdPath = 'value';
        const cells = getRowCells(rows[0]);
        grid.selectedItems = [{ value: 'foo0' }];
        await nextFrame();
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

  beforeEach(async () => {
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

    await nextFrame();

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

  it('should select item when checkbox is checked', async () => {
    firstBodyCheckbox.checked = true;
    await nextFrame();
    expect(grid._isSelected(cachedItems[0])).to.be.true;
  });

  it('should dispatch one event on selection', async () => {
    const spy = sinon.spy();
    grid.addEventListener('selected-items-changed', spy);
    firstBodyCheckbox.checked = true;
    await nextFrame();

    expect(spy.callCount).to.equal(1);
    expect(spy.getCall(0).args[0].detail.value).to.equal(grid.selectedItems);
  });

  it('should add the item to selectedItems when row is clicked and auto-select is enabled', async () => {
    const cell = getRowCells(rows[1])[1];
    cell.click();
    await nextFrame();

    expect(grid.selectedItems).to.eql([getCellContent(cell).textContent]);
  });

  it('should remove the item from selectedItems when row is clicked and auto-select is enabled', async () => {
    grid.selectItem(grid.items[1]);
    const cell = getRowCells(rows[1])[1];
    cell.click();
    await nextFrame();
    expect(grid.selectedItems).to.eql([]);
  });

  it('should toggle the item in selectedItems when row is clicked and auto-select is enabled', async () => {
    const cell = getRowCells(rows[1])[1];
    cell.click();
    await nextFrame();
    expect(grid.selectedItems).to.eql([getCellContent(cell).textContent]);

    cell.click();
    await nextFrame();
    expect(grid.selectedItems).to.eql([]);
  });

  it('should have bound the body checkbox to selected items', async () => {
    const selectCheckbox = firstBodyCheckbox;

    grid.selectedItems = [...grid.selectedItems, cachedItems[0]];
    await nextFrame();

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

  it('should select all items when select all is set', async () => {
    selectionColumn.selectAll = true;
    await nextFrame();

    expect(grid.selectedItems).to.eql(grid.items);
  });

  it('should take filter into account when selecting all items', async () => {
    grid.items = [{ value: 'foo' }, { value: 'bar' }];
    grid._filters = [{ path: 'value', value: 'f' }];

    selectionColumn.selectAll = true;
    await nextFrame();

    expect(grid.selectedItems).to.eql([grid.items[0]]);
  });

  it('should deselect all items when select all is unset', () => {
    selectionColumn.selectAll = true;

    selectionColumn.selectAll = false;

    expect(grid.selectedItems).to.be.empty;
  });

  it('should set a copy of items when all items are selected', async () => {
    selectionColumn.selectAll = true;

    grid.selectedItems = grid.selectedItems.slice(0, -1);

    expect(grid.items).not.to.eql(grid.selectedItems);
  });

  it('should not set selection when data provider is used', async () => {
    grid.items = undefined;
    grid.dataProvider = infiniteDataProvider;

    await nextFrame();
    selectionColumn.selectAll = true;

    expect(grid.selectedItems).to.be.empty;
  });

  it('should hide select all checkbox when data provider is used', async () => {
    grid.items = undefined;
    grid.dataProvider = infiniteDataProvider;
    await nextFrame();

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

  it('should have indeterminate when an item is selected', async () => {
    firstBodyCheckbox.checked = true;
    await nextFrame();

    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  // iOS needs both to show the indeterminate status
  it('should have indeterminate and select-all when an item is selected', async () => {
    expect(selectAllCheckbox.checked).to.be.false;
    expect(selectAllCheckbox.indeterminate).not.to.be.ok;

    firstBodyCheckbox.checked = true;
    await nextFrame();
    expect(selectAllCheckbox.checked).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  it('should have indeterminate true when an item is deselected', async () => {
    selectAllCheckbox.click();
    await nextFrame();
    expect(selectAllCheckbox.indeterminate).to.be.false;

    firstBodyCheckbox.checked = false;
    await nextFrame();
    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  it('should have indeterminate false if selectedItems contains all items, no matter the order', async () => {
    grid.selectedItems = ['baz', 'foo', 'bar', 'hi'];

    await nextFrame();
    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should have select-all false if selectedItems does not contain all items', async () => {
    selectAllCheckbox.click();
    await nextFrame();
    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;

    grid.selectedItems = ['baz', 'foo', 'hi'];
    await nextFrame();
    expect(selectionColumn.selectAll).to.be.false;
    expect(selectAllCheckbox.indeterminate).to.be.true;
  });

  it('should not have selectAll after selecting a single item', () => {
    firstBodyCheckbox.checked = true;

    expect(selectionColumn.selectAll).to.be.false;
  });

  it('should not have selectAll after deselecting a single item', async () => {
    selectAllCheckbox.click();
    await nextFrame();
    firstBodyCheckbox.checked = false;
    await nextFrame();

    expect(selectionColumn.selectAll).to.be.false;
  });

  it('should not clear pre-selected items', async () => {
    const grid = fixtureSync(`
      <vaadin-grid selected-items='[{"value": "foo"}]'>
        <vaadin-grid-selection-column id="foo"></vaadin-grid-selection-column>
        <vaadin-grid-column path="value"></vaadin-grid-column>
      </vaadin-grid>
    `);
    await nextFrame();
    expect(grid.selectedItems).to.have.length(1);
  });

  it('should have selectAll after selecting all manually', async () => {
    [...grid.querySelectorAll('vaadin-checkbox:not(.vaadin-grid-select-all-checkbox)')].forEach((checkbox) => {
      checkbox.checked = true;
    });

    await nextFrame();
    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should select-all when all items are selected', async () => {
    rows.forEach((row) => {
      const cellContent = getCellContent(getRowCells(row)[0]);
      const checkbox = cellContent.children[0];
      checkbox.checked = true;
    });
    await nextFrame();

    expect(selectionColumn.selectAll).to.be.true;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should deselect-all when all items are deselected', async () => {
    selectAllCheckbox.click();

    await nextFrame();
    rows.forEach((row) => {
      const cellContent = getCellContent(getRowCells(row)[0]);
      const checkbox = cellContent.children[0];
      checkbox.checked = false;
    });
    await nextFrame();

    expect(selectionColumn.selectAll).to.be.false;
    expect(selectAllCheckbox.indeterminate).to.be.false;
  });

  it('should update select all when filters change', async () => {
    grid.items = [{ value: 'foo' }, { value: 'bar' }];

    await nextFrame();
    firstBodyCheckbox.checked = true;
    await nextFrame();

    const filter = grid.querySelector('#filter');
    filter.value = 'foo';
    filter.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));

    await nextFrame();
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

  it('should override the header content with a header text', async () => {
    selectionColumn.header = 'foo';

    await nextFrame();
    expect(firstHeaderCellContent.textContent).to.equal('foo');
    expect(firstBodyCellContent.firstElementChild).to.equal(firstBodyCheckbox);
  });

  it('should not override the header content with a path', async () => {
    selectionColumn.path = 'length';

    await nextFrame();
    expect(firstHeaderCellContent.firstElementChild).to.equal(selectAllCheckbox);
  });

  it('should not override the body content with a path', async () => {
    selectionColumn.path = 'length';

    await nextFrame();
    expect(firstBodyCellContent.firstElementChild).to.equal(firstBodyCheckbox);
  });

  it('should override the header content with a header renderer', async () => {
    selectionColumn.headerRenderer = (root) => {
      root.textContent = 'foo';
    };

    await nextFrame();
    expect(firstHeaderCellContent.textContent).to.equal('foo');
    expect(firstBodyCellContent.firstElementChild).to.equal(firstBodyCheckbox);
  });

  it('should override the body content with a renderer', async () => {
    selectionColumn.renderer = (root) => {
      root.textContent = 'foo';
    };

    await nextFrame();
    expect(firstBodyCellContent.textContent).to.equal('foo');
    expect(firstHeaderCellContent.firstElementChild).to.equal(selectAllCheckbox);
  });

  it('should select all items when select all is set', async () => {
    grid.items = Array.from({ length: 60 }, (_, key) => key + 1);

    selectionColumn.selectAll = true;

    await nextFrame();
    expect(grid.selectedItems).to.eql(grid.items);
  });
});
