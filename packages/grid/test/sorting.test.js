import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { click, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-template-renderer';
import { buildDataSet, flushGrid, getBodyCellContent, getHeaderCellContent, getRows, getRowCells } from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-sorter.js';
import '../vaadin-grid-sort-column.js';

describe('sorting', () => {
  describe('sorter', () => {
    let sorter, button, orderIndicator;

    beforeEach(() => {
      sorter = fixtureSync(`
        <vaadin-grid-sorter path="path">
          <span class="title">title</span><button>Button</button>
        </vaadin-grid-sorter>
      `);
      button = sorter.querySelector('button');
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

    it('should fire a sorter-changed event', () => {
      const spy = sinon.spy();
      sorter.addEventListener('sorter-changed', spy);

      sorter.direction = 'asc';

      expect(spy.calledOnce).to.be.true;
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
    let grid, sorterFirst, sorterSecond, sorterThird, columnFirst, columnThird;

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 400px; height: 200px;" multi-sort>
          <vaadin-grid-sort-column path="first" direction="desc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="second" direction="asc"></vaadin-grid-sort-column>
          <vaadin-grid-sort-column path="third" direction="desc"></vaadin-grid-sort-column>
        </vaadin-grid>
      `);
      await nextFrame();

      // TODO: find better way to select
      columnFirst = grid.querySelectorAll('vaadin-grid-sort-column')[0];
      columnThird = grid.querySelectorAll('vaadin-grid-sort-column')[2];

      sorterFirst = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-grid-sorter');
      sorterSecond = getHeaderCellContent(grid, 0, 1).querySelector('vaadin-grid-sorter');
      sorterThird = getHeaderCellContent(grid, 0, 2).querySelector('vaadin-grid-sorter');

      grid.items = [
        { first: '1', second: '2', third: '3' },
        { first: '2', second: '3', third: '1' },
        { first: '3', second: '1', third: '2' }
      ];

      flushGrid(grid);
    });

    it('should preserve sort order for sorters when grid is re-attached', () => {
      click(sorterSecond);
      const parentNode = grid.parentNode;
      parentNode.removeChild(grid);
      parentNode.appendChild(grid);

      expect(sorterFirst._order).to.equal(2);
      expect(sorterSecond._order).to.equal(0);
      expect(sorterThird._order).to.equal(1);
    });

    it('should not keep references to sorters when column is removed', () => {
      grid.removeChild(columnFirst);
      flushGrid(grid);
      expect(grid._sorters).to.not.contain(sorterFirst);
    });

    it('should update sorting when column is removed', () => {
      grid.removeChild(columnThird);
      flushGrid(grid);

      expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('3');
      expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('1');
      expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('2');

      expect(getBodyCellContent(grid, 0, 1).innerText).to.equal('1');
      expect(getBodyCellContent(grid, 1, 1).innerText).to.equal('2');
      expect(getBodyCellContent(grid, 2, 1).innerText).to.equal('3');
    });

    it('should update sort order when column removed and grid is not attached', () => {
      const parentNode = grid.parentNode;
      parentNode.removeChild(grid);

      grid.removeChild(columnThird);
      flushGrid(grid);
      expect(sorterFirst._order).to.equal(1);
      expect(sorterSecond._order).to.equal(0);
    });

    it('should not sort items before grid is re-attached', () => {
      const parentNode = grid.parentNode;
      parentNode.removeChild(grid);

      grid.removeChild(columnThird);
      flushGrid(grid);
      expect(getBodyCellContent(grid, 0, 1).innerText).to.equal('2');

      parentNode.appendChild(grid);
      flushGrid(grid);
      expect(getBodyCellContent(grid, 0, 1).innerText).to.equal('1');
    });
  });

  describe('grid', () => {
    let grid, sorterFirst, sorterLast;

    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 200px;" multi-sort>
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="first" direction="asc">
                <span class="title">first</span>
              </vaadin-grid-sorter>
            </template>
            <template>[[item.first]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <span class="title">last</span>
              <vaadin-grid-sorter path="last" direction="desc">
              </vaadin-grid-sorter>
            </template>
            <template>[[item.last]]</template>
          </vaadin-grid-column>
          <vaadin-grid-sort-column></vaadin-grid-sort-column>
        </vaadin-grid>
      `);
      await nextFrame();
      sorterFirst = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-grid-sorter');
      sorterLast = getHeaderCellContent(grid, 0, 1).querySelector('vaadin-grid-sorter');

      grid.items = [
        { first: 'foo', last: 'bar' },
        { first: 'foo', last: 'baz' },
        { first: 'bar', last: 'bar' }
      ];

      flushGrid(grid);
    });

    it('should ignore sorter', () => {
      sorterFirst.direction = '';
      const sortOrders = grid._mapSorters();
      expect(sortOrders).to.have.length(1);
      expect(sortOrders[0].path).to.equal('last');
      expect(sortOrders[0].direction).to.equal('desc');
    });

    it('should show order indicators', () => {
      expect(sorterFirst._order).to.equal(1);
      expect(sorterLast._order).to.equal(0);
    });

    it('should not show order indicators for one sorter', () => {
      sorterLast.direction = '';
      expect(sorterFirst._order).to.equal(null);
      expect(sorterLast._order).to.equal(null);
    });

    it('should not show order indicators', () => {
      sorterFirst.direction = null;
      sorterLast.direction = null;
      expect(sorterFirst._order).to.equal(null);
      expect(sorterLast._order).to.equal(null);
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
        sorterFirst.direction = null;
        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('bar');
      });

      it('should not sort the items if sorter directions are not defined', () => {
        sorterFirst.direction = null;
        sorterLast.direction = null;
        grid.items = buildDataSet(100);
        const bodyRows = getRows(grid.$.items);
        const cells = getRowCells(bodyRows[0]);
        expect(cells[0]._content.__templateInstance.item).to.equal(grid.items[0]);
      });

      it('should sort empty values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: '', last: '' },
          { first: 'bar', last: 'bar' }
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('');
      });

      it('should sort null values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: null, last: null },
          { first: 'bar', last: 'bar' }
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('');
      });

      it('should sort undefined values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: undefined, last: undefined },
          { first: 'bar', last: 'bar' }
        ];

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('bar');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('foo');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('');
      });

      it('should sort NaN values', () => {
        grid.items = [
          { first: 'foo', last: 'bar' },
          { first: NaN, last: NaN },
          { first: 'bar', last: 'bar' }
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
          { first: 3, last: new Date(2000, 1, 1) }
        ];

        sorterFirst.direction = '';
        sorterLast.direction = 'asc';

        expect(getBodyCellContent(grid, 0, 0).innerText).to.equal('3');
        expect(getBodyCellContent(grid, 1, 0).innerText).to.equal('1');
        expect(getBodyCellContent(grid, 2, 0).innerText).to.equal('2');
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
          { path: 'first', direction: 'asc' }
        ]);
      });

      it('should request new data on sort', () => {
        sorterFirst.direction = 'desc';
        const lastCall = grid.dataProvider.lastCall;
        const params = lastCall.args[0];
        expect(params.sortOrders).to.eql([
          { path: 'first', direction: 'desc' },
          { path: 'last', direction: 'desc' }
        ]);
      });

      it('should request new data on change in existing sorters', () => {
        grid.dataProvider.resetHistory();
        sorterLast.direction = 'asc';
        expect(grid.dataProvider.called).to.be.true;
      });
    });

    describe('single column sorting', () => {
      beforeEach(() => {
        grid.multiSort = false;
        grid.dataProvider = sinon.spy(grid.dataProvider);
      });

      it('should only using single sorter', () => {
        grid.dataProvider.resetHistory();
        sorterFirst.direction = 'desc';

        expect(grid.dataProvider.args[0][0].sortOrders.length).to.eql(1);
      });

      it('should remove order from sorters', () => {
        // initial order before multiSort was set
        expect(sorterLast._order).to.eql(0);
        expect(sorterFirst._order).to.eql(1);

        sorterFirst.direction = 'desc';

        expect(sorterFirst._order).to.be.null;
        expect(sorterLast._order).to.be.null;
      });

      it('should remove direction from previous sorter', () => {
        sorterFirst.direction = 'desc';

        sorterLast.direction = 'desc';

        expect(sorterFirst.direction).to.be.null;
        expect(sorterLast.direction).to.eql('desc');
      });
    });

    describe('accessibility', () => {
      function getSorterCell(sorter) {
        return sorter.parentNode.assignedSlot.parentNode;
      }

      it('should set aria-sort on cells', () => {
        expect(getSorterCell(sorterFirst).getAttribute('aria-sort')).to.equal('ascending');
        expect(getSorterCell(sorterLast).getAttribute('aria-sort')).to.equal('descending');
      });

      it('should update aria-sort on sorter change', () => {
        sorterFirst.direction = 'desc';
        sorterLast.direction = null;

        expect(getSorterCell(sorterFirst).getAttribute('aria-sort')).to.equal('descending');
        expect(getSorterCell(sorterLast).getAttribute('aria-sort')).to.equal('none');
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
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="first" direction="asc">
                <span class="title">first</span>
              </vaadin-grid-sorter>
            </template>
            <template>[[item.first]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">
              <span class="title">last</span>
              <vaadin-grid-sorter path="last">
              </vaadin-grid-sorter>
            </template>
            <template>[[item.last]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      flushGrid(grid);
    });

    it('should set direction to also other than last sorter', () => {
      const sorterFirst = getHeaderCellContent(grid, 0, 0).querySelector('vaadin-grid-sorter');
      expect(sorterFirst.direction).to.eql('asc');
    });
  });
});
