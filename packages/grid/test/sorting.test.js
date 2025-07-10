import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, keyUpOn, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import { Grid } from '../src/vaadin-grid.js';
import {
  buildDataSet,
  flushGrid,
  getBodyCellContent,
  getContainerCell,
  getHeaderCellContent,
  getRows,
  shiftClick,
} from './helpers.js';

describe('sorting', () => {
  describe('sorter', () => {
    let sorter, title, button, orderIndicator;

    beforeEach(async () => {
      sorter = fixtureSync(`
        <vaadin-grid-sorter path="path">
          <span class="title">title</span><button>Button</button>
        </vaadin-grid-sorter>
      `);
      button = sorter.querySelector('button');
      title = sorter.querySelector('.title');
      await nextFrame();
      orderIndicator = sorter.shadowRoot.querySelector('[part="order"]');
    });

    it('should have default direction', () => {
      expect(sorter.direction).to.equal(null);
    });

    it('should toggle direction', () => {
      click(sorter);
      expect(sorter.direction).to.equal('asc');
      click(sorter);
      expect(sorter.direction).to.equal('desc');
      click(sorter);
      expect(sorter.direction).to.equal(null);
    });

    it('should not toggle on focusable click', () => {
      button.focus();
      click(button);
      expect(sorter.direction).to.equal(null);
    });

    it('should not toggle if click event is already consumed', () => {
      title.addEventListener('click', (e) => e.preventDefault());
      click(title);
      expect(sorter.direction).to.equal(null);
    });

    it('should fire a sorter-changed event', () => {
      const spy = sinon.spy();
      sorter.addEventListener('sorter-changed', spy);

      sorter.direction = 'asc';

      expect(spy.calledOnce).to.be.true;
    });

    it('should add shiftClick detail on sorter-changed event', () => {
      const clickSpy = sinon.spy();
      sorter.addEventListener('sorter-changed', clickSpy);
      click(sorter);

      const clickEvent = clickSpy.args[0][0];
      expect(clickEvent.detail.shiftClick).to.be.false;

      const shiftClickSpy = sinon.spy();
      sorter.addEventListener('sorter-changed', shiftClickSpy);
      shiftClick(sorter);

      const shiftClickEvent = shiftClickSpy.args[0][0];
      expect(shiftClickEvent.detail.shiftClick).to.be.true;
    });

    it('should show order indicator', () => {
      expect(orderIndicator.innerText).to.equal('');
      sorter._order = 0;
      expect(orderIndicator.innerText).to.equal('1');
      sorter._order = 4;
      expect(orderIndicator.innerText).to.equal('5');
    });

    it('should show direction indicator', () => {
      expect(sorter.getAttribute('direction')).to.equal(null);
      sorter.direction = 'asc';
      expect(sorter.getAttribute('direction')).to.equal('asc');
      sorter.direction = 'desc';
      expect(sorter.getAttribute('direction')).to.equal('desc');
    });

    it('should prevent default on click', () => {
      const clickEvent = click(sorter);

      expect(clickEvent.defaultPrevented).to.be.true;
    });
  });

  describe('DOM operations', () => {
    let grid, columns, sorters;

    function assertColumnCellOrder(column, expected) {
      const colIndex = columns.indexOf(column);
      const rows = [...getRows(grid.$.items)];
      expect(rows.map((_, rowIndex) => getBodyCellContent(grid, rowIndex, colIndex).textContent)).to.eql(expected);
    }

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 400px; height: 200px;" multi-sort>
          <vaadin-grid-sort-column path="first" direction="desc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="second" direction="asc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="third" direction="desc"></vaadin-grid-sort-column>
        </vaadin-grid>
      `);
      await nextFrame();

      columns = [...grid.querySelectorAll('vaadin-grid-sort-column')];
      sorters = columns.map((_, colIndex) =>
        getHeaderCellContent(grid, 0, colIndex).querySelector('vaadin-grid-sorter'),
      );

      grid.items = [
        { first: '1', second: '2', third: '3' },
        { first: '2', second: '3', third: '1' },
        { first: '3', second: '1', third: '2' },
      ];

      flushGrid(grid);
    });

    it('should preserve sorters order when grid is re-attached', () => {
      click(sorters[1]);
      const parentNode = grid.parentNode;
      parentNode.removeChild(grid);
      parentNode.appendChild(grid);

      expect(sorters.map((sorter) => sorter._order)).to.eql([2, 0, 1]);
    });

    it('should remove sorter reference when removing a column', () => {
      grid.removeChild(columns[0]);
      flushGrid(grid);
      expect(grid._sorters).to.not.contain(sorters[0]);
    });

    it('should exclude removed column from sorting', () => {
      grid.removeChild(columns[2]);
      flushGrid(grid);
      assertColumnCellOrder(columns[1], ['1', '2', '3']);
    });

    it('should update sorters order when removing a column', () => {
      grid.removeChild(columns[2]);
      flushGrid(grid);
      expect(sorters.map((sorter) => sorter._order)).to.eql([1, 0, 0]);
    });

    it('should not sort items before grid is re-attached', () => {
      const parentNode = grid.parentNode;
      parentNode.removeChild(grid);

      grid.removeChild(columns[2]);
      flushGrid(grid);
      // The items should still be sorted by the 3rd column in desc order.
      assertColumnCellOrder(columns[0], ['1', '3', '2']);

      parentNode.appendChild(grid);
      flushGrid(grid);
      // The items should be sorted by the 2nd column in asc order.
      assertColumnCellOrder(columns[1], ['1', '2', '3']);
    });

    it('should exclude column from sorting when hidden', async () => {
      columns[2].hidden = true;
      await nextFrame();

      // The items should be sorted by the 2nd column in asc order.
      assertColumnCellOrder(columns[1], ['1', '2', '3']);
    });

    it('should include column in sorting when shown again', async () => {
      columns[2].hidden = true;
      await nextFrame();
      columns[2].hidden = false;
      await nextFrame();

      // The items should be sorted by the 3rd column in desc order.
      assertColumnCellOrder(columns[2], ['3', '2', '1']);
    });

    it('should include shown column in sorting if its direction was changed', async () => {
      columns[2].hidden = true;
      await nextFrame();
      columns[2].direction = 'asc';
      columns[2].hidden = false;
      await nextFrame();

      // The items should be sorted by the 3rd column in asc order.
      assertColumnCellOrder(columns[2], ['1', '2', '3']);
    });

    it('should not include shown column in sorting if its direction was reset', async () => {
      columns[2].hidden = true;
      await nextFrame();
      columns[2].direction = null;
      columns[2].hidden = false;
      await nextFrame();

      // The items should be sorted by the 2nd column in asc order.
      assertColumnCellOrder(columns[1], ['1', '2', '3']);
    });

    it('should update sorters order when a column gets hidden', async () => {
      columns[2].hidden = true;
      await nextFrame();
      expect(sorters.map((sorter) => sorter._order)).to.eql([1, 0, null]);
    });

    it('should update sorters order when a column gets shown again', async () => {
      columns[2].hidden = true;
      await nextFrame();
      columns[2].hidden = false;
      await nextFrame();
      expect(sorters.map((sorter) => sorter._order)).to.eql([2, 1, 0]);
    });
  });

  describe('grid', () => {
    let grid, columns, sorters;

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 200px;" multi-sort>
          <vaadin-grid-column path="first"></vaadin-grid-column>
          <vaadin-grid-column path="last"></vaadin-grid-column>
          <vaadin-grid-sort-column></vaadin-grid-sort-column>
        </vaadin-grid>
      `);
      columns = [...grid.querySelectorAll('vaadin-grid-column')];
      columns[0].headerRenderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = `
            <vaadin-grid-sorter path="first" direction="asc">
              <span class="title">first</span>
            </vaadin-grid-sorter>
          `;
        }
      };
      columns[1].headerRenderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = `
            <vaadin-grid-sorter path="last" direction="desc">
              <span class="title">last</span>
            </vaadin-grid-sorter>
          `;
        }
      };
      await nextFrame();

      sorters = columns.map((_, colIndex) =>
        getHeaderCellContent(grid, 0, colIndex).querySelector('vaadin-grid-sorter'),
      );

      grid.items = [
        { first: 'foo', last: 'bar' },
        { first: 'foo', last: 'baz' },
        { first: 'bar', last: 'bar' },
      ];

      flushGrid(grid);
    });

    it('should ignore sorter', () => {
      sorters[0].direction = '';
      const sortOrders = grid._mapSorters();
      expect(sortOrders).to.have.length(1);
      expect(sortOrders[0].path).to.equal('last');
      expect(sortOrders[0].direction).to.equal('desc');
    });

    it('should show order indicators', () => {
      expect(sorters[0]._order).to.equal(1);
      expect(sorters[1]._order).to.equal(0);
    });

    it('should not show order indicators for one sorter', () => {
      sorters[1].direction = '';
      expect(sorters[0]._order).to.equal(null);
      expect(sorters[1]._order).to.equal(null);
    });

    it('should not show order indicators', () => {
      sorters[0].direction = null;
      sorters[1].direction = null;
      expect(sorters[0]._order).to.equal(null);
      expect(sorters[1]._order).to.equal(null);
    });

    describe('multiSortOnShiftClick', () => {
      beforeEach(() => {
        grid.multiSort = false;
        grid.multiSortOnShiftClick = true;
      });

      it('should add to sort on shift-click', () => {
        sorters[1].direction = null;
        sorters[0].direction = null;
        shiftClick(sorters[1]);
        shiftClick(sorters[0]);
        expect(sorters[0]._order).to.equal(0);
        expect(sorters[1]._order).to.equal(1);
      });

      it('should add to sort on Shift+Space', () => {
        sorters[0].direction = null;
        sorters[1].direction = null;
        const lastCell = getContainerCell(grid.$.header, 0, 1);
        const firstCell = getContainerCell(grid.$.header, 0, 0);
        keyUpOn(lastCell, 32, 'shift', ' ');
        keyUpOn(firstCell, 32, 'shift', ' ');
        expect(sorters[0]._order).to.equal(0);
        expect(sorters[1]._order).to.equal(1);
      });

      it('should single-sort on shift-click if multi-sort-on-shift-click not enabled', () => {
        grid.multiSortOnShiftClick = false;
        sorters[1].direction = null;
        sorters[0].direction = null;
        shiftClick(sorters[1]);
        shiftClick(sorters[0]);
        expect(sorters[1]._order).to.equal(null);
        expect(sorters[0]._order).to.equal(null);
        expect(sorters[1].direction).to.equal(null);
        expect(sorters[0].direction).to.equal('asc');
      });

      it('should clear multi-sort on regular click', () => {
        click(sorters[1]);
        expect(sorters[0].direction).to.be.null;
        expect(sorters[1].direction).to.be.null;
        expect(sorters[0]._order).to.equal(null);
        expect(sorters[1]._order).to.equal(null);
      });

      it('should clear multi-sort on regular click when multi-sort enabled', () => {
        grid.multiSort = true;
        click(sorters[1]);
        expect(sorters[0].direction).to.be.null;
        expect(sorters[1].direction).to.be.null;
        expect(sorters[0]._order).to.equal(null);
        expect(sorters[1]._order).to.equal(null);
      });

      it('should add to active sorters on regular click if sorter has direction', () => {
        click(sorters[0]);
        expect(grid._sorters.length).to.equal(1);
      });

      it('should not add to active sorters on regular click if sorter has no direction', () => {
        click(sorters[1]);
        expect(grid._sorters).to.be.empty;
      });

      it('should add to sorters if multi-sort is enabled and sorting is done programatically', () => {
        grid.multiSort = true;
        sorters[0].direction = 'desc';
        sorters[1].direction = 'asc';
        expect(sorters[0]._order).to.equal(1);
        expect(sorters[0].direction).to.equal('desc');
        expect(sorters[1]._order).to.equal(0);
        expect(sorters[1].direction).to.equal('asc');
        expect(grid._sorters).to.have.lengthOf(2);
      });

      it('programmatically multi-sorting should be possible after user interacts with the sorters when multi-sort enabled', () => {
        grid.multiSort = true;
        click(sorters[0]);
        click(sorters[1]);
        sorters[0].direction = 'asc';

        expect(sorters[0].direction).to.equal('asc');
        expect(sorters[1].direction).to.equal('asc');
        expect(grid._sorters).to.have.lengthOf(2);
      });

      it('should not multi-sort when programmatically sorting after shift-click', () => {
        sorters[0].direction = null;
        sorters[1].direction = null;
        shiftClick(sorters[0]);
        shiftClick(sorters[1]);
        expect(grid._sorters).to.have.lengthOf(2);
        sorters[0].direction = 'desc';

        expect(sorters[0].direction).to.equal('desc');
        expect(sorters[1].direction).to.be.null;
        expect(grid._sorters).to.have.lengthOf(1);
      });
    });

    describe('array data provider', () => {
      it('should sort automatically', () => {
        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('foo');

        expect(getBodyCellContent(grid, 0, 1).innerText).to.equal('baz');
        expect(getBodyCellContent(grid, 1, 1).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 2, 1).innerText).to.equal('bar');
      });

      it('should sort automatically on sort', () => {
        sorters[0].direction = null;
        flushGrid(grid);
        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('bar');
      });

      it('should not sort the items if sorter directions are not defined', () => {
        sorters[0].direction = null;
        sorters[1].direction = null;
        grid.items = buildDataSet(100);
        const bodyRows = getRows(grid.$.items);
        expect(grid.__getRowModel(bodyRows[0]).item).to.equal(grid.items[0]);
      });

      it('should sort empty values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: '', last: '' },
          { first: 'bar', last: 'bar' },
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('');
      });

      it('should sort null values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: null, last: null },
          { first: 'bar', last: 'bar' },
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('');
      });

      it('should sort undefined values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: undefined, last: undefined },
          { first: 'bar', last: 'bar' },
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('');
      });

      it('should sort NaN values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: NaN, last: NaN },
          { first: 'bar', last: 'bar' },
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('NaN');
      });

      it('should sort numbers correctly', () => {
        grid.items = [{ first: 1 }, { first: 2 }, { first: 11 }];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('1');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('2');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('11');
      });

      it('should sort dates correctly', () => {
        grid.items = [
          { first: 1, last: new Date(2000, 1, 2) },
          { first: 2, last: new Date(2000, 1, 3) },
          { first: 3, last: new Date(2000, 1, 1) },
        ];

        sorters[0].direction = '';
        sorters[1].direction = 'asc';

        flushGrid(grid);
        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('3');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('1');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('2');
      });

      it('should invoke data provider only once when removing a column with sorter', () => {
        const spy = sinon.spy(grid.dataProvider);
        grid._arrayDataProvider = spy;
        grid.dataProvider = spy;
        spy.resetHistory();

        grid.removeChild(columns[0]);
        flushGrid(grid);

        expect(spy).to.be.calledOnce;
      });
    });

    describe('data provider', () => {
      beforeEach(() => {
        grid.dataProvider = sinon.spy(grid.dataProvider);
        grid.clearCache();
      });

      it('should request with default sorting', () => {
        const lastCall = grid.dataProvider.lastCall;
        const params = lastCall.args[0];
        expect(params.sortOrders).to.eql([
          { path: 'last', direction: 'desc' },
          { path: 'first', direction: 'asc' },
        ]);
      });

      it('should request new data on sort', () => {
        sorters[0].direction = 'desc';
        flushGrid(grid);
        const lastCall = grid.dataProvider.lastCall;
        const params = lastCall.args[0];
        expect(params.sortOrders).to.eql([
          { path: 'first', direction: 'desc' },
          { path: 'last', direction: 'desc' },
        ]);
      });

      it('should request new data on change in existing sorters', () => {
        grid.dataProvider.resetHistory();
        sorters[1].direction = 'asc';
        flushGrid(grid);
        expect(grid.dataProvider.called).to.be.true;
      });

      it('should request new data when showing a column whose direction was changed', async () => {
        columns[0].hidden = true;
        await nextFrame();
        grid.dataProvider.resetHistory();
        sorters[0].direction = 'desc';
        columns[0].hidden = false;
        await nextFrame();
        expect(grid.dataProvider.calledOnce).to.be.true;
      });

      it('should not request new data when showing a column whose direction was reset', async () => {
        columns[0].hidden = true;
        await nextFrame();
        grid.dataProvider.resetHistory();
        sorters[0].direction = null;
        columns[0].hidden = false;
        await nextFrame();
        expect(grid.dataProvider.called).to.be.false;
      });
    });

    describe('multi-sort-priority="append"', () => {
      beforeEach(() => {
        grid.multiSortPriority = 'append';
      });

      it('should append sort order when setting sort direction', () => {
        sorters[1].direction = null;

        sorters[1].direction = 'asc';
        expect(sorters[0]._order).to.equal(0);
        expect(sorters[1]._order).to.equal(1);
      });

      it('should retain sort order when changing sort direction', () => {
        sorters[0].direction = 'desc';
        expect(sorters[0]._order).to.equal(1);
        expect(sorters[1]._order).to.equal(0);
      });

      it('should remove sorter when clearing sort direction', () => {
        sorters[1].direction = null;

        const sortOrders = grid._mapSorters();
        expect(sortOrders).to.have.length(1);
        expect(sortOrders[0].path).to.equal('first');
        expect(sortOrders[0].direction).to.equal('asc');
      });

      it('should update order when clearing sort direction', () => {
        sorters[1].direction = null;

        expect(sorters[0]._order).to.be.null;
      });
    });

    describe('set multi-sort-priority', () => {
      it('should change default multi-sort-priority for newly created grid', () => {
        const grid1 = fixtureSync('<vaadin-grid></vaadin-grid>');
        expect(grid1.multiSortPriority).to.be.equal('prepend');

        Grid.setDefaultMultiSortPriority('append');

        const grid2 = fixtureSync('<vaadin-grid></vaadin-grid>');
        expect(grid1.multiSortPriority).to.be.equal('prepend');
        expect(grid2.multiSortPriority).to.be.equal('append');

        Grid.setDefaultMultiSortPriority('prepend');

        const grid3 = fixtureSync('<vaadin-grid></vaadin-grid>');
        expect(grid2.multiSortPriority).to.be.equal('append');
        expect(grid3.multiSortPriority).to.be.equal('prepend');
      });

      it('should not change default multi-sort-priority with incorrect value', () => {
        const grid1 = fixtureSync('<vaadin-grid></vaadin-grid>');
        expect(grid1.multiSortPriority).to.be.equal('prepend');

        Grid.setDefaultMultiSortPriority(null);

        const grid2 = fixtureSync('<vaadin-grid></vaadin-grid>');
        expect(grid2.multiSortPriority).to.be.equal('prepend');
      });
    });

    describe('single column sorting', () => {
      beforeEach(() => {
        grid.multiSort = false;
        grid.dataProvider = sinon.spy(grid.dataProvider);
      });

      it('should only using single sorter', () => {
        grid.dataProvider.resetHistory();
        sorters[0].direction = 'desc';

        flushGrid(grid);
        expect(grid.dataProvider.args[0][0].sortOrders.length).to.eql(1);
      });

      it('should remove order from sorters', () => {
        // Initial order before multiSort was set
        expect(sorters[1]._order).to.eql(0);
        expect(sorters[0]._order).to.eql(1);

        sorters[0].direction = 'desc';

        expect(sorters[0]._order).to.be.null;
        expect(sorters[1]._order).to.be.null;
      });

      it('should remove direction from previous sorter', () => {
        sorters[0].direction = 'desc';

        sorters[1].direction = 'desc';

        expect(sorters[0].direction).to.be.null;
        expect(sorters[1].direction).to.eql('desc');
      });
    });

    describe('accessibility', () => {
      function getSorterCell(sorter) {
        return sorter.parentNode.assignedSlot.parentNode;
      }

      it('should set aria-sort on cells', () => {
        expect(getSorterCell(sorters[0]).getAttribute('aria-sort')).to.equal('ascending');
        expect(getSorterCell(sorters[1]).getAttribute('aria-sort')).to.equal('descending');
      });

      it('should update aria-sort on sorter change', () => {
        sorters[0].direction = 'desc';
        sorters[1].direction = null;

        flushGrid(grid);
        expect(getSorterCell(sorters[0]).getAttribute('aria-sort')).to.equal('descending');
        expect(getSorterCell(sorters[1]).getAttribute('aria-sort')).to.equal('none');
      });
    });

    describe('sort-column', () => {
      let sortColumn, sortCellContent, sorter;

      beforeEach(() => {
        sortColumn = grid.querySelector('vaadin-grid-sort-column');
        sortCellContent = getHeaderCellContent(grid, 0, 2);
        sorter = sortCellContent.querySelector('vaadin-grid-sorter');
      });

      it('should propagate path property to the internal grid sorter', () => {
        sortColumn.path = 'last';
        expect(sorter.path).to.equal('last');
      });

      it('should propagate direction property to the internal grid sorter', () => {
        sortColumn.direction = 'asc';
        expect(sorter.direction).to.equal('asc');
      });

      it('should fire direction-changed when changing the internal grid sorter direction', () => {
        const spy = sinon.spy();
        sortColumn.addEventListener('direction-changed', spy);

        sorter.direction = 'desc';

        const event = spy.args[0][0];
        expect(spy.calledOnce).to.be.true;
        expect(event.detail.value).to.be.equal('desc');
      });

      it('should use header property to determine the text that gets slotted inside the sorter', () => {
        sortColumn.header = 'Last column';
        expect(sorter.textContent).to.equal('Last column');
      });

      it('should generate the text content based on path property, if header is not defined', () => {
        sortColumn.path = 'last';
        expect(sorter.textContent).to.equal('Last');
      });

      it('should ignore a custom header renderer', () => {
        sortColumn.headerRenderer = (root) => {
          root.innerHTML = 'header';
        };

        expect(sortCellContent.firstElementChild).to.equal(sorter);
      });
    });
  });

  describe('multiple sorters', () => {
    let grid;

    beforeEach(() => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 200px;">
          <vaadin-grid-column path="first"></vaadin-grid-column>
          <vaadin-grid-column path="last"></vaadin-grid-column>
        </vaadin-grid>
      `);
      const columns = grid.querySelectorAll('vaadin-grid-column');
      columns[0].headerRenderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = `
            <vaadin-grid-sorter path="first" direction="asc">
              <span class="title">first</span>
            </vaadin-grid-sorter>
          `;
        }
      };
      columns[1].headerRenderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = `
            <span class="title">last</span>
            <vaadin-grid-sorter path="last"></vaadin-grid-sorter>
          `;
        }
      };
      flushGrid(grid);
    });

    it('should set direction to also other than last sorter', () => {
      const sorterFirst = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-grid-sorter');
      expect(sorterFirst.direction).to.eql('asc');
    });
  });

  describe('detached sorter', () => {
    let grid, firstNameColumn, firstNameSorter;

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 200px;" multi-sort>
          <vaadin-grid-column path="first"></vaadin-grid-column>
          <vaadin-grid-column path="last"></vaadin-grid-column>
        </vaadin-grid>
      `);
      firstNameColumn = grid.querySelector('vaadin-grid-column');
      firstNameColumn.headerRenderer = (root) => {
        if (!root.firstChild) {
          root.innerHTML = '<vaadin-grid-sorter path="first">First name</vaadin-grid-sorter>';
        }
      };
      grid.items = [{ first: 'John', last: 'Doe' }];
      flushGrid(grid);
      await nextFrame();
      firstNameSorter = grid.querySelector('vaadin-grid-sorter');
    });

    it('should remove detached sorter with no parent', () => {
      firstNameSorter.click();

      firstNameColumn.headerRenderer = (root) => {
        root.innerHTML = '<vaadin-grid-sorter path="first">1st</vaadin-grid-sorter>';
      };
      grid.requestContentUpdate();

      expect(grid._sorters).to.not.contain(firstNameSorter);
    });

    it('should not remove sorter for hidden column', async () => {
      firstNameSorter.click();
      firstNameColumn.setAttribute('hidden', '');
      await nextFrame();

      firstNameColumn.removeAttribute('hidden');
      await nextFrame();

      expect(grid._sorters).to.contain(firstNameSorter);
    });
  });
});
