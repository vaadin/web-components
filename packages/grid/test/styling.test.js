import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import { flushGrid, getContainerCell, getRows, infiniteDataProvider, scrollToEnd } from './helpers.js';

describe('styling', () => {
  let grid, firstCell;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid size="200">
        <vaadin-grid-column path="value" header="col0"></vaadin-grid-column>
        <vaadin-grid-column path="value" header="col1"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextFrame();
    firstCell = getContainerCell(grid.$.items, 0, 0);
  });

  describe('cell class name generator', () => {
    let initialCellClasses;

    beforeEach(() => {
      initialCellClasses = Array.from(firstCell.classList);
    });

    const assertClassList = (expectedClasses, row = 0, col = 0) => {
      const cell = getContainerCell(grid.$.items, row, col);
      expect(Array.from(cell.classList)).to.deep.equal(initialCellClasses.concat(expectedClasses));
    };

    runStylingTest('classes', 'cellClassNameGenerator', 'generateCellClassNames', assertClassList);
  });

  describe('cell part name generator', () => {
    let initialCellPart;

    beforeEach(() => {
      initialCellPart = firstCell.getAttribute('part');
    });

    const assertPartNames = (expectedParts, row = 0, col = 0) => {
      const cell = getContainerCell(grid.$.items, row, col);
      const actualPart = cell.getAttribute('part');
      const customParts = expectedParts.length ? ` ${expectedParts.join(' ')}` : '';

      if (row === 0 && col === 0) {
        expect(actualPart).to.equal(`${initialCellPart}${customParts}`);
      } else {
        expectedParts.forEach((partName) => {
          expect(actualPart).to.contain(partName);
        });
      }
    };

    runStylingTest('parts', 'cellPartNameGenerator', 'generateCellPartNames', assertPartNames);
  });

  function runStylingTest(entries, generatorFn, requestFn, assertCallback) {
    it(`should add ${entries} for cells`, () => {
      grid[generatorFn] = () => 'foo';
      assertCallback(['foo']);
      assertCallback(['foo'], 1, 1);
    });

    it(`should add all ${entries} separated by whitespaces`, () => {
      grid[generatorFn] = () => 'foo bar baz';
      assertCallback(['foo', 'bar', 'baz']);
    });

    it(`should not remove existing ${entries}`, () => {
      if (entries === 'classes') {
        firstCell.classList.add('bar');
      } else {
        firstCell.setAttribute('part', `${firstCell.getAttribute('part')} bar`);
      }

      grid[generatorFn] = () => 'foo';
      assertCallback(['bar', 'foo']);
    });

    it(`should remove old generated ${entries}`, () => {
      grid[generatorFn] = () => 'foo';
      grid[generatorFn] = () => 'bar';
      assertCallback(['bar']);
    });

    it(`should provide column and model as parameters to ${generatorFn}`, () => {
      grid[generatorFn] = (column, model) => `${model.index} ${model.item.value} ${column.header}`;
      assertCallback(['5', 'foo5', 'col1'], 5, 1);
      assertCallback(['10', 'foo10', 'col0'], 10, 0);
    });

    it(`should call ${generatorFn} for details cell with undefined column`, async () => {
      grid.rowDetailsRenderer = () => {};
      grid[generatorFn] = (column, model) => `${model.index} ${column}`;
      await nextFrame();
      flushGrid(grid);
      assertCallback(['0', 'undefined'], 0, 2);
    });

    it(`should add ${entries} when loading new items`, (done) => {
      grid[generatorFn] = (_, model) => model.item.value;
      scrollToEnd(grid, () => {
        const rows = getRows(grid.$.items);
        assertCallback(['foo199'], rows.length - 1, 0);
        done();
      });
    });

    it(`should not throw when ${generatorFn} returns falsy value`, () => {
      expect(() => {
        grid[generatorFn] = () => {};
      }).not.to.throw(Error);
    });

    it(`should clear generated ${entries} with falsy return value`, () => {
      grid[generatorFn] = () => 'foo';
      grid[generatorFn] = () => {};
      assertCallback([]);
    });

    it(`should clear generated ${entries} with falsy property value`, () => {
      grid[generatorFn] = () => 'foo';
      grid[generatorFn] = undefined;
      assertCallback([]);
    });

    [requestFn, 'clearCache', 'requestContentUpdate'].forEach((funcName) => {
      it(`should update ${entries} on ${funcName}`, () => {
        let condition = false;
        grid[generatorFn] = () => condition && 'foo';
        condition = true;
        assertCallback([]);
        grid[funcName]();
        assertCallback(['foo']);
      });
    });

    it(`should not run ${generatorFn} for hidden rows`, () => {
      grid.items = [];
      expect(grid.$.items.firstElementChild).to.have.property('hidden', true);

      const spy = sinon.spy();
      grid[generatorFn] = spy;
      expect(spy.called).to.be.false;
    });

    it(`should not throw when ${generatorFn} return value contains extra whitespace`, () => {
      expect(() => {
        grid[generatorFn] = () => ' foo  bar ';
      }).not.to.throw(Error);
      assertCallback(['foo', 'bar']);
    });

    it(`should have the right ${entries} after toggling column visibility`, async () => {
      grid[generatorFn] = (_column, { index }) => (index % 2 === 0 ? 'even' : 'odd');
      const column = grid.querySelector('vaadin-grid-column');
      column.hidden = true;
      await nextRender();
      column.hidden = false;
      await nextRender();
      assertCallback(['odd'], 1, 0);
      assertCallback(['odd'], 1, 1);
    });

    describe('async data provider', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers({
          shouldClearNativeTimers: true,
        });

        grid.dataProvider = (params, callback) => {
          setTimeout(() => infiniteDataProvider(params, callback), 10);
        };
      });

      afterEach(() => {
        clock.restore();
      });

      it(`should only run ${generatorFn} for the rows that are loaded`, () => {
        const spy = sinon.spy();
        grid[generatorFn] = spy;
        spy.resetHistory();

        grid[requestFn]();
        expect(spy.called).to.be.false;

        clock.tick(10);
        grid[requestFn]();
        expect(spy.called).to.be.true;
      });
    });
  }
});
