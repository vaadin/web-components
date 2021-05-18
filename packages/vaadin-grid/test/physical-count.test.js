import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/vaadin-template-renderer';
import {
  buildDataSet,
  flushGrid,
  getCellContent,
  getLastVisibleItem,
  getPhysicalAverage,
  getPhysicalItems,
  infiniteDataProvider
} from './helpers.js';
import '../vaadin-grid.js';

registerStyles(
  'vaadin-grid',
  css`
    :host {
      font-size: 16px;
      line-height: 1.5;
    }

    :host(.small) [part~='cell'] {
      line-height: 10px;
      padding: 0 !important;
      min-height: 0 !important;
    }

    ::slotted(vaadin-grid-cell-content) {
      padding: 0 !important;
    }
  `
);

describe('dynamic physical count', () => {
  let scroller, grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 200px;" size="200" theme="no-border">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    scroller = grid.$.scroller;
    flushGrid(grid);
  });

  it('increase pool size', () => {
    const lastItem = getLastVisibleItem(grid);
    const expectedFinalItem = Math.ceil(grid.offsetHeight / getPhysicalAverage(grid)) - 1;

    expect(scroller.offsetHeight).to.equal(grid.offsetHeight);
    expect(getCellContent(lastItem).textContent).to.equal(String(expectedFinalItem));
  });

  it('increase pool size after resizing the scroller', () => {
    grid.classList.add('small');
    grid.style.display = 'none';

    const initialPhysicalSize = getPhysicalItems(grid).length;

    grid.style.display = '';
    flushGrid(grid);

    expect(getPhysicalItems(grid).length).to.be.above(initialPhysicalSize);
  });

  it('pool should not increase if the scroller has no size', () => {
    const initialPhysicalSize = getPhysicalItems(grid).length;

    grid.style.display = 'none';
    grid.style.height = '1000px';

    grid.classList.add('small');
    flushGrid(grid);

    expect(getPhysicalItems(grid).length).to.equal(initialPhysicalSize);
  });

  it('should minimize physical count', () => {
    expect(getPhysicalItems(grid).length).to.be.below(26);
    grid.style.height = '1000px';
    flushGrid(grid);

    expect(getPhysicalItems(grid).length).to.be.above(26);
    expect(getPhysicalItems(grid).length).to.be.below(70);
  });

  it('should not add unlimited amount of physical rows', () => {
    const itemCount = 50;
    grid.items = buildDataSet(itemCount);
    flushGrid(grid);

    // Repro for a really special bug:

    // 1: notifyResize will trigger _increasePoolIfNeeded
    grid.notifyResize();
    // 2: Hide grid
    grid.hidden = true;
    // 3: notifyResize will trigger updateViewportBoundaries which sets _viewPortHeight to 0 because grid is not rendered
    grid.notifyResize();
    // 4: Restore grid to render tree
    grid.hidden = false;
    // 5: Finally flush the grid, and finish the async callback started at phase 1.
    // _optPhysicalSize will be Infinity at this point so unlimited amount of rows would get added!
    // Only thing that limits it is the grid.items count.
    flushGrid(grid);

    expect(grid.$.items.childElementCount).to.be.below(itemCount);
  });
});
