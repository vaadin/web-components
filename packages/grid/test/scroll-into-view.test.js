import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, getCellContent, getContainerCell } from './helpers.js';

describe('scroll into view', () => {
  let grid, column, firstCell, secondRow, secondCell;

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
    column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, model) => {
      root.innerHTML = `<div style="height: 100px">${model.item} <textarea style="height: 80px"></div>`;
    };
    grid.items = [1, 2];

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
      // Move to column cell of second row
      await sendKeys({ press: 'ArrowDown' });

      expect(grid.shadowRoot.activeElement).to.equal(secondCell);
      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyFullyVisible(secondRow);
    });

    it('should scroll row into view when focusing nested element', () => {
      verifyNotFullyVisible(secondRow);

      const secondTextArea = getCellContent(secondCell).querySelector('textarea');
      secondTextArea.focus();

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

  describe('row is larger than viewport', () => {
    beforeEach(async () => {
      column.renderer = (root, _, model) => {
        root.innerHTML = `<div style="height: 200px">${model.item} <textarea style="height: 80px"></div>`;
      };
      flushGrid(grid);
      await nextFrame();
    });

    it('should only scroll focusable element into view when it receives focus', async () => {
      // Scroll down a bit to make second row partially visible
      grid.$.table.scrollTop = 60;
      await nextFrame();
      verifyNotFullyVisible(secondRow);

      const secondTextArea = getCellContent(secondCell).querySelector('textarea');
      secondTextArea.focus();

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyFullyVisible(secondTextArea);
      verifyNotFullyVisible(secondRow);
    });
  });
});
