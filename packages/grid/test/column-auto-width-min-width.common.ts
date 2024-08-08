import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import type { Grid } from '../src/vaadin-grid.js';

interface ExpectedWidths {
  pattern: RegExp;
  values: number[];
}
function expectColumnWidthsToBeOk(
  columns: any,
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
    const colWidth: string = columns[index].width;
    const split = colWidth.split(expectedWidth.pattern);
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
  let columns;
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
