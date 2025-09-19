import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './grid-test-styles.js';
import '../all-imports.js';
import { flushGrid, getContainerCell, getHeaderCell } from './helpers.js';

function getCellIntrinsicWidth(cell) {
  const originalInlineStyles = cell.getAttribute('style');
  // Prepare the cell for having its intrinsic width measured
  cell.style.width = 'auto';
  cell.style.position = 'absolute';

  const intrinsicWidth = parseFloat(getComputedStyle(cell).width);

  // Restore the original inline styles
  cell.setAttribute('style', originalInlineStyles);
  return intrinsicWidth;
}

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

  class TestContainer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <slot name="custom-slot"></slot>
      `;
    }
  }

  customElements.define('test-container', TestContainer);

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

  it('should not update column widths when items are set after setting a non-empty items array', async () => {
    // Set a non-empty items array to the grid
    grid.items = [{ a: 'a' }, { a: 'aaaaaaaa' }];
    flushGrid(grid);

    // Assign new items
    grid.items = [{ a: 'a' }, { a: 'a' }];
    await nextFrame();

    expectColumnWidthsToBeOk(grid.querySelectorAll('vaadin-grid-column'), [101]);
  });

  it('should have correct column widths when items are set after setting an lazy data provider', async () => {
    // Set an empty items array to the grid
    grid.dataProvider = (params, callback) => {
      requestAnimationFrame(() => {
        callback(testItems.slice(0, params.pageSize), testItems.length);
      });
    };

    flushGrid(grid);
    await nextFrame();

    // Assign new items with the second one having a long value
    grid.items = [{ a: 'a' }, { a: 'aaaaaaaa' }];
    await nextFrame();

    expectColumnWidthsToBeOk(grid.querySelectorAll('vaadin-grid-column'));
  });

  it('should have correct column widths when the grid is visually scaled', async () => {
    grid.style.transform = 'scale(0.5)';
    grid.items = testItems;

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths when the grid has an undefined height', async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 600px; height: 100%;">
        <vaadin-grid-column auto-width flex-grow="0" path="a"></vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.items = [{ a: 'aaaaaaaaaaaaaaa' }];
    spy = sinon.spy(grid, '_recalculateColumnWidths');
    await recalculateWidths();

    expectColumnWidthsToBeOk(grid.querySelectorAll('vaadin-grid-column'), [163]);
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

  it('should have correct column widths once initially visible', async () => {
    const grid = fixtureSync(`
      <vaadin-grid style="width: 600px; height: 200px;" hidden>
        <vaadin-grid-column auto-width flex-grow="0" header="foo bar baz"></vaadin-grid-column>
      </vaadin-grid>
    `);

    await nextFrame();
    grid.hidden = false;
    await oneEvent(grid, 'animationend');
    expectColumnWidthsToBeOk(grid.querySelectorAll('vaadin-grid-column'), [107]);
  });

  it('should have correct column widths once an invisible column is made visible', async () => {
    grid.items = testItems;
    columns[1].hidden = true;

    await nextFrame();
    columns[1].hidden = false;
    await nextFrame();
    grid.recalculateColumnWidths();

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths when using renderers', async () => {
    columns[0].renderer = function (root, _column, model) {
      root.textContent = model.index;
    };
    columns[1].renderer = function (root, _column, model) {
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
    grid.style.height = '180px';
    grid.items = [...testItems, { a: 'a' }, { a: 'aaaaaaaaaaaaaaaaaaaaa' }];

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should update column width when recalculating widths', async () => {
    grid.items = testItems;
    await recalculateWidths();
    expectColumnWidthsToBeOk(columns, [74]);

    // Update item text in first column
    grid.items = [{ a: 'foo bar baz' }];
    await nextFrame();
    grid.recalculateColumnWidths();
    expectColumnWidthsToBeOk(columns, [114]);
  });

  it('should defer calculating column widths when the grid is not visible', async () => {
    grid.items = testItems;
    await recalculateWidths();
    expectColumnWidthsToBeOk(columns, [74]);

    // Move grid to a custom element without setting proper slot name beforehand
    // This reproduces a case in split-layout, which automatically applies slot
    // names to children, but only after they have been connected. In this case
    // columns should not resize while the grid is invisible, because their size
    // would collapse to zero.
    const container = fixtureSync('<test-container></test-container>');
    container.appendChild(grid);

    // Column widths should not have recalculated
    await nextFrame();
    expectColumnWidthsToBeOk(columns, [74]);

    // Apply correct slot name
    grid.slot = 'custom-slot';

    // Column widths should recalculate, keeping the same width
    await recalculateWidths();
    expectColumnWidthsToBeOk(columns, [74]);
  });

  it('should take cell styling into account', async () => {
    const firstColumnWidth = parseInt(columns[0].width);

    fixtureSync(`
      <style>
        vaadin-grid::part(cell) {
          padding-right: 20px !important;
        }
      </style>
    `);

    grid.recalculateColumnWidths();
    await recalculateWidths();

    expectColumnWidthsToBeOk(columns, [firstColumnWidth + 20]);
  });

  it('should have correct cell width after re-measuring', async () => {
    const headerCell = getContainerCell(grid.$.header, 0, 0);
    const headerCellWidth = headerCell.getBoundingClientRect().width;

    grid.recalculateColumnWidths();
    await recalculateWidths();

    expect(headerCell.getBoundingClientRect().width).to.be.closeTo(headerCellWidth, 5);
  });

  it('should have correct column widths for lazily defined columns', async () => {
    const tagName = 'vaadin-custom-column';
    const newColumn = document.createElement(tagName);
    newColumn.autoWidth = true;
    newColumn.flexGrow = 0;
    newColumn.path = 'a';

    // Replace 'a' column with a new one
    grid.removeChild(columns[0]);
    grid.insertBefore(newColumn, columns[1]);
    columns = grid.querySelectorAll(`${tagName}, vaadin-grid-column`);
    grid.items = testItems;

    // Define the custom column element after a delay
    await new Promise((resolve) => {
      setTimeout(() => {
        customElements.define(
          tagName,
          class extends customElements.get('vaadin-grid-column') {
            static is = tagName;
          },
        );
        resolve();
      }, 100);
    });

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths for lazily added columns', async () => {
    const grid = fixtureSync(`<vaadin-grid style="width: 600px; height: 200px;">
      <vaadin-grid-column header="Foo"></vaadin-grid-column>
    </vaadin-grid>`);
    await nextFrame();

    fixtureSync(
      `<vaadin-grid-column id="new" flex-grow="0" header="foo bar baz" auto-width></vaadin-grid-column>`,
      grid,
    );
    const newColumn = grid.querySelector('vaadin-grid-column#new');
    await nextFrame();
    expect(parseFloat(newColumn.width)).to.be.closeTo(107, 5);
  });

  it('should have correct column widths for frozen columns with no items', async () => {
    const [firstColumn, lastColumn] = [columns[0], columns[columns.length - 1]];
    firstColumn.frozen = true;
    firstColumn.header = 'foo bar baz';
    lastColumn.frozenToEnd = true;

    grid.recalculateColumnWidths();
    await recalculateWidths();

    const frozenHeaderCell = getHeaderCell(grid, 0, 0);
    const frozenToEndHeaderCell = getHeaderCell(grid, 0, columns.length - 1);
    expect(parseFloat(firstColumn.width)).not.to.be.lessThan(getCellIntrinsicWidth(frozenHeaderCell));
    expect(parseFloat(lastColumn.width)).not.to.be.lessThan(getCellIntrinsicWidth(frozenToEndHeaderCell));
  });

  it('should recalculate column widths on initial item load without data provider change', async () => {
    let items = [];
    grid.dataProvider = (_, cb) => cb(items, items.length);
    await nextFrame();

    // Should recalculate once on initial load of items
    spy.resetHistory();
    items = [testItems[0], testItems[1]];
    grid.size = items.length;
    await nextFrame();
    expect(spy.callCount).to.equal(1);

    // Should not recalculate on further update of items
    spy.resetHistory();
    items = [...items, testItems[2]];
    grid.size = items.length;
    await nextFrame();
    expect(spy.called).to.be.false;
  });

  describe('focusButtonMode column', () => {
    beforeEach(async () => {
      const column = document.createElement('vaadin-grid-column');
      column.autoWidth = true;
      column.path = 'b';
      column._focusButtonMode = true;
      grid.insertBefore(column, grid.firstElementChild);
      columns = grid.querySelectorAll('vaadin-grid-column');

      await aTimeout(0);
    });

    it('should calculate auto-width of focusButtonMode column correctly', async () => {
      grid.items = testItems;

      await recalculateWidths();
      expectColumnWidthsToBeOk(columns, [114, 71, 114, 84, 107]);
    });
  });
});

describe('tree column', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid>
        <vaadin-grid-tree-column auto-width path="name" flex-grow="0"></vaadin-grid-tree-column>
      </vaadin-grid>
    `);

    const data = [
      {
        name: 'a',
        children: [
          {
            name: 'b',
          },
        ],
      },
    ];
    grid.dataProvider = (params, cb) => cb(params.parentItem ? params.parentItem.children : data, 1);
    grid.expandItem(data[0]);
    flushGrid(grid);
  });

  it('should recalculate tree column width correctly', () => {
    expect(parseInt(grid.firstElementChild.width)).to.be.closeTo(107, 5);
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

  it('should recalculate column widths when child items are loaded synchronously', () => {
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
    flushGrid(grid);
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

  describe('initially empty grid', () => {
    let recalculateColumnWidthsSpy, dataProvider;

    beforeEach(() => {
      recalculateColumnWidthsSpy = sinon.spy(grid, '_recalculateColumnWidths');
      dataProvider = (_params, callback) => callback([], 0);
      grid.dataProvider = (params, callback) => dataProvider(params, callback);
      flushGrid(grid);
      recalculateColumnWidthsSpy.resetHistory();
    });

    it('should recalculate column widths when child items are loaded asynchonously', async () => {
      const items = [{ name: 'Item-0' }, { name: 'Item-1', children: [{ name: 'Item-1-0' }] }];

      dataProvider = ({ parentItem }, callback) => {
        if (parentItem) {
          setTimeout(() => callback(parentItem.children, parentItem.children.length));
        } else {
          callback(items.slice(0, grid.size), grid.size);
        }
      };

      grid.expandItem(items[1]);
      grid.size = 2;
      flushGrid(grid);

      expect(recalculateColumnWidthsSpy).to.be.not.called;
      await aTimeout(0);
      expect(recalculateColumnWidthsSpy).to.be.calledOnce;
    });
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

  it('should consider column group when calculating column width', async () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header that should change the width of the column">
          <vaadin-grid-column auto-width path="a" header="small header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    await nextFrame();
    expectColumnsWidthToBeOk(grid, [420], 25);
  });

  it('should distribute the excess space to all columns', async () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header that should change the width of the column">
          <vaadin-grid-column auto-width path="a" header="small header"></vaadin-grid-column>
          <vaadin-grid-column auto-width path="b" header="small header"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    await nextFrame();
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

  it('should distribute the excess space to all columns according to their initial width', async () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header that should change the width of the column">
          <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
          <vaadin-grid-column auto-width path="b" header="headerheader"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    await nextFrame();
    const [columnA, columnB] = grid.querySelectorAll('vaadin-grid-column');
    expect(num(columnB.width)).to.be.greaterThan(num(columnA.width));
  });

  it('should consider all the parent vaadin-grid-column-groups when calculating the necessary width', async () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="a lengthy header, greater than immediate column-group">
          <vaadin-grid-column-group header="immediate column-group">
            <vaadin-grid-column auto-width path="a" header="header"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    await nextFrame();
    expectColumnsWidthToBeOk(grid, [403], 30);
  });

  it('should consider vaadin-grid-column header when calculating column width', async () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="small header">
          <vaadin-grid-column auto-width path="a" header="a lengthy header that should change the width of the column"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    await nextFrame();
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
