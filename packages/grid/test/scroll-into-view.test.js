import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './grid-test-styles.js';
import '../src/vaadin-grid.js';
import { flushGrid, getContainerCell, getLastVisibleItem, getPhysicalItems } from './helpers.js';

describe('scroll into view', () => {
  let grid, firstCell, secondCell, secondDetailsCell;

  function verifyRowFullyVisible(grid, rowIndex) {
    const scrollerBounds = grid.$.scroller.getBoundingClientRect();
    const row = getPhysicalItems(grid)[rowIndex];
    const rowBounds = row.getBoundingClientRect();
    expect(rowBounds.top).to.be.greaterThanOrEqual(scrollerBounds.top);
    expect(rowBounds.bottom).to.be.lessThanOrEqual(scrollerBounds.bottom);
  }

  function verifyRowNotFullyVisible(grid, rowIndex) {
    const scrollerBounds = grid.$.scroller.getBoundingClientRect();
    const row = getPhysicalItems(grid)[rowIndex];
    const rowBounds = row.getBoundingClientRect();
    const isTopInvisible = rowBounds.top < scrollerBounds.top;
    const isBottomInvisible = rowBounds.bottom > scrollerBounds.bottom;
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
    grid.rowDetailsRenderer = (root, _, model) => {
      root.innerHTML = `<div style="height: 30px">${model.item} details</div>`;
    };
    grid.items = [1, 2];
    grid.detailsOpenedItems = [2];

    flushGrid(grid);
    await nextFrame();

    firstCell = getContainerCell(grid.$.items, 0, 0);
    secondCell = getContainerCell(grid.$.items, 1, 0);
    secondDetailsCell = getLastVisibleItem(grid).querySelector('[part~="details-cell"]');
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should scroll row into view when focusing programmatically', () => {
    verifyRowNotFullyVisible(grid, 1);

    secondCell.focus();

    expect(grid.$.table.scrollTop).to.be.above(0);
    verifyRowFullyVisible(grid, 1);
  });

  it('should scroll row into view when focusing with keyboard navigation', async () => {
    verifyRowNotFullyVisible(grid, 1);

    firstCell.focus();
    await sendKeys({ press: 'ArrowDown' });

    expect(grid.$.table.scrollTop).to.be.above(0);
    verifyRowFullyVisible(grid, 1);
  });

  it('should not change scroll position when focusing row cell with click', async () => {
    verifyRowNotFullyVisible(grid, 1);

    const bounds = secondCell.getBoundingClientRect();
    await sendMouse({ type: 'click', position: [bounds.x + 5, bounds.y + 5] });

    expect(grid.$.table.scrollTop).to.equal(0);
  });

  it('should not change scroll position when focusing details cell with click', async () => {
    // Make details cell partially visible for clicking
    grid.style.height = '240px';
    await nextFrame();

    verifyRowNotFullyVisible(grid, 1);

    const bounds = secondDetailsCell.getBoundingClientRect();
    await sendMouse({ type: 'click', position: [bounds.x + 5, bounds.y + 5] });

    expect(grid.$.table.scrollTop).to.equal(0);
  });
});
