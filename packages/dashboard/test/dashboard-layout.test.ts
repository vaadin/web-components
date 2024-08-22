import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-layout.js';
import '../vaadin-dashboard-section.js';
import type { DashboardLayout } from '../vaadin-dashboard-layout.js';
import {
  getColumnWidths,
  getElementFromCell,
  getRowHeights,
  setColspan,
  setGap,
  setMaximumColumnCount,
  setMaximumColumnWidth,
  setMinimumColumnWidth,
} from './helpers.js';

/**
 * Validates the given grid layout.
 *
 * This function iterates through a number matrix representing the IDs of
 * the items in the layout, and checks if the elements in the corresponding
 * cells of the grid match the expected IDs.
 *
 * For example, the following layout would expect a grid with two columns
 * and three rows, where the first row has one element with ID "item-0" spanning
 * two columns, and the second row has two elements with IDs "item-1" and "item-2"
 * where the first one spans two rows, and the last cell in the third row has
 * an element with ID "item-3":
 *
 * ```
 * [
 *  [0, 0],
 *  [1, 2],
 *  [1, 3]
 * ]
 * ```
 */
function expectLayout(dashboard: DashboardLayout, layout: Array<Array<number | null>>) {
  expect(getRowHeights(dashboard).length).to.eql(layout.length);
  expect(getColumnWidths(dashboard).length).to.eql(layout[0].length);

  layout.forEach((row, rowIndex) => {
    row.forEach((itemId, columnIndex) => {
      const element = getElementFromCell(dashboard, rowIndex, columnIndex);
      if (!element) {
        expect(itemId).to.be.null;
      } else {
        expect(element.id).to.equal(`item-${itemId}`);
      }
    });
  });
}

describe('dashboard layout', () => {
  let dashboard: DashboardLayout;
  let childElements: HTMLElement[];
  const columnWidth = 100;
  const remValue = parseFloat(getComputedStyle(document.documentElement).fontSize);

  beforeEach(async () => {
    dashboard = fixtureSync(`
      <vaadin-dashboard-layout>
        <div id="item-0">Item 0</div>
        <div id="item-1">Item 1</div>
      </vaadin-dashboard-layout>
    `);
    childElements = [...dashboard.children] as HTMLElement[];
    // Disable gap between items in these tests
    setGap(dashboard, 0);
    // Set the column width to a fixed value
    setMinimumColumnWidth(dashboard, columnWidth);
    setMaximumColumnWidth(dashboard, columnWidth);
    // Make the dashboard wide enough to fit all items on a single row
    dashboard.style.width = `${columnWidth * dashboard.childElementCount}px`;

    await nextFrame();

    expect(getColumnWidths(dashboard)).to.eql([columnWidth, columnWidth]);
    /* prettier-ignore */
    expectLayout(dashboard, [
      [0, 1],
    ]);
  });

  it('should not display when hidden', () => {
    expect(dashboard.offsetHeight).to.be.above(0);
    dashboard.hidden = true;
    expect(dashboard.offsetHeight).to.eql(0);
  });

  it('should be responsive', () => {
    // Narrow down the component to fit one column
    dashboard.style.width = `${columnWidth}px`;

    /* prettier-ignore */
    expectLayout(dashboard, [
      [0],
      [1],
    ]);
  });

  it('should scroll when content overflows', () => {
    dashboard.style.width = `${columnWidth}px`;
    const rowHeight = Math.ceil(getRowHeights(dashboard)[0]);
    dashboard.style.height = `${rowHeight}px`;
    expect(dashboard.scrollTop).to.eql(0);

    dashboard.scrollTop = 1;
    expect(dashboard.scrollTop).to.eql(1);
  });

  describe('minimum column width', () => {
    it('should have a default minimum column width', () => {
      // Clear the minimum column width used in the tests
      setMinimumColumnWidth(dashboard, undefined);
      // Narrow down the component to have the width of 0
      dashboard.style.width = '0';
      // Expect the column width to equal the default minimum column width
      expect(getColumnWidths(dashboard)).to.eql([remValue * 25]);
    });

    it('should have one overflown column if narrowed below minimum column width', () => {
      // Narrow down the component to have the width of half a column
      dashboard.style.width = `${columnWidth / 2}px`;
      // Expect the column width to still be the same (overflown)
      expect(getColumnWidths(dashboard)).to.eql([columnWidth]);
    });

    it('should not overflow if narrowed to the minimum column width', () => {
      // Set the min column width to half of the column width
      setMinimumColumnWidth(dashboard, columnWidth / 2);
      // Narrow down the component to have the width of half a column
      dashboard.style.width = `${columnWidth / 2}px`;
      // Expect the column width to equal the min column width
      expect(getColumnWidths(dashboard)).to.eql([columnWidth / 2]);
    });

    it('should have one wide column with large minimum column width', () => {
      setMaximumColumnWidth(dashboard, columnWidth * 2);
      // Set the min column width to be twice as wide
      setMinimumColumnWidth(dashboard, columnWidth * 2);
      // Expect there to only be one column with twice the width
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 2]);
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });
  });

  describe('maximum column width', () => {
    it('should have a default maximum column width', () => {
      // Clear the maximum column width used in the tests
      setMaximumColumnWidth(dashboard, undefined);
      expect(getColumnWidths(dashboard)).to.eql([columnWidth, columnWidth]);
      // Widen the component to have the width of 2.5 columns
      dashboard.style.width = `${columnWidth * 2.5}px`;
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 1.25, columnWidth * 1.25]);
      // Widen the component to have the width of 3 columns
      dashboard.style.width = `${columnWidth * 3}px`;
      expect(getColumnWidths(dashboard)).to.eql([columnWidth, columnWidth, columnWidth]);
      // Shrink the component to have the width of 1.5 columns
      dashboard.style.width = `${columnWidth * 1.5}px`;
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 1.5]);
    });

    it('should have one wide column with large maximum column width', () => {
      // Allow the column to be twice as wide
      setMaximumColumnWidth(dashboard, columnWidth * 2);
      // Expect there to only be one column with twice the width
      expect(getColumnWidths(dashboard)).to.eql([columnWidth * 2]);
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });
  });

  describe('column span', () => {
    it('should span multiple columns', async () => {
      setColspan(childElements[0], 2);
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 0],
        [1],
      ]);
    });

    it('should be capped to currently available columns', async () => {
      setColspan(childElements[0], 2);
      await nextFrame();

      dashboard.style.width = `${columnWidth}px`;
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should span multiple columns on a single row', async () => {
      setColspan(childElements[0], 2);
      await nextFrame();

      dashboard.style.width = `${columnWidth * 3}px`;
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 0, 1],
      ]);
    });
  });

  describe('gap', () => {
    it('should have a default gap', () => {
      // Clear the gap used in the tests
      setGap(dashboard, undefined);
      // Increase the width of the dashboard to fit two items and a gap
      dashboard.style.width = `${columnWidth * 2 + remValue}px`;

      const { right: item0Right } = childElements[0].getBoundingClientRect();
      const { left: item1Left } = childElements[1].getBoundingClientRect();
      // Expect the items to have a gap of 1rem
      expect(item1Left - item0Right).to.eql(remValue);
    });

    it('should have a custom gap between items horizontally', () => {
      const customGap = 10;
      setGap(dashboard, customGap);
      // Increase the width of the dashboard to fit two items and a gap
      dashboard.style.width = `${columnWidth * 2 + customGap}px`;

      const { right: item0Right } = childElements[0].getBoundingClientRect();
      const { left: item1Left } = childElements[1].getBoundingClientRect();
      // Expect the items to have a gap of 10px
      expect(item1Left - item0Right).to.eql(customGap);
    });

    it('should have a custom gap between items vertically', () => {
      const customGap = 10;
      setGap(dashboard, customGap);
      dashboard.style.width = `${columnWidth}px`;

      const { bottom: item0Bottom } = childElements[0].getBoundingClientRect();
      const { top: item1Top } = childElements[1].getBoundingClientRect();
      // Expect the items to have a gap of 10px
      expect(item1Top - item0Bottom).to.eql(customGap);
    });
  });

  describe('maximum column count', () => {
    it('should not limit column count by default', () => {
      dashboard.style.width = `${columnWidth * 100}px`;
      expect(getColumnWidths(dashboard).length).to.eql(100);
    });

    it('should limit column count to custom value', async () => {
      setMaximumColumnCount(dashboard, 5);
      dashboard.style.width = `${columnWidth * 100}px`;
      await nextFrame();
      expect(getColumnWidths(dashboard).length).to.eql(5);
    });

    it('should limit column count to one', async () => {
      setMaximumColumnCount(dashboard, 1);
      dashboard.style.width = `${columnWidth * 10}px`;
      await nextFrame();
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should allow fewer columns', async () => {
      setMaximumColumnCount(dashboard, 2);
      dashboard.style.width = `${columnWidth}px`;
      await nextFrame();
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should limit to a single column even with colspan applied', async () => {
      setMaximumColumnCount(dashboard, 1);
      setColspan(childElements[0], 2);
      await nextFrame();
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
      ]);
    });

    it('should increase max column count dynamically', async () => {
      setMaximumColumnCount(dashboard, 2);
      dashboard.style.width = `${columnWidth * 100}px`;
      await nextFrame();
      expect(getColumnWidths(dashboard).length).to.eql(2);

      setMaximumColumnCount(dashboard, 20);
      await nextFrame();
      expect(getColumnWidths(dashboard).length).to.eql(20);
    });
  });

  describe('section', () => {
    beforeEach(async () => {
      const section = fixtureSync(`
        <vaadin-dashboard-section>
          <div id="item-2">Section item 2</div>
          <div id="item-3">Section item 3</div>
        </vaadin-dashboard-section>
        `);
      dashboard.appendChild(section);
      await nextFrame();
      childElements = [...dashboard.querySelectorAll('div')];
    });

    it('should span full width of the dashboard layout', () => {
      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1],
        [2, 3],
      ]);
    });

    it('should be on its own row', async () => {
      dashboard.style.width = `${columnWidth * 4}px`;
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1, null, null],
        [2, 3, null, null],
      ]);
    });

    it('following items should end up in the next row', async () => {
      dashboard.style.width = `${columnWidth * 4}px`;
      dashboard.appendChild(fixtureSync('<div id="item-4">Item 4</div>'));
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0, 1, null, null],
        [2, 3, null, null],
        [4],
      ]);
    });

    it('should be capped to currently available columns', async () => {
      dashboard.style.width = `${columnWidth}px`;
      await nextFrame();

      /* prettier-ignore */
      expectLayout(dashboard, [
        [0],
        [1],
        [2],
        [3],
      ]);
    });

    describe('gap', () => {
      it('should have a default gap', () => {
        // Clear the gap used in the tests
        setGap(dashboard, undefined);
        // Increase the width of the dashboard to fit two items and a gap
        dashboard.style.width = `${columnWidth * 2 + remValue}px`;

        const { right: item2Right } = childElements[2].getBoundingClientRect();
        const { left: item3Left } = childElements[3].getBoundingClientRect();
        // Expect the items to have a gap of 1rem
        expect(item3Left - item2Right).to.eql(remValue);
      });

      it('should have a custom gap between items horizontally', () => {
        const customGap = 10;
        setGap(dashboard, customGap);
        // Increase the width of the dashboard to fit two items and a gap
        dashboard.style.width = `${columnWidth * 2 + customGap}px`;

        const { right: item2Right } = childElements[2].getBoundingClientRect();
        const { left: item3Left } = childElements[3].getBoundingClientRect();
        // Expect the items to have a gap of 10px
        expect(item3Left - item2Right).to.eql(customGap);
      });

      it('should have a custom gap between items vertically', async () => {
        const customGap = 10;
        setGap(dashboard, customGap);
        dashboard.style.width = `${columnWidth}px`;
        await nextFrame();

        const { bottom: item2Bottom } = childElements[2].getBoundingClientRect();
        const { top: item3Top } = childElements[3].getBoundingClientRect();
        // Expect the items to have a gap of 10px
        expect(item3Top - item2Bottom).to.eql(customGap);
      });
    });
  });
});
