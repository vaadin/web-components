import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, getContainerCell, getRows, infiniteDataProvider, scrollToEnd } from './helpers.js';
import '../vaadin-grid.js';

describe('class name generator', () => {
  let grid, firstCell, initialCellClasses;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid size="200">
        <vaadin-grid-column path="value" header="col0"></vaadin-grid-column>
        <vaadin-grid-column path="value" header="col1"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);

    firstCell = getContainerCell(grid.$.items, 0, 0);

    // Polyfills may add some extra classes to cells
    initialCellClasses = Array.from(firstCell.classList);
  });

  const assertClassList = (cell, expectedClasses) =>
    expect(Array.from(cell.classList)).to.deep.equal(initialCellClasses.concat(expectedClasses));

  it('should add classes for cells', () => {
    grid.cellClassNameGenerator = () => 'foo';
    assertClassList(firstCell, ['foo']);
    assertClassList(getContainerCell(grid.$.items, 1, 1), ['foo']);
  });

  it('should add all classes separated by whitespaces', () => {
    grid.cellClassNameGenerator = () => 'foo bar baz';
    assertClassList(firstCell, ['foo', 'bar', 'baz']);
  });

  it('should not remove existing classes', () => {
    firstCell.classList.add('bar');
    grid.cellClassNameGenerator = () => 'foo';
    assertClassList(firstCell, ['bar', 'foo']);
  });

  it('should remove old generated classes', () => {
    grid.cellClassNameGenerator = () => 'foo';
    grid.cellClassNameGenerator = () => 'bar';
    assertClassList(firstCell, ['bar']);
  });

  it('should provide column and model as parameters', () => {
    grid.cellClassNameGenerator = (column, model) => model.index + ' ' + model.item.value + ' ' + column.header;
    assertClassList(getContainerCell(grid.$.items, 5, 1), ['5', 'foo5', 'col1']);
    assertClassList(getContainerCell(grid.$.items, 10, 0), ['10', 'foo10', 'col0']);
  });

  it('should be called for details cell with undefined column', (done) => {
    grid.rowDetailsRenderer = () => {};
    grid.cellClassNameGenerator = (column, model) => model.index + ' ' + column;
    requestAnimationFrame(() => {
      assertClassList(getContainerCell(grid.$.items, 0, 2), ['0', 'undefined']);
      done();
    });
  });

  it('should add classes when loading new items', function (done) {
    grid.cellClassNameGenerator = (column, model) => model.item.value;
    scrollToEnd(grid, () => {
      const rows = getRows(grid.$.items);
      const lastRow = rows[rows.length - 1];
      const cell = lastRow.firstElementChild;
      assertClassList(cell, ['foo199']);
      done();
    });
  });

  it('should not throw with falsy return value', () => {
    expect(() => (grid.cellClassNameGenerator = () => {})).not.to.throw(Error);
  });

  it('should clear generated classes with falsy return value', () => {
    grid.cellClassNameGenerator = () => 'foo';
    grid.cellClassNameGenerator = () => {};
    assertClassList(firstCell, []);
  });

  it('should clear generated classes with falsy property value', () => {
    grid.cellClassNameGenerator = () => 'foo';
    grid.cellClassNameGenerator = undefined;
    assertClassList(firstCell, []);
  });

  ['generateCellClassNames', 'clearCache', 'render'].forEach((funcName) => {
    it(`should update classes on ${funcName}`, () => {
      let condition = false;
      grid.cellClassNameGenerator = () => condition && 'foo';
      condition = true;
      assertClassList(firstCell, []);
      grid[funcName]();
      assertClassList(firstCell, ['foo']);
    });
  });

  it('should not run generator for hidden rows', () => {
    grid.items = [];
    expect(grid.$.items.firstElementChild).to.have.property('hidden', true);

    const spy = sinon.spy();
    grid.cellClassNameGenerator = spy;
    expect(spy.called).to.be.false;
  });

  it('should not throw with extra whitespace in the result', () => {
    expect(() => (grid.cellClassNameGenerator = () => ' foo  bar ')).not.to.throw(Error);
    assertClassList(firstCell, ['foo', 'bar']);
  });
});
