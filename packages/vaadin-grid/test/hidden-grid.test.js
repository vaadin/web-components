import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@open-wc/testing-helpers';
import { flushGrid, getBodyCellContent, infiniteDataProvider } from './helpers.js';
import '../vaadin-grid.js';

describe('hidden grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="height: 200px; width: 200px;" hidden size="1">
        <vaadin-grid-column>
          <template class="header">foo</template>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should be hidden', () => {
    expect(grid.offsetWidth).to.equal(0);
    expect(grid.offsetHeight).to.equal(0);
  });

  it('should have content on appear', async () => {
    grid.removeAttribute('hidden');
    await oneEvent(grid, 'animationend');
    expect(getBodyCellContent(grid, 0, 0).textContent).to.equal('0');
  });
});
