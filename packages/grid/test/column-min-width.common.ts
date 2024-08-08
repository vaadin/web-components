import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import type { Grid } from '../src/vaadin-grid.js';
import type { GridColumn } from '../src/vaadin-grid-column.js';
import type { GridColumnGroup } from '../src/vaadin-grid-column-group.js';
import { fire, flushGrid, getRowCells, getRows, infiniteDataProvider } from './helpers.js';

interface ExpectedWidths {
  pattern: RegExp;
  values: number[];
}
function expectColumnWidthsToBeOk(
  columns: NodeListOf<GridColumn<any> | GridColumnGroup<any>>,
  expectedWidths: ExpectedWidths[] = [
    { pattern: /max\(([0-9]+)px, ([0-9]+)px\)/u, values: [50, 71] },
    { pattern: /([0-9]+)[px]?/u, values: [114] },
    { pattern: /([0-9]+)[px]?/u, values: [84] },
    { pattern: /([0-9]+)[px]?/u, values: [107] },
  ],
  delta = 5,
) {
  // Allowed margin of measurement to keep the test from failing if there are small differences in rendered text
  // width on different platforms or if there are small changes to styles which affect horizontal margin/padding.
  expectedWidths.forEach((expectedWidth, index) => {
    const colWidth = columns[index].width;
    expect(colWidth).to.be.not.undefined;
    expect(colWidth).to.be.not.null;
    const split = colWidth!.split(expectedWidth.pattern);
    for (let indexValue = 0; indexValue < expectedWidth.values.length; indexValue++) {
      const widthValue: string = split[indexValue + 1];
      const expectedWidthValue = expectedWidth.values[indexValue];
      const columnWidth = parseInt(widthValue);
      expect(columnWidth).to.be.closeTo(expectedWidthValue, delta);
    }
  });
}

describe('column auto-width', () => {
  let grid: Grid;
  let columns: NodeListOf<GridColumn<any>>;
  let spy;

  const testItems = [
    { a: 'fubar', b: 'foo', c: 'foo', d: 'a' },
    { a: 'foo', b: 'foo bar baz', c: 'foo', d: 'bar' },
    { a: 'foo', b: 'foo baz', c: 'foo bar', d: 'baz' },
  ];

  function whenColumnWidthsCalculated(cb: any) {
    if ((grid as any)._recalculateColumnWidths.called) {
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
      this.shadowRoot!.innerHTML = `
        <slot name="custom-slot"></slot>
      `;
    }
  }

  customElements.define('test-container', TestContainer);

  it('should have correct column widths when items are set', async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 600px; height: 200px;" hidden>
        <vaadin-grid-column auto-width min-width="50px" flex-grow="0" path="a"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" path="b"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" path="c"></vaadin-grid-column>
        <vaadin-grid-column auto-width flex-grow="0" path="d" header="foo bar baz"></vaadin-grid-column>
      </vaadin-grid>
    `);
    spy = sinon.spy(grid, '_recalculateColumnWidths');
    spy.resetHistory();
    columns = grid.querySelectorAll('vaadin-grid-column');
    // Show the grid and wait for animationend event ("vaadin-grid-appear")
    // to ensure the grid is in a consistent state before starting each test
    grid.hidden = false;
    await oneEvent(grid, 'animationend');
    grid.items = testItems;

    await recalculateWidths();
    expectColumnWidthsToBeOk(columns);
  });

  it('should have correct column widths when items are set', async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 600px; height: 200px;" hidden>
        <vaadin-grid-column auto-width min-width="150px" flex-grow="0" path="a"></vaadin-grid-column>
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
    grid.items = testItems;
    await recalculateWidths();
    expectColumnWidthsToBeOk(columns, [{ pattern: /max\(([0-9]+)px, ([0-9]+)px\)/u, values: [150, 151] }]);
  });
});

describe('column group', () => {
  const num = (str: string) => parseInt(str, 10);

  function createGrid(html: string, items = [{ a: 'm', b: 'mm' }]) {
    const grid: Grid = fixtureSync(html);
    grid.items = items;
    flushGrid(grid);

    return grid;
  }

  it('should consider vaadin-grid-column header when calculating column width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="small header">
          <vaadin-grid-column min-width="200px" auto-width path="a" header="a lengthy header that should change the width of the column"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    const columns = grid.querySelectorAll('vaadin-grid-column');
    expectColumnWidthsToBeOk(
      columns,
      [
        {
          pattern: /max\(([0-9]+)px, ([0-9]+)px\)/u,
          values: [200, 420],
        },
      ],
      25,
    );
    const columnGroups = grid.querySelectorAll('vaadin-grid-column-group');
    expectColumnWidthsToBeOk(
      columnGroups,
      [
        {
          pattern: /calc\(max\(([0-9]+)px, ([0-9]+)px\)\)/u,
          values: [200, 420],
        },
      ],
      25,
    );
  });
  it('should consider vaadin-grid-column header when calculating column width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="small header">
          <vaadin-grid-column min-width="200px" auto-width path="a" header="a lengthy header that should change the width of the column"></vaadin-grid-column>
          <vaadin-grid-column min-width="190px" auto-width path="b" header="b lengthy header that should change the width of the column"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    const columnGroups = grid.querySelectorAll('vaadin-grid-column-group');
    expectColumnWidthsToBeOk(
      columnGroups,
      [
        {
          pattern: /calc\(max\(([0-9]+)px, ([0-9]+)px\) \+ max\(([0-9]+)px, ([0-9]+)px\)\)/u,
          values: [200, 420, 190, 420],
        },
      ],
      25,
    );
  });
  it('should consider calculate the width of the group based on the min-width', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="small header">
          <vaadin-grid-column min-width="200px" auto-width path="a" header="a"></vaadin-grid-column>
          <vaadin-grid-column min-width="190px" auto-width path="b" header="b"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    const columnGroups = grid.querySelectorAll('vaadin-grid-column-group');
    expectColumnWidthsToBeOk(
      columnGroups,
      [
        {
          pattern: /calc\(max\(([0-9]+)px, ([0-9]+)px\) \+ max\(([0-9]+)px, ([0-9]+)px\)\)/u,
          values: [200, 201, 190, 191],
        },
      ],
      25,
    );
  });
  it('should consider ignore the hidden columns', () => {
    const grid = createGrid(`
      <vaadin-grid style="width: 200px">
        <vaadin-grid-column-group header="small header">
          <vaadin-grid-column min-width="200px" auto-width path="a" header="a"></vaadin-grid-column>
          <vaadin-grid-column min-width="150px" auto-width path="b" header="b" hidden></vaadin-grid-column>
          <vaadin-grid-column min-width="190px" auto-width path="b" header="b"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    const columnGroups = grid.querySelectorAll('vaadin-grid-column-group');
    expectColumnWidthsToBeOk(
      columnGroups,
      [
        {
          pattern: /calc\(max\(([0-9]+)px, ([0-9]+)px\) \+ max\(([0-9]+)px, ([0-9]+)px\)\)/u,
          values: [200, 201, 190, 191],
        },
      ],
      25,
    );
  });
});

describe('column resizing', () => {
  let grid: Grid, headerCells: NodeListOf<Element>, handle: Element;

  beforeEach(async () => {
    grid = fixtureSync(`
    <vaadin-grid size="1" style="width: 300px; height: 400px">
      <vaadin-grid-column resizable header="0" min-width="100px"></vaadin-grid-column>
      <vaadin-grid-column header="1"></vaadin-grid-column>
    </vaadin-grid>
  `);
    grid.querySelectorAll('vaadin-grid-column').forEach((col, idx) => {
      col.renderer = (root) => {
        root.textContent = idx.toString();
      };
    });
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    headerCells = getRowCells(getRows((grid as any).$.header)[0]);
    handle = headerCells[0].querySelector('[part~="resize-handle"]')!;
    await nextRender(grid);
  });
  it('should set min width based on the min width value', () => {
    const options = { node: handle };
    const rect = headerCells[0].getBoundingClientRect();

    expect(headerCells[0].clientWidth).to.be.closeTo(149, 5);

    fire('track', { state: 'start' }, options);
    fire('track', { state: 'track', x: rect.left + 130, y: 0 }, options);
    expect(headerCells[0].clientWidth).to.be.equal(130);

    fire('track', { state: 'start' }, options);
    fire('track', { state: 'track', x: rect.left + 100, y: 0 }, options);
    expect(headerCells[0].clientWidth).to.be.equal(100);
  });
});

describe('column group resizing', () => {
  let grid: Grid;

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid size="1" style="width: 300px; height: 400px">
        <vaadin-grid-column-group resizable header="0">
          <vaadin-grid-column flex-grow="0" header="0" min-width="120px"></vaadin-grid-column>
          <vaadin-grid-column flex-grow="0" header="1" min-width="70px"></vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid>
    `);
    grid.querySelectorAll('vaadin-grid-column').forEach((col, idx) => {
      col.renderer = (root) => {
        root.textContent = idx.toString();
      };
    });
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
    await nextRender(grid);
  });
  ['rtl', 'ltr'].forEach((direction) => {
    describe(`child columns resizing in ${direction}`, () => {
      beforeEach(() => {
        grid.setAttribute('dir', direction);
      });

      it('should resize the child column', () => {
        const headerRows = getRows((grid as any).$.header);
        const groupCell = getRowCells(headerRows[0])[0];
        const handle = groupCell.querySelector('[part~="resize-handle"]');

        const cell = getRowCells(headerRows[1])[1];
        const rect = cell.getBoundingClientRect();
        const options = { node: handle };
        expect(cell.clientWidth).to.equal(100);
        fire('track', { state: 'start' }, options);
        fire('track', { state: 'track', x: rect.right + (direction === 'rtl' ? -50 : 50), y: 0 }, options);

        expect(cell.clientWidth).to.equal(direction === 'rtl' ? 70 : 150);
        expect(groupCell.clientWidth).to.equal(direction === 'rtl' ? 190 : 270);
      });

      it('should resize the last non-hidden child column', () => {
        (grid as any)._columnTree[1][1].hidden = true;
        const headerRows = getRows((grid as any).$.header);
        const groupCell = getRowCells(headerRows[0])[0];
        const handle = groupCell.querySelector('[part~="resize-handle"]');

        const cell = getRowCells(headerRows[1])[0];
        const rect = cell.getBoundingClientRect();
        const options = { node: handle };
        fire('track', { state: 'start' }, options);
        fire('track', { state: 'track', x: rect.right + (direction === 'rtl' ? -100 : 100), y: 0 }, options);

        expect(cell.clientWidth).to.equal(direction === 'rtl' ? 120 : 220);
        expect(groupCell.clientWidth).to.equal(direction === 'rtl' ? 120 : 220);
      });
    });
  });
});
