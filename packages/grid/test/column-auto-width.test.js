import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-grid.js';
import '../vaadin-grid-column-group.js';
import '../vaadin-grid-tree-column.js';
import { flushGrid } from './helpers.js';

describe('column auto-width', () => {
  let grid;
  let columns;
  let spy;

  const testItems = [
    { a: 'fubar', b: 'foo', c: 'foo', d: 'a' },
    { a: 'foo', b: 'foo bar baz', c: 'foo', d: 'bar' },
    { a: 'foo', b: 'foo baz', c: 'foo bar', d: 'baz' },
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

  function recalculateWidths() {
    return new Promise((resolve) => {
      whenColumnWidthsCalculated(() => {
        resolve();
      });
    });
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

  it('should have correct column widths when items are set', async () => {
    grid.items = testItems;

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths when items are set after setting an empty items array', async () => {
    // Set an empty items array to the grid
    grid.items = [];
    flushGrid(grid);

    // Assign new items with the second one having a long value
    grid.items = [{ a: 'a' }, { a: 'aaaaaaaa' }];
    await nextFrame();

    expectColumnWidthsToBeOk(grid.querySelectorAll('vaadin-grid-column'), [101]);
  });

  it('should have correct column widths when the grid is visually scaled', async () => {
    grid.style.transform = 'scale(0.5)';
    grid.items = testItems;

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths when using lazy dataProvider', async () => {
    grid.dataProvider = (params, callback) => {
      requestAnimationFrame(() => {
        callback(testItems.slice(0, params.pageSize), testItems.length);
      });
    };
    spy.resetHistory();
    expect(grid._recalculateColumnWidths.called).to.be.false;
    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths once visible', async () => {
    grid.hidden = true;
    grid.items = testItems;

    await nextFrame();
    grid.hidden = false;

    spy.resetHistory();
    expect(grid._recalculateColumnWidths.called).to.be.false;

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths once an invisible column is made visible', async () => {
    grid.items = testItems;
    columns[1].hidden = true;

    await nextFrame();
    columns[1].hidden = false;
    grid.recalculateColumnWidths();

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths when using renderers', async () => {
    columns[0].renderer = function (root, column, model) {
      root.textContent = model.index;
    };
    columns[1].renderer = function (root, column, model) {
      root.innerHTML = `<div style="width: ${10 + 10 * model.index}px; height: 25px; outline: 1px solid green;">`;
    };
    grid.items = testItems;

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns, [42, 62, 84, 107]);
  });

  it('should exclude non-visible body cells from grid column auto width calc', async () => {
    // Assign more items to the grid. The last one with the long content, while in the DOM,
    // will end up outside the visible viewport and therefore should not affect the
    // calculated column auto-width
    grid.items = [...testItems, { a: 'a' }, { a: 'aaaaaaaaaaaaaaaaaaaaa' }];

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should recalculate tree column width correctly', async () => {
    // Add a tree column to the grid
    const treeColumn = fixtureSync(
      `<vaadin-grid-tree-column path="id" auto-width flex-grow="0" resizable></vaadin-grid-tree-column>`,
    );
    grid.insertBefore(treeColumn, columns[0]);

    // Expand two levels of the tree
    grid.itemIdPath = 'id';
    grid.expandedItems = [{ id: 'item-0' }, { id: 'item-0-0' }];

    // Assign a hierarchical data provider to the grid
    grid.dataProvider = ({ parentItem, page, pageSize }, cb) => {
      cb(
        [...Array(Math.min(5, pageSize))].map((_, i) => {
          const indexInLevel = page * pageSize + i;

          return {
            id: `${parentItem ? `${parentItem.id}-` : 'item-'}${`${indexInLevel}`}`,
            children: true,
          };
        }),
        1,
      );
    };

    await recalculateWidths();
    await nextFrame();

    expect(parseInt(treeColumn.width)).to.be.closeTo(211, 5);
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
            name: 'bar',
          },
        ],
      },
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

describe('column group', () => {
  const num = (str) => parseInt(str, 10);

  function expectColumnsWidthToBeOk(grid, ws, delta = 5) {
    const columns = grid.querySelectorAll('vaadin-grid-column');

    Array.from(columns).forEach((col, i) => {
      const columnWidth = num(col.width);
      expect(columnWidth).to.be.closeTo(ws[i], delta);
    });
  }

  function createGrid(html, items = [{ a: 'm', b: 'mm' }]) {
    const grid = fixtureSync(html);
    grid.items = items;
    flushGrid(grid);

    return grid;
  }

  it('should consider column group when calculating column width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header that should change the width of the column">
          <vaadin-grid-column auto-width path="a" header="small header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    expectColumnsWidthToBeOk(grid, [420], 25);
  });

  it('should distribute the excess space to all columns', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header that should change the width of the column">
          <vaadin-grid-column auto-width path="a" header="small header"></vaadin-grid-column>
          <vaadin-grid-column auto-width path="b" header="small header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);

    expectColumnsWidthToBeOk(grid, [217, 217], 20);
  });

  it('should distribute the extra necessary space to all columns regardless of flexGrow', () => {
    const items = [{ first: 'fff', last: 'lll' }];

    const grid = createGrid(
      `
        <vaadin-grid style="width: 200px">
          <vaadin-grid-column-group header="HeaderHeaderHeaderHeaderHeaderHeaderHeaderHeaderHeaderHeader">
            <vaadin-grid-column auto-width path="first"></vaadin-grid-column>
            <vaadin-grid-column auto-width path="last"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      `,
      items,
    );

    const gridWithFlexGrow = createGrid(
      `
        <vaadin-grid style="width: 200px">
          <vaadin-grid-column-group header="HeaderHeaderHeaderHeaderHeaderHeaderHeaderHeaderHeaderHeader">
            <vaadin-grid-column auto-width flex-grow="3" path="first"></vaadin-grid-column>
            <vaadin-grid-column auto-width path="last"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      `,
      items,
    );

    const [columnA, columnB] = grid.querySelectorAll('vaadin-grid-column');
    const [columnA2, columnB2] = gridWithFlexGrow.querySelectorAll('vaadin-grid-column');

    expect(columnA.width).to.equal(columnA2.width);
    expect(columnB.width).to.equal(columnB2.width);
  });

  it('should distribute the excess space to all columns according to their initial width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header that should change the width of the column">
          <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
          <vaadin-grid-column auto-width path="b" header="headerheader"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);

    const [columnA, columnB] = grid.querySelectorAll('vaadin-grid-column');
    expect(num(columnB.width)).to.be.greaterThan(num(columnA.width));
  });

  it('should consider all the parent vaadin-grid-column-groups when calculating the necessary width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header, greater than immediate column-group">
          <vaadin-grid-column-group header="immediate column-group">
            <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    expectColumnsWidthToBeOk(grid, [403], 30);
  });

  it('should consider vaadin-grid-column header when calculating column width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="small header">
          <vaadin-grid-column auto-width path="a" header="a lengthy header that should change the width of the column"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    expectColumnsWidthToBeOk(grid, [420], 25);
  });

  it('should consider vaadin-grid-column-group footer when calculating column width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group>
          <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);

    const columnGroup = document.querySelector('vaadin-grid-column-group');
    const column = document.querySelector('vaadin-grid-column');

    columnGroup.footerRenderer = (root) => {
      const footer = document.createElement('footer');
      footer.textContent = 'group footer';
      footer.style.width = '300px';

      root.appendChild(footer);
    };

    column.footerRenderer = (root) => {
      const footer = document.createElement('footer');
      footer.textContent = 'column footer';
      root.appendChild(footer);
    };

    grid.recalculateColumnWidths();
    expectColumnsWidthToBeOk(grid, [333]);
  });

  it('should consider vaadin-grid-column footer when calculating column width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group>
          <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);

    const columnGroup = document.querySelector('vaadin-grid-column-group');
    const column = document.querySelector('vaadin-grid-column');

    columnGroup.footerRenderer = (root) => {
      const footer = document.createElement('footer');
      footer.textContent = 'group footer';
      root.appendChild(footer);
    };

    column.footerRenderer = (root) => {
      const footer = document.createElement('footer');
      footer.textContent = 'footer';
      footer.style.width = '300px';

      root.appendChild(footer);
    };

    grid.recalculateColumnWidths();
    expectColumnsWidthToBeOk(grid, [333]);
  });

  it('should not error when there is no vaadin-grid-column-group', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
      </vaadin-grid>
    `);

    const column = document.querySelector('vaadin-grid-column');

    column.footerRenderer = (root) => {
      const footer = document.createElement('footer');
      footer.textContent = 'footer';
      footer.style.width = '300px';

      root.appendChild(footer);
    };

    grid.recalculateColumnWidths();
    expectColumnsWidthToBeOk(grid, [333]);
  });
});
