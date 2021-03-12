import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import { click, flushGrid, getCellContent, getRows, getRowCells } from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-filter.js';
import '../vaadin-grid-sorter.js';

describe('array data provider', () => {
  let grid, body;

  function getContent(row, column) {
    return getCellContent(getCell(row, column)).innerText;
  }

  function getCell(row, column) {
    return getRowCells(getRows(body)[row])[column];
  }

  describe('with items', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column>
            <template class="header">First</template>
            <template>[[item.name.first]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">Last</template>
            <template>[[item.name.last]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      grid.items = [
        {
          name: {
            first: 'foo',
            last: 'bar'
          }
        },
        {
          name: {
            first: 'baz',
            last: 'qux'
          }
        }
      ];
      flushGrid(grid);
      body = grid.$.items;
      await nextFrame();
    });

    it('should have right amount of data', () => {
      const bodyRows = getRows(body);
      expect(bodyRows).to.have.length(2);
    });

    it('should have the right data', () => {
      expect(getContent(0, 0)).to.equal('foo');
      expect(getContent(1, 0)).to.equal('baz');
    });

    it('should be observed for shift', () => {
      grid.unshift('items', {
        name: {
          first: 'a',
          last: 'b'
        }
      });
      expect(grid.size).to.equal(3);
      expect(getContent(0, 0)).to.equal('a');
    });

    it('should be observed for mutation', () => {
      grid.set('items.0.name.first', 'new');
      expect(getContent(0, 0)).to.equal('new');
    });

    it('should handle null', () => {
      grid.items = null;
      expect(grid.size).to.equal(0);
    });

    it('should set array data provider', () => {
      expect(grid.dataProvider).to.equal(grid._arrayDataProvider);
    });

    it('should not override custom data provider', () => {
      const ds = (grid.dataProvider = () => {});
      grid.items = [1, 2, 3];
      expect(grid.dataProvider).to.equal(ds);
    });

    it('should handle new array of same length', () => {
      grid.items = [
        {
          name: {
            first: 'a'
          }
        },
        {
          name: {
            first: 'b'
          }
        }
      ];
      expect(getContent(0, 0)).to.equal('a');
    });
  });

  describe('without items', () => {
    beforeEach(async () => {
      grid = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column>
            <template class="header">First</template>
            <template>[[item.name.first]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column>
            <template class="header">Last</template>
            <template>[[item.name.last]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
      `);
      flushGrid(grid);
      await nextFrame();
    });

    it('should work after initialized with empty items', () => {
      grid.items = [];
      grid.items = [0];
      flushGrid(grid);
      expect(getRows(grid.$.items)).to.have.length(1);
    });
  });
});

describe('invalid paths', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-sorter>
              Sorter with invalid path
            </vaadin-grid-sorter>
          </template>
          <template>[[item.name.first]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
          <template class="header">
            <vaadin-grid-filter value="foo">
            </vaadin-grid-filter>
          </template>
          <template>[[item.name.last]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);

    grid.items = [
      {
        name: {
          first: 'foo',
          last: 'bar'
        }
      }
    ];
    flushGrid(grid);
  });

  beforeEach(() => {
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.warn.restore();
  });

  describe('invalid sorters paths', () => {
    let sorter;

    beforeEach(() => {
      sorter = grid.querySelector('vaadin-grid-sorter');
    });

    it('should warn about invalid path with undefined parent property', () => {
      sorter.path = 'foo.bar';
      click(sorter);
      expect(console.warn.called).to.be.true;
    });

    it('should not warn about undefined values with defined parent property', () => {
      sorter.path = 'name.foo';
      click(sorter);
      expect(console.warn.called).to.be.false;
    });

    it('should not warn about invalid path without dots', () => {
      sorter.path = 'foobar';
      click(sorter);
      expect(console.warn.called).to.be.false;
    });

    it('should not warn about undefined values with defined parent property (long path)', () => {
      grid.items = [
        {
          name: {
            last: {
              foo: 'foo'
            }
          }
        }
      ];

      sorter.path = 'name.last.foo';
      click(sorter);
      expect(console.warn.called).to.be.false;
    });
  });

  describe('invalid filters paths', () => {
    let filter;

    beforeEach(() => {
      filter = grid.querySelector('vaadin-grid-filter');
      filter.path = '';
      filter._debouncerFilterChanged.flush();
    });

    it('should warn about invalid path with undefined parent property', () => {
      filter.path = 'foo.bar';
      filter._debouncerFilterChanged.flush();
      expect(console.warn.called).to.be.true;
    });

    it('should not warn about undefined values with defined parent property', () => {
      filter.path = 'name.foo';
      filter._debouncerFilterChanged.flush();
      expect(console.warn.called).to.be.false;
    });

    it('should not warn about invalid path without dots', () => {
      filter.path = 'foobar';
      filter._debouncerFilterChanged.flush();
      expect(console.warn.called).to.be.false;
    });
  });
});
