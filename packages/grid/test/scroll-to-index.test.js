import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import '../vaadin-grid.js';
import '../vaadin-grid-tree-column.js';
import {
  flushGrid,
  getFirstVisibleItem,
  getLastVisibleItem,
  getPhysicalAverage,
  getPhysicalItems,
  infiniteDataProvider,
  onceInvoked,
} from './helpers.js';

const createGrid = (height, size) => {
  const grid = fixtureSync(`
    <vaadin-grid style="width: 200px; height: ${height}px;" size="${size}">
      <vaadin-grid-column header="foo"></vaadin-grid-column>
    </vaadin-grid>
  `);
  grid.firstElementChild.renderer = (root, _, model) => {
    root.textContent = model.index;
  };
  return grid;
};

const fixtures = {
  small: () => createGrid(200, 200),
  large: () => createGrid(500, 500000000),
};

describe('scroll to index', () => {
  ['small', 'large'].forEach((scale) => {
    describe(`Scroll: ${scale}`, () => {
      let grid;

      beforeEach(async () => {
        grid = fixtures[scale]();
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
          grid.$.table.scrollHeight / 20,
        );
      });

      it('should retain virtual scroll position on size change', () => {
        const index = grid.size / 2;
        grid.scrollToIndex(index);
        flushGrid(grid);
        grid.scrollTop += 1; // Scroll a little to validate the test
        let row = Array.from(grid.$.items.children).find((r) => r.index === index);
        const rowTop = row.getBoundingClientRect().top;

        grid.size -= ~~(grid.size / 4);
        row = Array.from(grid.$.items.children).find((r) => r.index === index);
        expect(row.getBoundingClientRect().top).to.be.closeTo(rowTop, 0.5);
      });
    });
  });

  describe('other', () => {
    let grid;

    beforeEach(async () => {
      grid = fixtures.large();
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
          cb(Array(...new Array(grid.pageSize)).map((_, index) => `${scope}foo${index}`));
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

    it('should scroll to index after unhiding', async () => {
      grid.hidden = true;
      grid.scrollToIndex(100);
      grid.hidden = false;

      await onceInvoked(grid, 'scrollToIndex');
      expect(getFirstVisibleItem(grid).index).to.be.above(75);
      expect(grid.$.table.scrollTop).to.be.above(0);
    });

    it('should scroll to index only once', (done) => {
      grid.dataProvider = ({ page }, cb) => {
        if (page === 0) {
          // Still in loading state, this will end up as pending scroll to index
          grid.scrollToIndex(100);
          // Resolve the request, no longer in loading state after this
          cb(Array(...new Array(grid.pageSize)).map((_, index) => `foo${index}`));
          flushGrid(grid);

          // Scroll to a new location (new data will get loaded)
          grid.scrollToIndex(200);
          flushGrid(grid);
          expect(getFirstVisibleItem(grid).index).to.be.above(150);
          done();
        } else {
          cb(Array(...new Array(grid.pageSize)).map((_, index) => `foo${index}`));
        }
      };
    });
  });

  describe('Added item', () => {
    let grid, data;

    beforeEach(() => {
      grid = fixtures.large();
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
      grid = fixtureSync(`
        <vaadin-grid style="width: 200px; height: 500px;" item-has-children-path="hasChildren">
          <vaadin-grid-tree-column path="name" header="foo"></vaadin-grid-tree-column>
        </vaadin-grid>
      `);
    });

    // Issue https://github.com/vaadin/vaadin-grid/issues/2107
    it('should display correctly when scrolled to bottom immediately after setting dataProvider', (done) => {
      grid.size = 1;
      const numberOfChildren = 250;
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
              return { name: `Child ${offset + index}`, hasChildren: false };
            }),
            numberOfChildren,
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
              hasChildren: false,
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

    describe('scrolling to hierachical index', () => {
      let pendingRequests = [];

      function flushPendingRequests() {
        const requests = pendingRequests;
        pendingRequests = [];
        requests.forEach((request) => request());
      }

      function getFirstVisibleItemId() {
        return getFirstVisibleItem(grid)._item.name;
      }

      beforeEach(async () => {
        grid.size = 25;
        grid.itemIdPath = 'name';

        grid.dataProvider = ({ parentItem, page, pageSize }, cb) => {
          const levelSize = 100;

          const pageItems = [...Array(Math.min(levelSize, pageSize))].map((_, i) => {
            const indexInLevel = page * pageSize + i;

            return {
              name: `${parentItem ? `${parentItem.name}-` : ''}${indexInLevel}`,
              hasChildren: true,
            };
          });

          pendingRequests.push(() => cb(pageItems, levelSize));
        };

        flushPendingRequests();
        flushGrid(grid);
        await oneEvent(grid, 'animationend');
        await nextFrame();
      });

      it('should scroll to root level index', () => {
        grid.scrollToIndex(30);
        expect(getFirstVisibleItemId()).to.equal('30');
      });

      it('should scroll to lazily loaded root level index', () => {
        grid.scrollToIndex(75);
        expect(getFirstVisibleItemId()).not.to.equal('75');

        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('75');
      });

      it('should scroll to root level index with expanded previous siblings', () => {
        grid.expandedItems = [{ name: '0' }];
        flushPendingRequests();
        grid.scrollToIndex(30);
        expect(getFirstVisibleItemId()).to.equal('30');
      });

      it('should scroll to root level index with expanded and collapsed previous siblings', () => {
        grid.expandedItems = [{ name: '0' }];
        flushPendingRequests();
        grid.expandedItems = [];
        flushPendingRequests();
        grid.scrollToIndex(30);
        expect(getFirstVisibleItemId()).to.equal('30');
      });

      it('should scroll to expanded root level index', () => {
        grid.expandedItems = [{ name: '5' }];
        flushPendingRequests();
        grid.scrollToIndex(5);
        expect(getFirstVisibleItemId()).to.equal('5');
      });

      it('should scroll to expanded and collapsed root level index', () => {
        grid.expandedItems = [{ name: '5' }];
        flushPendingRequests();
        grid.expandedItems = [];
        flushPendingRequests();
        grid.scrollToIndex(5, 0);
        expect(getFirstVisibleItemId()).to.equal('5');
      });

      it('should scroll to lazily loaded root level index with expanded previous siblings', () => {
        grid.expandedItems = [{ name: '0' }];
        grid.scrollToIndex(75);
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('75');
      });

      it('should scroll to nested level index', () => {
        grid.expandedItems = [{ name: '0' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 5);
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to lazily loaded nested level index', () => {
        grid.expandedItems = [{ name: '0' }];
        grid.scrollToIndex(0, 5);
        expect(getFirstVisibleItemId()).not.to.equal('0-5');

        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to first nested level index on negative index', () => {
        grid.expandedItems = [{ name: '0' }];
        grid.scrollToIndex(0, -1);
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('0-0');
      });

      it('should scroll to last nested level index on index larger than nested level size', () => {
        grid.expandedItems = [{ name: '0' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 100);
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('0-99');
      });

      it('should scroll to nested level index with expanded previous siblings', () => {
        grid.expandedItems = [{ name: '0' }, { name: '0-0' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 5);
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to nested level index with expanded and collapsed previous siblings', () => {
        grid.expandedItems = [{ name: '0' }, { name: '0-0' }];
        flushPendingRequests();
        grid.expandedItems = [{ name: '0' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 5);
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to expanded nested level index', () => {
        grid.expandedItems = [{ name: '0' }, { name: '0-5' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 5);
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to expanded and collapsed nested level index', () => {
        grid.expandedItems = [{ name: '0' }, { name: '0-5' }];
        flushPendingRequests();
        grid.expandedItems = [{ name: '0' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 5);
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to lazily loaded nested level index with expanded previous siblings', () => {
        grid.expandedItems = [{ name: '0' }, { name: '0-0' }];
        grid.scrollToIndex(0, 5);
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('0-5');
      });

      it('should scroll to a grandchild item with parents having expanded previous siblings', () => {
        grid.expandedItems = [{ name: '0' }, { name: '0-0' }, { name: '0-0-0' }, { name: '0-5' }];
        flushPendingRequests();
        grid.scrollToIndex(0, 5, 5);
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('0-5-5');
      });

      it('should scroll to the last child of an expanded item on an unloaded page', () => {
        grid.expandedItems = [{ name: '75' }];
        flushPendingRequests();
        grid.scrollToIndex(75, 100);
        // Need to flush multiple times because between the flushes, grid may expand and scroll, making more data requests
        flushPendingRequests();
        flushPendingRequests();
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('75-99');
      });

      it('should scroll to index following an expanded index', () => {
        grid.expandedItems = [{ name: '74' }];
        flushPendingRequests();
        grid.scrollToIndex(75);
        flushPendingRequests();
        flushPendingRequests();
        flushPendingRequests();
        expect(getFirstVisibleItemId()).to.equal('75');
      });

      describe('with a synchronous data provider', () => {
        beforeEach(() => {
          grid.dataProvider = ({ parentItem, page, pageSize }, cb) => {
            const pageItems = [...Array(Math.min(200, pageSize))].map((_, i) => {
              const indexInLevel = page * pageSize + i;
              return {
                name: `${parentItem ? `${parentItem.name}-` : ''}${indexInLevel}`,
                children: true,
              };
            });

            cb(pageItems, 200);
          };
        });

        it('should scroll to a child of an expanded item on an unloaded page', () => {
          grid.expandedItems = [{ name: '75' }];
          grid.scrollToIndex(75, 100);
          expect(getFirstVisibleItemId()).to.equal('75-100');
        });
      });
    });
  });
});
