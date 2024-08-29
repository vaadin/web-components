import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import { flushGrid, getContainerCell, getLastVisibleItem } from './helpers.js';

describe('scroll into view', () => {
  let grid, firstCell, secondCell;

  function verifyCellFullyVisible(grid, cell) {
    const scrollerBounds = grid.$.scroller.getBoundingClientRect();
    const cellBounds = cell.getBoundingClientRect();
    expect(cellBounds.top).to.be.greaterThanOrEqual(scrollerBounds.top);
    expect(cellBounds.bottom).to.be.lessThanOrEqual(scrollerBounds.bottom);
  }

  function verifyCellNotFullyVisible(grid, cell) {
    const scrollerBounds = grid.$.scroller.getBoundingClientRect();
    const cellBounds = cell.getBoundingClientRect();
    const isTopInvisible = cellBounds.top < scrollerBounds.top;
    const isBottomInvisible = cellBounds.bottom > scrollerBounds.bottom;
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
      root.innerHTML = `<div style="height: 100px">${model.item}</div>`;
    };
    grid.items = [1, 2];
    flushGrid(grid);
    await nextFrame();

    firstCell = getContainerCell(grid.$.items, 0, 0);
    secondCell = getContainerCell(grid.$.items, 1, 0);
  });

  describe('body cells', () => {
    it('should scroll cell into view when focusing programmatically', () => {
      verifyCellNotFullyVisible(grid, secondCell);

      secondCell.focus();

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyCellFullyVisible(grid, secondCell);
    });

    it('should scroll cell into view when focusing with keyboard navigation', async () => {
      verifyCellNotFullyVisible(grid, secondCell);

      firstCell.focus();
      await sendKeys({ press: 'ArrowDown' });

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyCellFullyVisible(grid, secondCell);
    });

    it('should not change scroll position when focusing with click', async () => {
      verifyCellNotFullyVisible(grid, secondCell);

      const bounds = secondCell.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [bounds.x + 10, bounds.y + 10] });

      expect(grid.$.table.scrollTop).to.equal(0);
    });
  });

  describe('details cells', () => {
    let detailsCell;

    beforeEach(async () => {
      grid.rowDetailsRenderer = (root, _, model) => {
        root.innerHTML = `<div style="height: 50px">${model.item} details</div>`;
      };
      grid.detailsOpenedItems = [2];
      flushGrid(grid);
      await nextFrame();

      detailsCell = getLastVisibleItem(grid).querySelector('[part~="details-cell"]');
    });

    it('should scroll details cell into view when focusing row cell programmatically', () => {
      verifyCellNotFullyVisible(grid, detailsCell);

      secondCell.focus();

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyCellFullyVisible(grid, detailsCell);
    });

    it('should scroll cell into view when focusing row cell with keyboard navigation', async () => {
      verifyCellNotFullyVisible(grid, detailsCell);

      firstCell.focus();
      await sendKeys({ press: 'ArrowDown' });

      expect(grid.$.table.scrollTop).to.be.above(0);
      verifyCellFullyVisible(grid, detailsCell);
    });

    it('should not change scroll position when focusing details cell with click', async () => {
      verifyCellNotFullyVisible(grid, detailsCell);

      const bounds = detailsCell.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [bounds.x + 10, bounds.y + 10] });

      expect(grid.$.table.scrollTop).to.equal(0);
    });
  });
});
