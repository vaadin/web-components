import { click, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import { flushGrid } from '../helpers.js';
import { users } from './users.js';

describe('grid', () => {
  let element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('header and footer', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid size="200" style="width: 200px; height: 100px">
              <vaadin-grid-column header="header"></vaadin-grid-column>
            </vaadin-grid>
          `);
          element.rowDetailsRenderer = (root, _grid, model) => {
            root.textContent = model.index;
          };
          const column = element.querySelector('vaadin-grid-column');
          column.footerRenderer = (root) => {
            root.textContent = 'footer';
          };
          column.renderer = (root, _column, model) => {
            root.textContent = model.index;
          };

          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        it('header footer', async () => {
          await visualDiff(element, `${dir}-header-footer`);
        });
      });

      describe('column groups', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid style="height: 250px" column-reordering-allowed>
              <vaadin-grid-column width="30px" flex-grow="0" resizable header="#"></vaadin-grid-column>

              <vaadin-grid-column-group resizable header="Name">
                <vaadin-grid-column width="calc(20% - 50px)" path="name.first"></vaadin-grid-column>
                <vaadin-grid-column width="calc(20% - 50px)" path="name.last"></vaadin-grid-column>
              </vaadin-grid-column-group>

              <vaadin-grid-column-group resizable header="Location">
                <vaadin-grid-column width="calc(20% - 50px)" path="location.city"></vaadin-grid-column>
                <vaadin-grid-column width="calc(20% - 50px)" path="location.state"></vaadin-grid-column>
                <vaadin-grid-column width="200px" resizable path="location.street"></vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid>
          `);
          element.items = users;
          const indexColumn = element.querySelector('vaadin-grid-column[header="#"]');
          indexColumn.renderer = (root, _column, model) => {
            root.textContent = model.index;
          };

          flushGrid(element);
          await nextRender(element);
        });

        it('column groups', async () => {
          await visualDiff(element, `${dir}-column-groups`);
        });
      });

      describe('row details', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid>
              <vaadin-grid-column-group>
                <vaadin-grid-column width="55px" flex-grow="0"></vaadin-grid-column>
                <vaadin-grid-column resizable path="email"></vaadin-grid-column>
                <vaadin-grid-column path="location.city"></vaadin-grid-column>
                <vaadin-grid-column path="location.state"></vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid>
          `);
          element.items = users;
          element.rowDetailsRenderer = (root, _grid, model) => {
            root.innerHTML = `
              <div class="details-cell">
                <h1>Hi, I'm ${model.item.name.first}</h1>
              </div>
            `;
          };

          const columnGroup = element.querySelector('vaadin-grid-column-group');
          columnGroup.headerRenderer = (root) => {
            root.innerHTML = `
              <div class="header-content">
                <b>1-200 of 15,554</b>
                <input placeholder="Search profiles" focus-target />
              </div>
            `;
          };

          const firstColumn = element.querySelector('vaadin-grid-column');
          firstColumn.renderer = (root, _column, model) => {
            if (!root.firstElementChild) {
              root.innerHTML = `<input type="checkbox">`;
              root.firstElementChild.addEventListener('change', ({ target }) => {
                if (target.checked) {
                  element.selectItem(target.__item);
                } else {
                  element.deselectItem(target.__item);
                }
              });
            }
            const checkbox = root.firstElementChild;
            checkbox.__item = model.item;
            checkbox.checked = model.selected;
          };

          flushGrid(element);
          await nextRender(element);
        });

        it('row details', async () => {
          element.openItemDetails(element.items[0]);
          await visualDiff(element, `${dir}-row-details`);
        });
      });

      describe('sorting', () => {
        let firstSorter, secondSorter;

        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid style="height: 250px" multi-sort>
              <vaadin-grid-column width="50px" header="#"></vaadin-grid-column>
              <vaadin-grid-sort-column path="name.first" header="First name"></vaadin-grid-sort-column>
              <vaadin-grid-sort-column path="name.last" header="Last name"></vaadin-grid-sort-column>
            </vaadin-grid>
          `);
          element.items = users;
          const indexColumn = element.querySelector('vaadin-grid-column[header="#"]');
          indexColumn.renderer = (root, _column, model) => {
            root.textContent = model.index;
          };

          flushGrid(element);
          await nextRender(element);
          const sorters = [...document.querySelectorAll('vaadin-grid-sorter')];
          firstSorter = sorters.find((sorter) => sorter.textContent === 'First name');
          secondSorter = sorters.find((sorter) => sorter.textContent === 'Last name');
        });

        it('initial', async () => {
          await visualDiff(element, `${dir}-sorting-initial`);
        });

        it('single asc', async () => {
          click(firstSorter);
          await visualDiff(element, `${dir}-sorting-single-asc`);
        });

        it('multi asc asc', async () => {
          click(firstSorter);
          click(secondSorter);
          await visualDiff(element, `${dir}-sorting-multi-asc-asc`);
        });

        it('multi asc desc', async () => {
          click(firstSorter);
          click(secondSorter);
          click(secondSorter);
          await visualDiff(element, `${dir}-sorting-multi-asc-desc`);
        });

        it('single desc', async () => {
          click(firstSorter);
          click(firstSorter);
          await visualDiff(element, `${dir}-sorting-single-desc`);
        });
      });

      describe('row focus', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid style="width: 550px">
              <vaadin-grid-column-group header="Name" frozen>
                <vaadin-grid-column path="name.first" width="200px" flex-shrink="0"></vaadin-grid-column>
                <vaadin-grid-column path="name.last" width="200px" flex-shrink="0"></vaadin-grid-column>
              </vaadin-grid-column-group>
              <vaadin-grid-column path="location.city" width="200px" flex-shrink="0"></vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);

          // Scroll all the way to end
          element.$.table.scrollLeft = element.__isRTL ? -1000 : 1000;

          // Focus a header row
          await sendKeys({ press: 'Tab' });
          // Switch to row focus mode
          await sendKeys({ press: element.__isRTL ? 'ArrowRight' : 'ArrowLeft' });
          // Tab to body row
          await sendKeys({ press: 'Tab' });

          await nextRender(element);
        });

        it('row focus', async () => {
          await visualDiff(element, `${dir}-row-focus`);
        });

        it('row focus - header', async () => {
          // Focus a header row
          element.tabIndex = 0;
          element.focus();
          await sendKeys({ press: 'Tab' });

          await visualDiff(element, `${dir}-row-focus-header`);
        });
      });

      describe('frozen', () => {
        beforeEach(() => {
          element = fixtureSync(`
            <vaadin-grid style="max-width: 600px">
              <vaadin-grid-column path="name.first" width="200px" flex-shrink="0" frozen></vaadin-grid-column>
              <vaadin-grid-column path="name.last" width="200px" flex-shrink="0" ></vaadin-grid-column>
              <vaadin-grid-column path="location.city" width="200px" flex-shrink="0"></vaadin-grid-column>
              <vaadin-grid-column path="location.state" width="200px" flex-shrink="0" frozen-to-end></vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
        });

        it('start', async () => {
          await visualDiff(element, `${dir}-frozen-start`);
        });

        it('middle', async () => {
          element.$.table.scrollLeft = element.__isRTL ? -180 : 180;
          await visualDiff(element, `${dir}-frozen-middle`);
        });

        it('end', async () => {
          element.$.table.scrollLeft = element.__isRTL ? -400 : 400;
          await visualDiff(element, `${dir}-frozen-end`);
        });
      });
    });
  });

  describe('drag and drop', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid drop-mode="on-top-or-between" rows-draggable>
          <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
          <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
          <vaadin-grid-column path="email"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.rowDetailsRenderer = (root) => {
        root.innerHTML = '<p>Details</p>';
      };
      element.items = users;
      flushGrid(element);
      await nextRender(element);
    });

    it('dragover', async () => {
      element.setAttribute('dragover', '');
      await visualDiff(element, 'dragover');
    });

    it('dragover on top', async () => {
      element.$.items.children[1].setAttribute('dragover', 'on-top');
      await visualDiff(element, 'row-dragover-on-top');
    });

    it('dragover above', async () => {
      element.$.items.children[1].setAttribute('dragover', 'above');
      await visualDiff(element, 'row-dragover-above');
    });

    it('dragover below', async () => {
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, 'row-dragover-below');
    });

    it('dragover above details', async () => {
      element.detailsOpenedItems = [element.items[1]];
      element.$.items.children[1].setAttribute('dragover', 'above');
      await visualDiff(element, 'row-dragover-above-details');
    });

    it('dragover below details', async () => {
      element.detailsOpenedItems = [element.items[1]];
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, 'row-dragover-below-details');
    });

    it('dragover row dragstart', async () => {
      element.$.items.children[1].setAttribute('dragstart', '123');
      await visualDiff(element, 'row-dragstart');
    });

    it('dragover below last row with all rows visible', async () => {
      element.allRowsVisible = true;
      element.items = element.items.slice(0, 2);
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, 'dragover-below-last-row-all-rows-visible');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
          <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
          <vaadin-grid-column path="email"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.items = users;
      flushGrid(element);
      await nextRender(element);
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(element, 'disabled');
    });
  });

  describe('tree', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid item-id-path="name">
          <vaadin-grid-tree-column path="name" width="200px" flex-shrink="0"></vaadin-grid-tree-column>
          <vaadin-grid-column path="name" width="200px" flex-shrink="0"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.dataProvider = ({ parentItem, page, pageSize }, cb) => {
        // Let's have 10 root-level items and 3 items on every child level
        const levelSize = parentItem ? 3 : 10;

        const pageItems = [...Array(Math.min(levelSize, pageSize))].map((_, i) => {
          const indexInLevel = page * pageSize + i;

          return {
            name: `Very long grid item name ${parentItem ? `${parentItem.name}-` : ''}${indexInLevel}`,
            children: true,
          };
        });

        cb(pageItems, levelSize);
      };
      flushGrid(element);
      await nextRender(element);
    });

    it('default', async () => {
      await visualDiff(element, 'tree-default');
    });

    it('overflow', async () => {
      element.style.maxWidth = '400px';
      await visualDiff(element, 'tree-overflow');
    });
  });
});
