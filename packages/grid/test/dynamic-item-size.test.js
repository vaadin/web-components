import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../vaadin-grid.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { flushGrid, getFirstVisibleItem, infiniteDataProvider } from './helpers.js';

registerStyles(
  'vaadin-grid',
  css`
    [part~='cell']:not([part~='details-cell']) ::slotted(vaadin-grid-cell-content) {
      padding: 0 !important;
    }

    [part~='cell'] {
      padding: 1px;
      line-height: 18px;
    }

    :host(.high) [part~='cell'] {
      line-height: 100px;
    }
  `,
);

describe('dynamic item size', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <vaadin-grid style="width: 200px; height: 200px;" size="1000">
        <vaadin-grid-column>
          <template>[[index]]</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `);
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('update size using item index', () => {
    const firstItem = getFirstVisibleItem(grid);
    expect(firstItem.offsetHeight).to.be.below(100);

    grid.classList.add('high');
    flushGrid(grid);
    expect(firstItem.offsetHeight).not.to.be.below(100);
  });
});
