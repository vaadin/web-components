import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, getCellContent, getContainerCell } from './helpers.js';

describe('scroll into view', () => {
  let grid, firstCell, secondRow, secondCell;

  function verifyFullyVisible(element) {
    const scrollerBounds = grid.$.scroller.getBoundingClientRect();
    const elementBounds = element.getBoundingClientRect();
    expect(elementBounds.top).to.be.greaterThanOrEqual(scrollerBounds.top);
    expect(elementBounds.bottom).to.be.lessThanOrEqual(scrollerBounds.bottom);
  }

  function verifyNotFullyVisible(element) {
    const scrollerBounds = grid.$.scroller.getBoundingClientRect();
    const elementBounds = element.getBoundingClientRect();
    const isTopInvisible = elementBounds.top < scrollerBounds.top;
    const isBottomInvisible = elementBounds.bottom > scrollerBounds.bottom;
    expect(isTopInvisible || isBottomInvisible).to.be.true;
  }

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="height: 150px">
        <vaadin-grid-column></vaadin-grid-column>
      </vaadin-grid>
    `);
    const column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, model) => {
      root.innerHTML = `<div style="height: 100px">${model.item} <textarea style="height: 80px"></div>`;
    };
    grid.rowDetailsRenderer = (root, _, model) => {
      root.innerHTML = `<div style="height: 10px">${model.item} Details</div>`;
    };
    grid.items = [1, 2];
    grid.detailsOpenedItems = [1, 2];

    flushGrid(grid);
    await nextFrame();

    firstCell = getContainerCell(grid.$.items, 0, 0);
    secondCell = getContainerCell(grid.$.items, 1, 0);
    secondRow = secondCell.parentElement;
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('rows and cells', () => {
    it('should scroll row into view when focusing row programmatically', () => {
      verifyNotFullyVisible(secondRow);

      secondRow.focus();

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyFullyVisible(secondRow);
    });

    it('should scroll row into view when focusing cell programmatically', () => {
      verifyNotFullyVisible(secondRow);

      secondCell.focus();

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyFullyVisible(secondRow);
    });

    it('should scroll row into view when focusing row with keyboard navigation', async () => {
      verifyNotFullyVisible(secondRow);

      firstCell.focus();
      // Move focus to first row
      await sendKeys({ press: 'ArrowLeft' });
      // Move focus to second row
      await sendKeys({ press: 'ArrowDown' });

      expect(grid.shadowRoot.activeElement).to.equal(secondRow);
      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyFullyVisible(secondRow);
    });

    it('should scroll row into view when focusing cell with keyboard navigation', async () => {
      verifyNotFullyVisible(secondRow);

      firstCell.focus();
      // Move to details cell of first row
      await sendKeys({ press: 'ArrowDown' });
      // Move to column cell of second row
      await sendKeys({ press: 'ArrowDown' });

      expect(grid.shadowRoot.activeElement).to.equal(secondCell);
      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyFullyVisible(secondRow);
    });

    it('should not change scroll position when focusing row cell with click', async () => {
      verifyNotFullyVisible(secondRow);

      const bounds = secondCell.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [bounds.x + 5, bounds.y + 5] });

      expect(grid.$.table.scrollTop).to.equal(0);
    });
  });

  describe('focusable elements in cells', () => {
    it('should only scroll focusable element into view when it receives focus', async () => {
      const secondCellInput = getCellContent(secondCell).querySelector('textarea');

      verifyNotFullyVisible(secondRow);
      verifyNotFullyVisible(secondCellInput);

      // Enter navigation mode in first cell, Tab to textarea in second cell
      firstCell.focus();
      await sendKeys({ press: 'Enter' });
      await sendKeys({ press: 'Tab' });

      // Second input should be focused and fully visible, but second row should not be fully visible
      expect(document.activeElement).to.equal(secondCellInput);
      verifyFullyVisible(secondCellInput);
      verifyNotFullyVisible(secondRow);
    });
  });
});
