import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-template-renderer';
import {
  flushGrid,
  getFirstVisibleItem,
  getLastVisibleItem,
  getPhysicalAverage,
  getPhysicalItems,
  infiniteDataProvider
} from './helpers.js';
import '../vaadin-grid.js';
import '../vaadin-grid-tree-column.js';

const fixtures = {
  small: `
    <vaadin-grid style="width: 200px; height: 200px;" size="100">
      <vaadin-grid-column>
        <template class="header">foo</template>
        <template>[[index]]</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `,
  large: `
    <vaadin-grid style="width: 200px; height: 500px;" size="500000000">
      <vaadin-grid-column>
        <template class="header">foo</template>
        <template>[[index]]</template>
      </vaadin-grid-column>
    </vaadin-grid>
  `,
  treeGrid: `
    <vaadin-grid style="width: 200px; height: 500px;">
      <vaadin-grid-tree-column path="name" header="foo" item-has-children-path="hasChildren"></vaadin-grid-tree-column>
    </vaadin-grid>
  `
};

describe('scroll to index', () => {
  ['small', 'large'].forEach((scale) => {
    describe('Scroll: ' + scale, () => {
      let grid;

      beforeEach(async () => {
        grid = fixtureSync(fixtures[scale]);
        grid.dataProvider = infiniteDataProvider;
        flushGrid(grid);
        await nextFrame();
      });

      it('should scroll to scaled index', () => {
        [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 77, 88, 100].forEach((percentage) => {
          const index = Math.ceil(((grid.size - 1) * percentage) / 100);
          grid.scrollToIndex(0);
          grid.scrollToIndex(index);

          if (percentage === 100) {
            expect(getLastVisibleItem(grid).index).to.equal(index);

            const table = grid.$.table;
            expect(table.scrollTop).to.equal(table.scrollHeight - table.offsetHeight);
          } else {
            expect(getFirstVisibleItem(grid).index).to.equal(index);
          }
        });
      });

      it('should scroll to last index', () => {
        grid.scrollToIndex(grid.size * 2);
        expect(getLastVisibleItem(grid).index).to.equal(grid.size - 1);
      });

      it('should scroll to first index', () => {
        grid.scrollToIndex(-100);
        expect(getFirstVisibleItem(grid).index).to.equal(0);
      });

      it('should set scroll position half-way', () => {
        grid.scrollToIndex(grid.size / 2);
        flushGrid(grid);
        expect(grid.$.table.scrollTop).to.be.closeTo(
          (grid.$.table.scrollHeight - grid.$.table.offsetHeight) / 2,
          grid.$.table.scrollHeight / 20
        );
      });

      it('should retain virtual scroll position on size change', () => {
        const index = grid.size / 2;
        grid.scrollToIndex(index);
        flushGrid(grid);
        grid.scrollTop += 1; // Scroll a little to validate the test
        let row = Array.from(grid.$.items.children).filter((r) => r.index === index)[0];
        const rowTop = row.getBoundingClientRect().top;

        grid.size -= ~~(grid.size / 4);
        row = Array.from(grid.$.items.children).filter((r) => r.index === index)[0];
        expect(row.getBoundingClientRect().top).to.be.closeTo(rowTop, 0.5);
      });
    });
  });

  describe('other', () => {
    let grid;

    beforeEach(async () => {
      grid = fixtureSync(fixtures.large);
      grid.dataProvider = infiniteDataProvider;
      flushGrid(grid);
      grid.scrollToIndex(10);
      await nextFrame();
    });

    it('should scroll to index', () => {
      expect(getFirstVisibleItem(grid).index).to.equal(10);
    });

    it('should have correct indexes after scrolling', (done) => {
      const listener = () => {
        flushGrid(grid);
        // Check that the rows are in order
        const rows = grid.$.items.querySelectorAll('[part~="row"]');
        for (let i = 1; i < rows.length; i++) {
          expect(rows[i].index).to.equal(rows[i - 1].index + 1);
        }
        done();
      };

      grid.scrollToIndex(100);
      listenOnce(grid.$.table, 'scroll', listener);
      grid.$.table.scrollTop -= 1;
    });

    it('should scroll close to end', () => {
      const viewPortItemCount = Math.round(grid.offsetHeight / getPhysicalAverage(grid) - 1); // - header;
      const targetIndex = grid.size - viewPortItemCount - 2;
      grid.scrollToIndex(targetIndex);

      const rect = grid.$.header.getBoundingClientRect();
      const cell = grid.shadowRoot.elementFromPoint(rect.left + 1, rect.bottom + 2);
      expect(cell.parentElement.index).to.equal(targetIndex);
    });

    it('should continue scrolling after child items get loaded', (done) => {
      grid.size = 50;
      grid.expandedItems = ['foo49'];
      grid.dataProvider = ({ parentItem }, cb) => {
        setTimeout(() => {
          const scope = parentItem || '';
          cb(Array(...new Array(grid.pageSize)).map((_, index) => scope + 'foo' + index));
          if (parentItem) {
            expect(getFirstVisibleItem(grid).index).to.be.above(75);
            done();
          }
        });
      };
      grid.scrollToIndex(100);
    });

    it('should scroll to index after attaching', (done) => {
      const parent = grid.parentElement;
      parent.removeChild(grid);
      grid.scrollToIndex(100);
      grid.addEventListener('animationend', () => {
        requestAnimationFrame(() => {
          expect(getFirstVisibleItem(grid).index).to.be.above(75);
          expect(grid.$.table.scrollTop).to.be.above(0);
          done();
        });
      });
      parent.appendChild(grid);
    });

    it('should scroll to index only once', (done) => {
      grid.dataProvider = ({ page }, cb) => {
        if (page === 0) {
          // Still in loading state, this will end up as pending scroll to index
          grid.scrollToIndex(100);
          // Resolve the request, no longer in loading state after this
          cb(Array(...new Array(grid.pageSize)).map((_, index) => 'foo' + index));
          flushGrid(grid);

          // Scroll to a new location (new data will get loaded)
          grid.scrollToIndex(200);
          flushGrid(grid);
          expect(getFirstVisibleItem(grid).index).to.be.above(150);
          done();
        } else {
          cb(Array(...new Array(grid.pageSize)).map((_, index) => 'foo' + index));
        }
      };
    });
  });

  describe('Added item', () => {
    let grid, data;

    beforeEach(() => {
      grid = fixtureSync(fixtures.large);
      data = Array(...new Array(10)).map((_, i) => {
        return { index: i };
      });

      grid.size = 10;
      grid.dataProvider = function (params, callback) {
        callback(data);
      };

      flushGrid(grid);
    });

    it('should not reassign the first item on scrollToIndex', () => {
      const newExpectedSize = grid.size + 1;
      grid.size = newExpectedSize;
      data.push({ index: 11 });
      grid.scrollToIndex(grid.size - 1);

      expect(grid.$.items.children[0]._item.index).to.equal(0);
    });
  });
  describe('Tree grid', () => {
    let grid;

    beforeEach(() => {
      grid = fixtureSync(fixtures.treeGrid);
    });

    // Issue https://github.com/vaadin/vaadin-grid/issues/2107
    it('should display correctly when scrolled to bottom immediately after setting dataProvider', (done) => {
      grid.size = 1;
      const numberOfChidren = 250;
      grid.itemIdPath = 'name';
      const PARENT = { name: 'PARENT', hasChildren: true };
      grid.dataProvider = ({ page, parentItem }, cb) => {
        setTimeout(() => {
          if (!parentItem) {
            cb([PARENT], 1);
            return;
          }

          const offset = page * grid.pageSize;
          cb(
            [...new Array(grid.pageSize)].map((_, index) => {
              return { name: 'Child ' + (offset + index), hasChildren: false };
            }),
            numberOfChidren
          );
          if (page > 0) {
            expect(getPhysicalItems(grid).length).to.be.above(10);
            done();
          }
        });
      };
      grid.expandedItems = [PARENT];
      grid.scrollToIndex(250);
    });

    it('should not reuse rows if subitems are loaded while scrolling to bottom', (done) => {
      grid.size = 25;

      const parents = Array.from({ length: 10 }).map((_, i) => ({ name: i, hasChildren: true }));

      grid.dataProvider = ({ parentItem }, cb) => {
        setTimeout(() => {
          if (!parentItem) {
            cb(parents, parents.length);
          } else {
            const { name: parentName } = parentItem;
            const children = Array.from({ length: 10 }).map((_, i) => ({
              name: `${parentName * 10 + i}`,
              hasChildren: false
            }));
            cb(children, children.length);

            expect(getPhysicalItems(grid).length).to.be.above(10);
            done();
          }
        });
      };

      grid.expandedItems = [parents[parents.length - 1]];
      grid.scrollToIndex(14);
    });
  });
});
