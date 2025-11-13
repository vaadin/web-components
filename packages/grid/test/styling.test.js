import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
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

  function runStylingTest(entries, generatorFn, requestFn, assertCallback) {
    it(`should add ${entries} for cells`, () => {
      grid[generatorFn] = () => 'test-foo';
      assertCallback(['test-foo']);
      assertCallback(['test-foo'], 1, 1);
    });

    it(`should add all ${entries} separated by whitespaces`, () => {
      grid[generatorFn] = () => 'test-foo test-bar test-baz';
      assertCallback(['test-foo', 'test-bar', 'test-baz']);
    });

    it(`should not remove existing ${entries}`, () => {
      if (entries === 'classes') {
        firstCell.classList.add('test-bar');
      } else {
        firstCell.setAttribute('part', `${firstCell.getAttribute('part')} test-bar`);
      }

      grid[generatorFn] = () => 'test-foo';
      assertCallback(['test-bar', 'test-foo']);
    });

    it(`should remove old generated ${entries}`, () => {
      grid[generatorFn] = () => 'test-foo';
      grid[generatorFn] = () => 'test-bar'; // NOSONAR
      assertCallback(['test-bar']);
    });

    it(`should provide column and model as parameters to ${generatorFn}`, () => {
      grid[generatorFn] = (column, model) => `test-${model.index} test-${model.item.value} test-${column.header}`;
      assertCallback(['test-5', 'test-foo5', 'test-col1'], 5, 1);
      assertCallback(['test-10', 'test-foo10', 'test-col0'], 10, 0);
    });

    it(`should call ${generatorFn} for details cell with undefined column`, async () => {
      grid.rowDetailsRenderer = () => {};
      grid[generatorFn] = (column, model) => `test-${model.index} test-${column}`;
      await nextFrame();
      flushGrid(grid);
      assertCallback(['test-0', 'test-undefined'], 0, 2);
    });

    it(`should add ${entries} when loading new items`, (done) => {
      grid[generatorFn] = (_, model) => `test-${model.item.value}`;
      scrollToEnd(grid, () => {
        const rows = getRows(grid.$.items);
        assertCallback(['test-foo199'], rows.length - 1, 0);
        done();
      });
    });

    it(`should not throw when ${generatorFn} returns falsy value`, () => {
      expect(() => {
        grid[generatorFn] = () => {};
      }).not.to.throw(Error);
    });

    it(`should clear generated ${entries} with falsy return value`, () => {
      grid[generatorFn] = () => 'test-foo';
      grid[generatorFn] = () => {}; // NOSONAR
      assertCallback([]);
    });

    it(`should clear generated ${entries} with falsy property value`, () => {
      grid[generatorFn] = () => 'test-foo';
      grid[generatorFn] = undefined; // NOSONAR
      assertCallback([]);
    });

    [requestFn, 'clearCache', 'requestContentUpdate'].forEach((funcName) => {
      it(`should update ${entries} on ${funcName}`, () => {
        let condition = false;
        grid[generatorFn] = () => condition && 'test-foo';
        condition = true;
        assertCallback([]);
        grid[funcName]();
        assertCallback(['test-foo']);
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
        grid[generatorFn] = () => ' test-foo  test-bar ';
      }).not.to.throw(Error);
      assertCallback(['test-foo', 'test-bar']);
    });

    it(`should have the right ${entries} after toggling column visibility`, async () => {
      grid[generatorFn] = (_column, { index }) => `test-${index % 2 === 0 ? 'even' : 'odd'}`;
      const column = grid.querySelector('vaadin-grid-column');
      column.hidden = true;
      await nextRender();
      column.hidden = false;
      await nextRender();
      assertCallback(['test-odd'], 1, 0);
      assertCallback(['test-odd'], 1, 1);
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
        expect(spy.getCalls().filter((call) => call.args[1].index === 0).length).to.be.lessThan(5); // NOSONAR
      });

      it(`should remove custom ${entries} for rows that enter loading state`, () => {
        grid[generatorFn] = () => 'test-foo'; // NOSONAR
        clock.tick(10);

        expect(grid._getRenderedRows()[0].hasAttribute('loading')).to.be.false;
        assertCallback(['test-foo']);

        grid.clearCache();

        expect(grid._getRenderedRows()[0].hasAttribute('loading')).to.be.true;
        assertCallback([]);
      });
    });
  }

  describe('cell class name generator', () => {
    const assertClassList = (expectedClasses, row = 0, col = 0) => {
      const cell = getContainerCell(grid.$.items, row, col);
      expect([...cell.classList]).to.include('cell');
      expect([...cell.classList].filter((c) => c.startsWith('test-'))).to.deep.equal(expectedClasses);
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
      let actualPart = cell.getAttribute('part');
      // Remove "loading-row-cell" since initialCellPart doesn't include it and it's irrelevant for the test
      actualPart = actualPart.replace('loading-row-cell', '').trim();
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

  describe('header and footer part name', () => {
    let column;
    let headerCell;
    let footerCell;

    beforeEach(() => {
      column = grid.querySelector('vaadin-grid-column');
      column.footerRenderer = (root) => {
        root.textContent = 'footer';
      };
      headerCell = getContainerCell(grid.$.header, 0, 0);
      footerCell = getContainerCell(grid.$.footer, 0, 0);
    });

    it('should add a header and footer part name', () => {
      column.headerPartName = 'foobar';
      column.footerPartName = 'bazqux';

      expect(headerCell.getAttribute('part')).to.contain('foobar');
      expect(footerCell.getAttribute('part')).to.contain('bazqux');
    });

    it('should clear the header and footer part name', () => {
      column.headerPartName = 'foobar';
      column.footerPartName = 'bazqux';

      column.headerPartName = '';
      column.footerPartName = '';

      expect(headerCell.getAttribute('part')).to.not.contain('foobar');
      expect(footerCell.getAttribute('part')).to.not.contain('bazqux');
    });

    it('should add multiple header and footer part names', () => {
      column.headerPartName = 'foobar bazqux';
      column.footerPartName = 'bazqux foobar';

      expect(headerCell.getAttribute('part')).to.contain('foobar');
      expect(headerCell.getAttribute('part')).to.contain('bazqux');
      expect(footerCell.getAttribute('part')).to.contain('foobar');
      expect(footerCell.getAttribute('part')).to.contain('bazqux');
    });

    it('should remove one header and footer part name', () => {
      column.headerPartName = 'foobar bazqux';
      column.footerPartName = 'bazqux foobar';

      column.headerPartName = 'foobar';
      column.footerPartName = 'bazqux';

      expect(headerCell.getAttribute('part')).to.contain('foobar');
      expect(headerCell.getAttribute('part')).to.not.contain('bazqux');
      expect(footerCell.getAttribute('part')).to.contain('bazqux');
      expect(footerCell.getAttribute('part')).to.not.contain('foobar');
    });

    it('should add a header and footer part name with trailing whitespace', () => {
      column.headerPartName = 'foobar ';
      column.footerPartName = ' bazqux';

      expect(headerCell.getAttribute('part')).to.contain('foobar');
      expect(footerCell.getAttribute('part')).to.contain('bazqux');
    });

    it('should clear the header and footer part name with null', () => {
      column.headerPartName = 'foobar';
      column.footerPartName = 'bazqux';

      column.headerPartName = null;
      column.footerPartName = null;

      expect(headerCell.getAttribute('part')).to.not.contain('foobar');
      expect(footerCell.getAttribute('part')).to.not.contain('bazqux');
    });

    it('should clear the header and footer part name with undefined', () => {
      column.headerPartName = 'foobar';
      column.footerPartName = 'bazqux';

      column.headerPartName = undefined;
      column.footerPartName = undefined;

      expect(headerCell.getAttribute('part')).to.not.contain('foobar');
      expect(footerCell.getAttribute('part')).to.not.contain('bazqux');
    });

    it('should not override custom part names', () => {
      const newColumn = document.createElement('vaadin-grid-column');
      newColumn.path = 'value';
      newColumn.headerPartName = 'foobar';
      newColumn.footerPartName = 'bazqux';
      grid.appendChild(newColumn);

      flushGrid(grid);

      const newHeaderCell = getContainerCell(grid.$.header, 0, 2);
      const newFooterCell = getContainerCell(grid.$.footer, 0, 2);

      expect(newHeaderCell.getAttribute('part')).to.contain('foobar');
      expect(newFooterCell.getAttribute('part')).to.contain('bazqux');
    });
  });
});
