import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, oneEvent } from '@open-wc/testing-helpers';
import { flushGrid } from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-tree-column.js';

describe('column auto-width', function () {
  let grid;
  let columns;
  let spy;

  const testItems = [
    { a: 'fubar', b: 'foo', c: 'foo', d: 'a' },
    { a: 'foo', b: 'foo bar baz', c: 'foo', d: 'bar' },
    { a: 'foo', b: 'foo baz', c: 'foo bar', d: 'baz' }
  ];

  function expectColumnWidthsToBeOk(columns, expectedWidths = [71, 114, 84, 107]) {
    // Allowed margin of measurement to keep the test from failing if there are small differences in rendered text
    // width on different platforms or if there are small changes to styles which affect horizontal margin/padding.
    const delta = 5;

    expectedWidths.forEach((expectedWidth, index) => {
      const columnWidth = parseInt(columns[index].width);
      expect(columnWidth).to.be.closeTo(expectedWidth, delta);
    });
  }

  function whenColumnWidthsCalculated(cb) {
    if (grid._recalculateColumnWidths.called) {
      cb();
    } else {
      requestAnimationFrame(() => whenColumnWidthsCalculated(cb));
    }
  }

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 600px; height: 200px;" hidden>
        <vaadin-grid-column auto-width flex-grow="0" path="a"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" path="b"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" path="c"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" path="d" header="foo bar baz"></vaadin-grid-column>
      </vaadin-grid>
    `);
    spy = sinon.spy(grid, '_recalculateColumnWidths');
    columns = grid.querySelectorAll('vaadin-grid-column');
    // Show the grid and wait for animationend event ("vaadin-grid-appear")
    // to ensure the grid is in a consistent state before starting each test
    grid.hidden = false;
    await oneEvent(grid, 'animationend');
  });

  it('should have correct column widths when items are set', (done) => {
    grid.items = testItems;

    whenColumnWidthsCalculated(() => {
      expectColumnWidthsToBeOk(columns);
      done();
    });
  });

  it('should have correct column widths when the grid is visually scaled', (done) => {
    grid.style.transform = 'scale(0.5)';
    grid.items = testItems;

    whenColumnWidthsCalculated(() => {
      expectColumnWidthsToBeOk(columns);
      done();
    });
  });

  it('should have correct column widths when using lazy dataProvider', (done) => {
    grid.dataProvider = (params, callback) => {
      requestAnimationFrame(() => {
        callback(testItems.slice(0, params.pageSize), testItems.length);
      });
    };
    spy.resetHistory();
    expect(grid._recalculateColumnWidths.called).to.be.false;
    whenColumnWidthsCalculated(() => {
      expectColumnWidthsToBeOk(columns);
      done();
    });
  });

  it('should have correct column widths once visible', (done) => {
    grid.hidden = true;
    grid.items = testItems;

    requestAnimationFrame(() => {
      grid.hidden = false;

      spy.resetHistory();
      expect(grid._recalculateColumnWidths.called).to.be.false;
      whenColumnWidthsCalculated(() => {
        expectColumnWidthsToBeOk(columns);
        done();
      });
    });
  });

  it('should have correct column widths when using renderers', (done) => {
    columns[0].renderer = function (root, column, model) {
      root.textContent = model.index;
    };
    columns[1].renderer = function (root, column, model) {
      root.innerHTML = `<div style="width: ${10 + 10 * model.index}px; height: 25px; outline: 1px solid green;">`;
    };
    grid.items = testItems;

    whenColumnWidthsCalculated(() => {
      expectColumnWidthsToBeOk(columns, [42, 62, 84, 107]);
      done();
    });
  });
});

describe('async recalculateWidth columns', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-tree-column auto-width path="name"></vaadin-grid-tree-column>
      </vaadin-grid>
    `);
  });

  it('should recalculate column widths when child items loaded', () => {
    const data = [
      {
        name: 'foo',
        children: [
          {
            name: 'bar'
          }
        ]
      }
    ];
    grid.dataProvider = (params, cb) => {
      grid._getData = () => cb(params.parentItem ? params.parentItem.children : data, 1);
    };
    grid._getData();
    flushGrid(grid);
    sinon.spy(grid, '_recalculateColumnWidths');
    grid.expandItem(data[0]);
    grid.recalculateColumnWidths();
    expect(grid._recalculateColumnWidths.called).to.be.false;
    grid._getData();
    flushGrid(grid);
    expect(grid._recalculateColumnWidths.called).to.be.true;
  });
});
