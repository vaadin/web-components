import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/badge';
import '@vaadin/grid';
import { flushGrid, getBodyCellContent } from '@vaadin/grid/test/helpers.js';

describe('badge in grid', () => {
  let grid, column;

  const items = [
    { status: 'Confirmed' },
    { status: 'Pending approval' },
    { status: 'Shipped to customer' },
    { status: 'Cancelled by administrator' },
  ];

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 800px; height: 400px">
        <vaadin-grid-column auto-width flex-grow="0"></vaadin-grid-column>
      </vaadin-grid>
    `);
    column = grid.querySelector('vaadin-grid-column');
    column.renderer = (root, _, model) => {
      root.innerHTML = `<vaadin-badge>${model.item.status}</vaadin-badge>`;
    };
    grid.items = items;
    flushGrid(grid);
    await nextRender();
  });

  it('should not change the auto-width column width on recalculation', () => {
    const width = column.width;
    grid.recalculateColumnWidths();
    expect(column.width).to.equal(width);
  });

  it('should not clip the badge in the auto-width column', () => {
    items.forEach((_, index) => {
      const content = getBodyCellContent(grid, index, 0);
      expect(content.firstElementChild.offsetWidth).to.be.at.most(content.offsetWidth);
    });
  });
});
