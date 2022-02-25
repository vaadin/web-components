import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {
  flushGrid,
  getCellContent,
  getLastVisibleItem,
  getPhysicalAverage,
  getPhysicalItems,
  infiniteDataProvider
} from './helpers.js';

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

import('../vaadin-grid.js');

describe('dynamic physical count', () => {
  let scroller, grid;

  before(() => customElements.whenDefined('vaadin-grid'));

  beforeEach(async () => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 200px;" size="200" theme="no-border">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    await nextFrame();
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
});
