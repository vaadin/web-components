import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, keyDownOn, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import Sinon from 'sinon';
import '../vaadin-grid.js';
import { flushGrid, getCellContent, getHeaderCellContent, onceResized } from './helpers.js';

['ltr', 'rtl'].forEach((dir) => {
  describe(`lazy column rendering - ${dir}`, () => {
    let grid, cellContent, columns;

    function resetRenderers() {
      columns.forEach((column) => {
        column.renderer.resetHistory();
      });
    }

    function getBodyCell(rowIndex, columnIndex) {
      const row = grid._getVisibleRows()[rowIndex];
      return [...row.children].find((cell) => cell.firstElementChild.assignedNodes()[0].__columnIndex === columnIndex);
    }

    function getBodyCellSlot(columnIndex) {
      return getBodyCell(0, columnIndex).firstElementChild;
    }

    function isBodyCellRendered(columnIndex) {
      return columns[columnIndex].renderer.called;
    }

    function isBodyCellContentHidden(columnIndex) {
      return !getBodyCell(0, columnIndex);
    }

    function getBodyCellContent(columnIndex) {
      const slot = getBodyCellSlot(columnIndex);
      return slot.assignedNodes()[0];
    }

    function isBodyCellContentUpToDate(columnIndex) {
      return getBodyCellContent(columnIndex).textContent === `${cellContent} ${columnIndex}`;
    }

    function expectBodyCellUpdated(columnIndex) {
      expect(isBodyCellRendered(columnIndex)).to.be.true;
      expect(isBodyCellContentUpToDate(columnIndex)).to.be.true;
    }

    function expectBodyCellNotRendered(columnIndex) {
      expect(isBodyCellRendered(columnIndex)).to.be.false;
      expect(isBodyCellContentHidden(columnIndex)).to.be.true;
    }

    function isColumnInViewport(column) {
      const rect = column._sizerCell.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      return rect.right >= gridRect.left && rect.left <= gridRect.right;
    }

    function getLastVisibleColumnIndex() {
      return grid._getColumnsInOrder().findIndex((column, index, columns) => {
        return isColumnInViewport(column) && (index === columns.length - 1 || !isColumnInViewport(columns[index + 1]));
      });
    }

    const UPDATE_CONTENT_VISIBILITY_DEBOUNCER_TIMEOUT = 100;
    async function scrollHorizontally(delta, debounceTimeout = UPDATE_CONTENT_VISIBILITY_DEBOUNCER_TIMEOUT) {
      grid.$.table.scrollLeft += dir === 'rtl' ? -delta : delta;
      await oneEvent(grid.$.table, 'scroll');
      await aTimeout(debounceTimeout);
    }

    before(() => {
      document.documentElement.setAttribute('dir', dir);
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    beforeEach(async () => {
      grid = fixtureSync(`<vaadin-grid style="width: 400px;"></vaadin-grid>`);
      cellContent = 'cell';

      columns = [];
      for (let i = 0; i < 10; i++) {
        const column = document.createElement('vaadin-grid-column');
        column.header = `Col ${i}`;

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        column.renderer = Sinon.spy((root) => {
          root.__columnIndex = i;
          root.textContent = `${cellContent} ${i}`;
        });

        columns.push(column);
        grid.appendChild(column);
      }

      grid.items = [{ name: `Item 1` }];

      grid.columnRendering = 'lazy';
      // Wait for the initial resize observer callback
      await onceResized(grid);
      flushGrid(grid);
    });

    it('should render columns inside the viewport', () => {
      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
    });

    it('should not render columns outside the viewport', () => {
      expectBodyCellNotRendered(getLastVisibleColumnIndex() + 1);
      expectBodyCellNotRendered(columns.length - 1);
    });

    it('new rows - should render columns inside the viewport', () => {
      resetRenderers();
      grid.items = [{ name: `Item 1` }, { name: `Item 2` }];
      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
    });

    it('new rows - should not render columns outside the viewport', () => {
      resetRenderers();
      grid.items = [{ name: `Item 1` }, { name: `Item 2` }];
      expectBodyCellNotRendered(getLastVisibleColumnIndex() + 1);
      expectBodyCellNotRendered(columns.length - 1);
    });

    it('should render columns revealed columns on resize', async () => {
      grid.style.width = `${grid.$.table.scrollWidth}px`;
      await onceResized(grid);
      expectBodyCellUpdated(getLastVisibleColumnIndex());
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should always render header cells', () => {
      expect(getHeaderCellContent(grid, 0, columns.length - 1).textContent).to.equal(`Col ${columns.length - 1}`);
    });

    it('should render frozen to end columns', async () => {
      columns.at(-1).frozenToEnd = true;
      await nextFrame();
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should position frozen to end columns correctly', async () => {
      const column = columns.at(-1);
      column.frozenToEnd = true;
      await nextFrame();

      const frozenToEndBodyCell = getBodyCell(0, 9);
      const frozenToEndHeaderCell = column._headerCell;

      expect(frozenToEndBodyCell.getBoundingClientRect().left).to.equal(
        frozenToEndHeaderCell.getBoundingClientRect().left,
      );
      expect(frozenToEndBodyCell.getBoundingClientRect().right).to.equal(
        frozenToEndHeaderCell.getBoundingClientRect().right,
      );
    });

    it('should switch back to eager columns', () => {
      grid.columnRendering = 'eager';

      expectBodyCellUpdated(0);
      expectBodyCellUpdated(1);
      expectBodyCellUpdated(2);
      expectBodyCellUpdated(columns.length - 1);
    });

    it('should switch back to lazy columns', () => {
      grid.columnRendering = 'eager';
      resetRenderers();
      grid.columnRendering = 'lazy';

      expectBodyCellNotRendered(getLastVisibleColumnIndex() + 1);
      expectBodyCellNotRendered(columns.length - 1);
    });

    it('should have a larger row height when details opened', () => {
      // Disable cell padding for this test
      fixtureSync(`
        <style>
          vaadin-grid-cell-content {
            padding: 0;
          }
        </style>
      `);

      grid.items = [{ name: `Item 1` }, { name: `Item 2` }];

      // Opend details for the first row
      const detailsHeight = 100;
      grid.rowDetailsRenderer = (root) => {
        root.innerHTML = `<div style="height: ${detailsHeight}px;">Details</div>`;
      };
      grid.detailsOpenedItems = [grid.items[0]];

      flushGrid(grid);
      const firstRect = getBodyCell(0, 0).getBoundingClientRect();
      const secondRect = getBodyCell(1, 0).getBoundingClientRect();
      expect(secondRect.top).to.equal(firstRect.bottom + detailsHeight);
    });

    describe(`scroll horizontally - ${dir}`, () => {
      /**
       * Expect the cells DOM order to match the column order
       */
      function expectCellsDomOrderToMatchColumnOrder() {
        const firstRow = grid._getVisibleRows()[0];
        const expectedOrder = [...firstRow.children].sort(
          (a, b) => columns.indexOf(a._column) - columns.indexOf(b._column),
        );
        expect(expectedOrder).to.deep.equal([...firstRow.children]);
      }

      /**
       * Expect the cells visual order to match the column order
       */
      function expectCellsVisualOrderToMatchColumnOrder() {
        const firstRow = grid._getVisibleRows()[0];
        [...firstRow.children].forEach((cell) => {
          expect(cell.getBoundingClientRect().left).to.equal(cell._column._headerCell.getBoundingClientRect().left);
          expect(cell.getBoundingClientRect().right).to.equal(cell._column._headerCell.getBoundingClientRect().right);
        });
      }

      beforeEach(async () => {
        resetRenderers();
        await scrollHorizontally(grid.$.table.scrollWidth);
      });

      it('should render columns inside the viewport', () => {
        expectBodyCellUpdated(columns.length - 2);
        expectBodyCellUpdated(columns.length - 1);
      });

      it('should not render columns outside the viewport', () => {
        expectBodyCellNotRendered(0);
        expectBodyCellNotRendered(1);
      });

      it('should not render columns outside the viewport on update', () => {
        grid.requestContentUpdate();
        expectBodyCellNotRendered(0);
        expectBodyCellNotRendered(1);
      });

      it('should render columns revealed columns on resize', async () => {
        grid.style.width = `${grid.$.table.scrollWidth}px`;
        await onceResized(grid);
        expectBodyCellUpdated(0);
        expectBodyCellUpdated(1);
      });

      it('should render frozen columns', async () => {
        columns[0].frozen = true;
        await nextFrame();
        expectBodyCellUpdated(0);
      });

      it('should debounce scrolling', async () => {
        resetRenderers();

        // Scroll back to the beginning
        // Use half of the debounce timeout so the debouncer is not yet executed
        await scrollHorizontally(-grid.$.table.scrollWidth, UPDATE_CONTENT_VISIBILITY_DEBOUNCER_TIMEOUT / 2);
        expectBodyCellNotRendered(0);

        // Scroll back to the end
        // Use half of the debounce timeout so the debouncer is not yet executed
        await scrollHorizontally(grid.$.table.scrollWidth, UPDATE_CONTENT_VISIBILITY_DEBOUNCER_TIMEOUT / 2);

        // Scroll back to the beginning
        // Use half of the debounce timeout so the debouncer is not yet executed
        await scrollHorizontally(-grid.$.table.scrollWidth, UPDATE_CONTENT_VISIBILITY_DEBOUNCER_TIMEOUT / 2);
        expectBodyCellNotRendered(0);

        // Wait for the second half of the debounce timeout so the debouncer is executed
        await aTimeout(UPDATE_CONTENT_VISIBILITY_DEBOUNCER_TIMEOUT / 2);
        expectBodyCellUpdated(0);
      });

      it('should update content of previously rendererd cells on revisit', async () => {
        const index = columns.length - 1;
        expect(getBodyCellContent(index).textContent).to.equal(`cell ${index}`);

        cellContent = 'updated';
        grid.requestContentUpdate();
        expect(getBodyCellContent(index).textContent).to.equal(`updated ${index}`);

        // Scroll back to the beginning
        await scrollHorizontally(-grid.$.table.scrollWidth);

        expect(getBodyCellContent(0).textContent).to.equal('updated 0');
      });

      it('should maintain the sequential DOM order of the cells', async () => {
        expectCellsDomOrderToMatchColumnOrder();

        // Scroll back a bit
        await scrollHorizontally(-100);
        await scrollHorizontally(-100);

        expectCellsDomOrderToMatchColumnOrder();
      });

      it('should visually position the rendered cells correctly', async () => {
        expectCellsVisualOrderToMatchColumnOrder();
      });

      it('should visually position the rendered cells correctly after scrolling', async () => {
        // Scroll back a bit
        await scrollHorizontally(-100);
        await scrollHorizontally(-100);

        expectCellsVisualOrderToMatchColumnOrder();
      });

      it('should visually position the frozen cells correctly', async () => {
        columns[0].frozen = true;
        await nextFrame();

        expectCellsVisualOrderToMatchColumnOrder();
      });

      it('should visually position the frozen to end cells correctly', async () => {
        columns.at(-1).frozenToEnd = true;
        await nextFrame();

        expectCellsVisualOrderToMatchColumnOrder();
      });
    });

    describe(`keyboard navigation - ${dir}`, () => {
      function left() {
        keyDownOn(grid.shadowRoot.activeElement, 37, [], 'ArrowLeft');
      }

      function right() {
        keyDownOn(grid.shadowRoot.activeElement, 39, [], 'ArrowRight');
      }

      function forward() {
        if (dir === 'rtl') {
          left();
        } else {
          right();
        }
      }

      function backward() {
        if (dir === 'rtl') {
          right();
        } else {
          left();
        }
      }

      function end() {
        keyDownOn(grid.shadowRoot.activeElement, 35, [], 'End');
      }

      function home() {
        keyDownOn(grid.shadowRoot.activeElement, 36, [], 'Home');
      }

      function tab() {
        keyDownOn(grid.shadowRoot.activeElement, 9, [], 'Tab');
      }

      function shiftTab() {
        keyDownOn(grid.shadowRoot.activeElement, 9, 'shift', 'Tab');
      }

      function getFocusedCellText() {
        const focusedCell = grid.shadowRoot.activeElement;
        return getCellContent(focusedCell).textContent;
      }

      beforeEach(async () => {
        getBodyCell(0, 0).focus();
        await nextFrame();
      });

      it('should focus the cells of initially hidden columns', () => {
        const lastVisibleIndex = getLastVisibleColumnIndex();
        const lastVisibleCell = getBodyCell(0, lastVisibleIndex);
        lastVisibleCell.focus();
        backward();
        expect(getFocusedCellText()).to.equal(`cell ${lastVisibleIndex - 1}`);
        forward();
        expect(getFocusedCellText()).to.equal(`cell ${lastVisibleIndex}`);
        forward();
        expect(getFocusedCellText()).to.equal(`cell ${lastVisibleIndex + 1}`);
        forward();
        expect(getFocusedCellText()).to.equal(`cell ${lastVisibleIndex + 2}`);
      });

      it('should focus the last cell on the row', () => {
        end();
        expect(getFocusedCellText()).to.equal(`cell ${columns.length - 1}`);
      });

      it('should focus the first cell on the row', () => {
        end();
        home();
        expect(getFocusedCellText()).to.equal('cell 0');
      });

      it('should focus the frozen to end cell without scrolling', async () => {
        columns.at(-1).frozenToEnd = true;
        const left = grid.$.table.scrollLeft;
        await nextFrame();
        end();
        expect(grid.$.table.scrollLeft).to.equal(left);
      });

      it('should focus the frozen cell without scrolling', async () => {
        columns[0].frozen = true;
        end();
        const left = grid.$.table.scrollLeft;
        await nextFrame();
        home();
        expect(grid.$.table.scrollLeft).to.equal(left);
      });

      it('should focus the cell before frozen to end cell', () => {
        columns.at(-1).frozenToEnd = true;
        end();
        backward();
        expect(getFocusedCellText()).to.equal(`cell ${columns.length - 2}`);
      });

      it('should focus the cell after frozen cell', () => {
        columns[0].frozen = true;
        end();
        home();
        forward();
        expect(getFocusedCellText()).to.equal('cell 1');
      });

      it('should have a focusable body cell after scrolling', async () => {
        // Tab to header
        shiftTab();

        // Scroll to the end
        await scrollHorizontally(grid.$.table.scrollWidth);
        await nextFrame();

        const left = grid.$.table.scrollLeft;
        // Tab to body
        tab();

        // Expect the focused element to be a cell
        expect(grid.shadowRoot.activeElement.localName).to.equal('td');
        // Expect still to be scrolled to the end
        expect(grid.$.table.scrollLeft).to.equal(left);
      });

      it('should not change the focusable body cell after scrolling', async () => {
        forward();
        const focusedCellText = getFocusedCellText();
        // Tab to header
        shiftTab();
        await nextFrame();

        await scrollHorizontally(1);

        // Tab to body
        tab();
        await nextFrame();
        await nextFrame();

        // Expect the focused element to be the same cell
        expect(getFocusedCellText()).to.equal(focusedCellText);
      });
    });
  });
});
