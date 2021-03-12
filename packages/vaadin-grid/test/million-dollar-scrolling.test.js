import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import {
  flushGrid,
  getCellContent,
  getFirstCell,
  getFirstVisibleItem,
  getLastVisibleItem,
  infiniteDataProvider,
  scrollToEnd
} from './helpers.js';
import '../vaadin-grid.js';

class XGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        .item {
          height: 30px;
        }

        vaadin-grid-cell-content {
          /* Override Lumo theme */
          padding: 0 !important;
        }
      </style>
      <vaadin-grid size="100" id="grid" style="height: 300px;">
        <vaadin-grid-column>
          <template>
            <div class="item">item[[index]]</div>
          </template>
          <template class="header">Header</template>
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('x-grid', XGrid);

function simulateScrollToStart(grid, done) {
  // make sure not over scroll more than the delta threshold limit of 10k.
  const table = grid.$.table;
  const listener = () => {
    if (table.scrollTop > 0) {
      table.scrollTop -= 2000;
      grid._scrollHandler();
    } else {
      table.removeEventListener('scroll', listener);
      setTimeout(done, 100);
    }
  };
  table.addEventListener('scroll', listener);
  table.scrollTop -= 2500;
}

function simulateScrollToEnd(grid, done) {
  // make sure not over scroll more than the delta threshold limit of 10k.
  const table = grid.$.table;
  const listener = () => {
    if (table.scrollTop < table.scrollHeight - table.clientHeight - 1) {
      table.scrollTop += 2500;
      grid._scrollHandler();
    } else {
      table.removeEventListener('scroll', listener);
      setTimeout(done, 100);
    }
  };
  table.addEventListener('scroll', listener);
  table.scrollTop += 2500;
}

describe('huge grid', function () {
  let grid;

  beforeEach(() => {
    grid = fixtureSync('<x-grid></x-grid>').$.grid;
    grid.size = 1000000;
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should reduce the size of a huge scrolled grid to one', () => {
    scrollToEnd(grid);

    expect(() => {
      grid.size = 1;
      flushGrid(grid);
    }).not.to.throw(Error);
  });

  it('should reduce the size of a huge scrolled grid to a size larger than one', () => {
    scrollToEnd(grid);

    expect(() => {
      grid.size = 10000;
      flushGrid(grid);
    }).not.to.throw(Error);
  });
});

describe('scrolling', function () {
  let container, grid;
  this.timeout(300000);

  [100, 1000000].forEach((size) => {
    describe(size + ' items', () => {
      beforeEach((done) => {
        container = fixtureSync('<x-grid></x-grid>');
        grid = container.$.grid;
        grid.dataProvider = infiniteDataProvider;
        grid.size = size;

        scrollToEnd(grid, () => {
          grid._scrollToIndex(0);
          done();
        });
      });

      it('should be able to scroll to half-way', () => {
        grid._scrollHandler();
        grid.$.table.scrollTop = (grid.$.table.scrollHeight - grid.$.table.offsetHeight) / 2;

        grid._scrollHandler();
        flushGrid(grid);

        expect(getFirstCell(grid)._instance.index).to.be.closeTo(grid.size / 2, 20);
      });

      it('should be able to scroll to end', (done) => {
        scrollToEnd(grid, () => {
          expect(getCellContent(getLastVisibleItem(grid)).textContent).to.contain('item' + (grid.size - 1));
          done();
        });
      });

      it('should be able to manually scroll to start', (done) => {
        const index = ~~((20000 / grid.$.table.scrollHeight) * grid.size);
        grid._scrollToIndex(index);

        simulateScrollToStart(grid, () => {
          expect(getCellContent(getFirstVisibleItem(grid)).textContent).to.contain('item0');
          done();
        });
      });

      it('should be able to manually scroll to end', (done) => {
        grid._scrollToIndex(grid.size * 0.99);

        simulateScrollToEnd(grid, () => {
          expect(getCellContent(getLastVisibleItem(grid)).textContent).to.contain('item' + (grid.size - 1));
          done();
        });
      });
    });
  });
});
