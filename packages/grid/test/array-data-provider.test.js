import { expect } from '@esm-bundle/chai';
import { click, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import '../vaadin-grid-filter.js';
import '../vaadin-grid-sorter.js';
import { flushGrid, getBodyCellContent, getCellContent, getRowCells, getRows } from './helpers.js';

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

    it('should be observed for shift', async () => {
      grid.items = [
        {
          name: {
            first: 'a',
            last: 'b'
          }
        },
        ...grid.items
      ];
      await nextFrame();
      expect(grid.size).to.equal(3);
      expect(getContent(0, 0)).to.equal('a');
    });

    it('should handle null', async () => {
      grid.items = null;
      await nextFrame();
      expect(grid.size).to.equal(0);
      expect(grid.items).to.be.null;
    });

    it('should unset the data provider', () => {
      grid.items = null;
      flushGrid(grid);
      expect(grid.dataProvider).to.be.undefined;
    });

    it('should set array data provider', () => {
      expect(grid.dataProvider).to.equal(grid._arrayDataProvider);
    });

    it('should override custom data provider', async () => {
      const ds = (grid.dataProvider = () => {});
      await nextFrame();
      grid.items = [1, 2, 3];
      await nextFrame();
      expect(grid.dataProvider).not.to.equal(ds);
    });

    it('should handle new array of same length', async () => {
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
      await nextFrame();
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

  beforeEach(async () => {
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
    await nextFrame();
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

    it('should warn about invalid path with undefined parent property', async () => {
      sorter.path = 'foo.bar';
      await nextFrame();
      click(sorter);
      await nextFrame();
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

    beforeEach(async () => {
      filter = grid.querySelector('vaadin-grid-filter');
      filter.path = '';
      await nextFrame();
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

describe('items with a custom data provider', () => {
  let grid;
  const dataProvider = (params, callback) => callback([{ value: 'foo' }], 1);
  const items = [{ value: 'bar' }];

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-column path="value"></vaadin-grid-column>
      </vaadin-grid>
    `);
  });

  it('should use the items array', async () => {
    grid.dataProvider = dataProvider;
    grid.items = items;
    await nextFrame();
    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('bar');
  });

  it('should use the custom data provider', async () => {
    grid.items = items;
    await nextFrame();
    grid.dataProvider = dataProvider;
    await nextFrame();
    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('foo');
    expect(grid.items).to.be.undefined;
  });
});
